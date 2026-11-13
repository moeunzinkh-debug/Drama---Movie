"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { adsEnabled } from "@/lib/supabase/env";

/**
 * Admin mutations.
 *
 * Every action calls requireAdmin() first, which re-reads user_roles from the
 * database. RLS is the second layer. Every write is followed by an audit log
 * entry so admin activity is traceable.
 */

export type AdminResult = { ok: true; id?: string } | { ok: false; error: string };

async function audit(
  actorId: string,
  action: string,
  entity: string,
  entityId: string | null,
  before: unknown,
  after: unknown,
) {
  const supabase = await createClient();
  await supabase.from("admin_audit_logs").insert({
    actor_id: actorId,
    action,
    entity,
    entity_id: entityId,
    before: before ?? null,
    after: after ?? null,
  });
}

export interface TitleInput {
  slug: string;
  name: string;
  nameKm: string;
  altTitle?: string;
  type: "movie" | "drama";
  synopsis: string;
  synopsisKm: string;
  tagline: string;
  taglineKm: string;
  countrySlug?: string;
  releaseYear?: number;
  ageRating: string;
  status: "draft" | "scheduled" | "published" | "archived";
  featured: boolean;
  popularity: number;
  rightsNote: string;
  categorySlugs: string[];
}

export async function upsertTitle(input: TitleInput): Promise<AdminResult> {
  const admin = await requireAdmin();

  if (!/^[a-z0-9-]+$/.test(input.slug)) {
    return { ok: false, error: "slug អាចមានតែ a-z, 0-9 និង -" };
  }
  if (!input.name.trim() || !input.nameKm.trim()) {
    return { ok: false, error: "ត្រូវបំពេញឈ្មោះទាំងខ្មែរ និងអង់គ្លេស។" };
  }
  if (!input.rightsNote.trim() && input.status === "published") {
    return { ok: false, error: "ត្រូវកត់ត្រាសិទ្ធិមាតិកា មុនពេលផ្សាយ។" };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("titles")
    .select("id")
    .eq("slug", input.slug)
    .maybeSingle();

  const payload = {
    slug: input.slug,
    name: input.name.trim(),
    name_km: input.nameKm.trim(),
    alt_title: input.altTitle?.trim() || null,
    type: input.type,
    synopsis: input.synopsis,
    synopsis_km: input.synopsisKm,
    tagline: input.tagline,
    tagline_km: input.taglineKm,
    country_slug: input.countrySlug || null,
    release_year: input.releaseYear ?? null,
    age_rating: input.ageRating,
    status: input.status,
    featured: input.featured,
    popularity: input.popularity,
    rights_note: input.rightsNote,
    published_at:
      input.status === "published" ? new Date().toISOString() : null,
  };

  const { data, error } = existing
    ? await supabase.from("titles").update(payload).eq("id", existing.id).select("id").single()
    : await supabase.from("titles").insert({ ...payload, created_by: admin.account.id }).select("id").single();

  if (error) return { ok: false, error: error.message };

  // Replace category links.
  await supabase.from("title_categories").delete().eq("title_id", data.id);
  if (input.categorySlugs.length) {
    await supabase.from("title_categories").insert(
      input.categorySlugs.map((c) => ({ title_id: data.id, category_slug: c })),
    );
  }

  await audit(admin.account.id, existing ? "title.update" : "title.create", "titles", data.id, existing, payload);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/title/${input.slug}`);
  return { ok: true, id: data.id };
}

export async function setTitleStatus(
  titleId: string,
  status: "draft" | "scheduled" | "published" | "archived",
): Promise<AdminResult> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { data: before } = await supabase.from("titles").select("status, rights_note").eq("id", titleId).maybeSingle();

  if (!before) return { ok: false, error: "រកមិនឃើញចំណងជើង។" };
  // Publishing without a rights note is not allowed.
  if (status === "published" && !String(before.rights_note ?? "").trim()) {
    return { ok: false, error: "ត្រូវកត់ត្រាសិទ្ធិមាតិកា មុនពេលផ្សាយ។" };
  }

  const { error } = await supabase
    .from("titles")
    .update({ status, published_at: status === "published" ? new Date().toISOString() : null })
    .eq("id", titleId);

  if (error) return { ok: false, error: error.message };

  await audit(admin.account.id, "title.setStatus", "titles", titleId, before, { status });
  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true };
}

export interface EpisodeInput {
  titleId: string;
  seasonNumber: number;
  number: number;
  name: string;
  nameKm: string;
  durationSeconds?: number;
  releaseAt: string;
}

export async function upsertEpisode(input: EpisodeInput): Promise<AdminResult> {
  const admin = await requireAdmin();
  if (input.number < 1) return { ok: false, error: "លេខភាគត្រូវធំជាង 0។" };

  const supabase = await createClient();

  // Ensure the season exists.
  const { data: season } = await supabase
    .from("seasons")
    .upsert(
      { title_id: input.titleId, number: input.seasonNumber, name: `Season ${input.seasonNumber}` },
      { onConflict: "title_id,number" },
    )
    .select("id")
    .single();

  if (!season) return { ok: false, error: "មិនអាចបង្កើតរដូវបានទេ។" };

  const payload = {
    title_id: input.titleId,
    season_id: season.id,
    number: input.number,
    name: input.name,
    name_km: input.nameKm,
    duration_seconds: input.durationSeconds ?? null,
    release_at: input.releaseAt,
  };

  const { data, error } = await supabase
    .from("episodes")
    .upsert(payload, { onConflict: "season_id,number" })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  await audit(admin.account.id, "episode.upsert", "episodes", data.id, null, payload);
  revalidatePath("/admin/episodes");
  return { ok: true, id: data.id };
}

export interface VideoAssetInput {
  episodeId: string;
  provider: "cloudflare_stream" | "external_embed";
  providerAssetId?: string;
  embedUrl?: string;
}

export async function attachVideoAsset(input: VideoAssetInput): Promise<AdminResult> {
  const admin = await requireAdmin();

  if (input.provider === "cloudflare_stream" && !input.providerAssetId?.trim()) {
    return { ok: false, error: "ត្រូវបញ្ចូល Cloudflare Stream video UID។" };
  }
  if (input.provider === "external_embed" && !/^https?:\/\//.test(input.embedUrl ?? "")) {
    return { ok: false, error: "ត្រូវបញ្ចូល URL ត្រឹមត្រូវ (https://…)." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("video_assets")
    .upsert(
      {
        episode_id: input.episodeId,
        provider: input.provider,
        provider_asset_id: input.providerAssetId?.trim() || null,
        embed_url: input.embedUrl?.trim() || null,
        label: "main",
        is_primary: true,
      },
      { onConflict: "episode_id,label" },
    )
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  await audit(admin.account.id, "video.attach", "video_assets", data.id, null, {
    episode_id: input.episodeId,
    provider: input.provider,
  });
  return { ok: true, id: data.id };
}

export async function setAdPlacementEnabled(id: string, enabled: boolean): Promise<AdminResult> {
  const admin = await requireAdmin();

  // Guard rail: never allow ads on while the provider flag is off.
  if (enabled && !adsEnabled()) {
    return {
      ok: false,
      error:
        "NEXT_PUBLIC_ADS_ENABLED=false។ ត្រូវបើក flag នេះបន្ទាប់ពីអ្នកផ្តល់សេវាអនុម័តសិន។",
    };
  }

  const supabase = await createClient();
  const { data: before } = await supabase.from("ad_placements").select("enabled").eq("id", id).maybeSingle();
  const { error } = await supabase.from("ad_placements").update({ enabled }).eq("id", id);
  if (error) return { ok: false, error: error.message };

  await audit(admin.account.id, "ads.toggle", "ad_placements", id, before, { enabled });
  revalidatePath("/admin");
  return { ok: true };
}

export async function setRequestStatus(
  requestId: string,
  status: "pending" | "planned" | "fulfilled" | "rejected",
): Promise<AdminResult> {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { data: before } = await supabase.from("movie_requests").select("status").eq("id", requestId).maybeSingle();
  const { error } = await supabase.from("movie_requests").update({ status }).eq("id", requestId);
  if (error) return { ok: false, error: error.message };
  await audit(admin.account.id, "request.setStatus", "movie_requests", requestId, before, { status });
  revalidatePath("/admin/requests");
  return { ok: true };
}

export async function suspendAccount(accountId: string, suspend: boolean, reason?: string): Promise<AdminResult> {
  const admin = await requireAdmin();
  if (accountId === admin.account.id) {
    return { ok: false, error: "មិនអាចផ្អាកគណនីខ្លួនឯងបានទេ។" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("accounts")
    .update({
      suspended_at: suspend ? new Date().toISOString() : null,
      suspended_reason: suspend ? (reason ?? null) : null,
    })
    .eq("id", accountId);

  if (error) return { ok: false, error: error.message };
  await audit(admin.account.id, suspend ? "account.suspend" : "account.reinstate", "accounts", accountId, null, { reason });
  revalidatePath("/admin");
  return { ok: true };
}
