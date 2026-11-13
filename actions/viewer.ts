"use server";

/**
 * Viewer mutations.
 *
 * All of these run on the server with the caller's session. Ownership is
 * verified twice: once here (profile must belong to the account) and once by
 * RLS (`owns_profile(profile_id)`), so a forged profile id returns zero rows
 * instead of writing to someone else's data.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type ActionResult = { ok: true } | { ok: false; error: string };

async function assertOwnedProfile(profileId: string): Promise<boolean> {
  if (!UUID.test(profileId)) return false;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", profileId)
    .maybeSingle();
  return Boolean(data);
}

export async function toggleWatchlist(
  profileId: string,
  titleId: string,
): Promise<ActionResult & { inList?: boolean }> {
  const user = await requireUser();
  void user;
  if (!(await assertOwnedProfile(profileId))) return { ok: false, error: "FORBIDDEN" };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("watchlists")
    .select("title_id")
    .eq("profile_id", profileId)
    .eq("title_id", titleId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("watchlists")
      .delete()
      .eq("profile_id", profileId)
      .eq("title_id", titleId);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/my-list");
    return { ok: true, inList: false };
  }

  const { error } = await supabase
    .from("watchlists")
    .insert({ profile_id: profileId, title_id: titleId });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/my-list");
  return { ok: true, inList: true };
}

export async function saveProgress(input: {
  profileId: string;
  episodeId: string;
  titleId: string;
  positionSeconds: number;
  durationSeconds: number;
}): Promise<ActionResult> {
  await requireUser();
  if (!(await assertOwnedProfile(input.profileId))) return { ok: false, error: "FORBIDDEN" };

  const position = Math.max(0, Math.floor(input.positionSeconds));
  const duration = Math.max(1, Math.floor(input.durationSeconds));

  // Never store a position beyond the media length, and mark near-complete
  // episodes as completed so they drop out of Continue Watching.
  const clamped = Math.min(position, duration);
  const completed = clamped / duration >= 0.95;

  const supabase = await createClient();
  const { error } = await supabase.from("watch_progress").upsert(
    {
      profile_id: input.profileId,
      episode_id: input.episodeId,
      title_id: input.titleId,
      position_seconds: completed ? duration : clamped,
      duration_seconds: duration,
      completed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "profile_id,episode_id" },
  );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function clearProgress(
  profileId: string,
  titleId: string,
): Promise<ActionResult> {
  await requireUser();
  if (!(await assertOwnedProfile(profileId))) return { ok: false, error: "FORBIDDEN" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("watch_progress")
    .delete()
    .eq("profile_id", profileId)
    .eq("title_id", titleId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/my-list");
  return { ok: true };
}

export async function rateTitle(
  profileId: string,
  titleId: string,
  stars: number,
): Promise<ActionResult> {
  await requireUser();
  if (!(await assertOwnedProfile(profileId))) return { ok: false, error: "FORBIDDEN" };
  if (stars < 1 || stars > 5) return { ok: false, error: "INVALID_RATING" };

  const supabase = await createClient();
  const { error } = await supabase.from("ratings").upsert(
    { profile_id: profileId, title_id: titleId, stars, updated_at: new Date().toISOString() },
    { onConflict: "profile_id,title_id" },
  );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function addProfile(name: string): Promise<ActionResult> {
  const user = await requireUser();
  const clean = name.trim().slice(0, 24);
  if (clean.length < 1) return { ok: false, error: "EMPTY_NAME" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .insert({ account_id: user.account.id, name: clean });

  // 23505 = duplicate name, P0001 = the profile-limit trigger.
  if (error) return { ok: false, error: error.message };
  revalidatePath("/my-list");
  return { ok: true };
}

export async function deleteProfile(profileId: string): Promise<ActionResult> {
  await requireUser();
  if (!(await assertOwnedProfile(profileId))) return { ok: false, error: "FORBIDDEN" };

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").delete().eq("id", profileId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/my-list");
  return { ok: true };
}

/** Reports a broken video. Rate-limited by the caller's session in the UI + RLS. */
export async function reportBrokenVideo(input: {
  episodeId: string;
  titleId: string;
  reason: string;
}): Promise<ActionResult> {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("account_id", user.account.id)
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("content_reports").insert({
    profile_id: profile?.id ?? null,
    episode_id: input.episodeId,
    title_id: input.titleId,
    reason: input.reason.slice(0, 500),
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
