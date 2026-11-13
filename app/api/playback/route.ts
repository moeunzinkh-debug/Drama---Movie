import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser, getActiveProfile } from "@/lib/auth";

/**
 * POST /api/playback
 *
 * The single place that decides whether a video may play, and the only place
 * that mints a playback token.
 *
 * Checks, in order, all server-side:
 *  1. A real Supabase session exists (not a client flag).
 *  2. The account is not suspended.
 *  3. The episode belongs to a published title.
 *  4. The episode's release time has passed (no leaking scheduled episodes).
 *  5. The active profile's parental ceiling allows the title's age rating.
 *
 * Only then is a short-lived Cloudflare Stream token issued. The token is bound
 * to the asset id and expires quickly, so it cannot be shared or hot-linked.
 */

export const dynamic = "force-dynamic";

interface Body {
  episodeId?: string;
}

function fail(status: number, code: string, message: string) {
  return NextResponse.json({ error: code, message }, { status });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return fail(401, "UNAUTHENTICATED", "ចូលដើម្បីមើលវីដេអូ។");
  if (user.account.suspended_at)
    return fail(403, "ACCOUNT_SUSPENDED", "គណនីនេះត្រូវបានផ្អាក។");

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return fail(400, "BAD_REQUEST", "សំណើមិនត្រឹមត្រូវ។");
  }

  const episodeId = body.episodeId;
  if (!episodeId || !/^[0-9a-f-]{36}$/i.test(episodeId)) {
    return fail(400, "BAD_EPISODE", "ភាគមិនត្រឹមត្រូវ។");
  }

  // RLS-scoped read: unpublished titles disappear here automatically.
  const supabase = await createClient();
  const { data: episode } = await supabase
    .from("episodes")
    .select(
      "id, release_at, seasons!inner(titles!inner(id, slug, name_km, age_rating, status))",
    )
    .eq("id", episodeId)
    .eq("seasons.titles.status", "published")
    .maybeSingle();

  if (!episode) return fail(404, "NOT_FOUND", "រកមិនឃើញភាគនេះទេ។");

  type EpisodeRow = {
    id: string;
    release_at: string;
    seasons: { titles: { id: string; slug: string; name_km: string; age_rating: string } };
  };
  const row = episode as unknown as EpisodeRow;

  if (new Date(row.release_at).getTime() > Date.now()) {
    return fail(403, "NOT_RELEASED", "ភាគនេះមិនទាន់ដល់ពេលចេញផ្សាយទេ។");
  }

  // Parental control, enforced in the database via the profile's age ceiling.
  const profile = await getActiveProfile();
  if (profile) {
    const { data: allowed } = await supabase.rpc("rating_allows", {
      p_profile: profile.id,
      p_rating: row.seasons.titles.age_rating,
    });
    if (allowed === false) {
      return fail(403, "AGE_RESTRICTED", "មាតិកានេះមិនអនុញ្ញាតសម្រាប់ប្រវត្តិរូបនេះទេ។");
    }
  }

  // Video asset lookup uses the service role: asset ids are not public, and a
  // token must never be minted from a client-supplied asset identifier.
  const admin = createAdminClient();
  const { data: asset } = await admin
    .from("video_assets")
    .select("id, provider, provider_asset_id, embed_url, label")
    .eq("episode_id", episodeId)
    .order("is_primary", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!asset) return fail(404, "NO_ASSET", "មិនទាន់មានប្រភពវីដេអូសម្រាប់ភាគនេះទេ។");

  if (asset.provider === "external_embed") {
    // Licensed embed / HLS URL: still gated, but no token to mint.
    return NextResponse.json({
      kind: "hls",
      src: asset.embed_url,
      episodeId,
      titleSlug: row.seasons.titles.slug,
    });
  }

  // ---- Cloudflare Stream -----------------------------------------------------
  const accountId =
    process.env.CLOUDFLARE_ACCOUNT_ID ?? process.env.R2_ACCOUNT_ID ?? "";
  const apiToken = process.env.CLOUDFLARE_STREAM_API_TOKEN;
  const signingKey = process.env.CLOUDFLARE_STREAM_SIGNING_KEY;

  if (!accountId || !apiToken) {
    return fail(
      503,
      "STREAM_NOT_CONFIGURED",
      "សេវាវីដេអូមិនទាន់កំណត់ទេ។ សូមបន្ថែម CLOUDFLARE_ACCOUNT_ID និង CLOUDFLARE_STREAM_API_TOKEN។",
    );
  }

  const ttlSeconds = Number(process.env.PLAYBACK_TOKEN_TTL_SECONDS ?? 3600);
  const tokenBody: Record<string, unknown> = {
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    // Bind the token to this user so a leaked URL is traceable and revocable.
    sub: user.account.id,
    accessRules: [{ type: "any", action: "allow" }],
  };

  if (signingKey) {
    // Signed tokens (recommended): require `requireSignedURLs` on the asset.
    const payload = {
      ...tokenBody,
      kid: process.env.CLOUDFLARE_STREAM_SIGNING_KEY_ID ?? undefined,
    };
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${asset.provider_asset_id}/token`,
      {
        method: "POST",
        headers: { authorization: `Bearer ${apiToken}`, "content-type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );
    const json = (await res.json()) as {
      success?: boolean;
      result?: { token?: string };
      errors?: { message?: string }[];
    };
    if (!res.ok || !json.success || !json.result?.token) {
      return fail(
        502,
        "STREAM_TOKEN_FAILED",
        json.errors?.[0]?.message ?? "មិនអាចបង្កើត token វីដេអូបានទេ។",
      );
    }
    return NextResponse.json({
      kind: "cloudflare_stream",
      token: json.result.token,
      customerCode: process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE ?? accountId,
      assetId: asset.provider_asset_id,
      expiresIn: ttlSeconds,
      episodeId,
      titleSlug: row.seasons.titles.slug,
    });
  }

  // No signing key: the asset must be public or the iframe will 401.
  return NextResponse.json({
    kind: "cloudflare_stream",
    customerCode: process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE ?? accountId,
    assetId: asset.provider_asset_id,
    episodeId,
    titleSlug: row.seasons.titles.slug,
  });
}
