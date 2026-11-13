import "server-only";

import { createClient } from "./supabase/server";
import type { ProgressRecord } from "@/components/session-provider";

/**
 * Loads Continue Watching for a profile.
 *
 * Completed episodes are excluded in SQL (the `completed` flag is set at 95% by
 * the save action), so the list never shows finished items as unfinished.
 */
export async function getContinueWatching(
  profileId: string,
  limit = 8,
): Promise<ProgressRecord[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("watch_progress")
    .select(
      "position_seconds, duration_seconds, updated_at, episode_id, title_id, " +
        "titles!inner(slug, name_km), " +
        "episodes!inner(number, name_km, seasons!inner(number))",
    )
    .eq("profile_id", profileId)
    .eq("completed", false)
    .order("updated_at", { ascending: false })
    .limit(limit);

  type Row = {
    position_seconds: number;
    duration_seconds: number;
    updated_at: string;
    episode_id: string;
    title_id: string;
    titles: { slug: string; name_km: string };
    episodes: { number: number; name_km: string; seasons: { number: number } };
  };

  return ((data ?? []) as unknown as Row[]).map((r) => ({
    titleId: r.title_id,
    slug: r.titles.slug,
    titleNameKm: r.titles.name_km,
    episodeId: r.episode_id,
    season: r.episodes.seasons.number,
    number: r.episodes.number,
    episodeNameKm: r.episodes.name_km,
    positionSeconds: r.position_seconds,
    durationSeconds: r.duration_seconds,
    updatedAt: r.updated_at,
  }));
}
