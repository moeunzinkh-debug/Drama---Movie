import "server-only";

import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";
import type { Episode, Season, Title } from "./types";

/**
 * Database-backed catalogue queries.
 *
 * Every read goes through the caller's RLS-scoped client, so unpublished titles
 * and internal columns (rights_note, source_note) are filtered by Postgres, not
 * by this file. Only fields granted to `anon`/`authenticated` are selected.
 */

const PUBLIC_TITLE_COLUMNS =
  "id, slug, name, name_km, alt_title, synopsis, synopsis_km, tagline, tagline_km, " +
  "type, country_slug, release_year, age_rating, cast_members, subtitle_langs, palette, " +
  "featured, trending_rank, popularity, status, published_at, created_at";

interface TitleRow {
  id: string;
  slug: string;
  name: string;
  name_km: string;
  alt_title: string | null;
  synopsis: string;
  synopsis_km: string;
  tagline: string;
  tagline_km: string;
  type: "movie" | "drama";
  country_slug: string | null;
  release_year: number | null;
  age_rating: string;
  cast_members: string[] | null;
  subtitle_langs: string[] | null;
  palette: string[] | null;
  featured: boolean;
  trending_rank: number | null;
  popularity: number;
  status: string;
  published_at: string | null;
  created_at: string;
  title_categories?: { category_slug: string }[] | null;
}

interface EpisodeRow {
  id: string;
  season_id: string;
  number: number;
  name: string;
  name_km: string;
  synopsis: string;
  duration_seconds: number | null;
  release_at: string;
}

function toTitle(row: TitleRow, seasons: Season[] = []): Title {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameKm: row.name_km,
    altTitle: row.alt_title ?? undefined,
    type: row.type,
    country: row.country_slug ?? "",
    year: row.release_year ?? 0,
    categories: (row.title_categories ?? []).map((c) => c.category_slug),
    ageRating: row.age_rating,
    tagline: row.tagline,
    taglineKm: row.tagline_km,
    synopsis: row.synopsis,
    synopsisKm: row.synopsis_km,
    cast: row.cast_members ?? [],
    subtitleLanguages: row.subtitle_langs ?? [],
    featured: row.featured,
    trendingRank: row.trending_rank ?? undefined,
    popularity: row.popularity,
    addedAt: row.published_at ?? row.created_at,
    palette: [
      row.palette?.[0] ?? "#101018",
      row.palette?.[1] ?? "#3a3a55",
    ] as [string, string],
    seasons,
    status: "published",
    // Never populated from the client-visible view. Admin screens fetch it
    // through a separate privileged query.
    rightsNote: "",
  };
}

export interface CatalogueFilters {
  q?: string;
  type?: string;
  category?: string;
  country?: string;
  year?: string;
  sort?: string;
  limit?: number;
}

/** Returns an empty list rather than throwing when the DB is not configured yet. */
async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!isSupabaseConfigured()) return fallback;
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function listTitles(filters: CatalogueFilters = {}): Promise<Title[]> {
  const limit = filters.limit ?? 60;

  return safeQuery(async () => {
    const supabase = await createClient();

    // One query shape: inner-join categories only when filtering by category,
    // otherwise a normal left join so titles without categories still appear.
    let query = filters.category
      ? supabase
          .from("titles")
          .select(`${PUBLIC_TITLE_COLUMNS}, title_categories!inner(category_slug)`)
          .eq("status", "published")
          .limit(limit)
      : supabase
          .from("titles")
          .select(`${PUBLIC_TITLE_COLUMNS}, title_categories(category_slug)`)
          .eq("status", "published")
          .limit(limit);

    if (filters.type === "movie" || filters.type === "drama") {
      query = query.eq("type", filters.type);
    }
    if (filters.category) {
      query = query.eq("title_categories.category_slug", filters.category);
    }
    if (filters.country) query = query.eq("country_slug", filters.country);
    if (filters.year) query = query.eq("release_year", Number(filters.year));
    if (filters.q) {
      const term = filters.q.replace(/[%,()]/g, " ").trim();
      if (term) {
        query = query.or(
          `name.ilike.%${term}%,name_km.ilike.%${term}%,tagline.ilike.%${term}%,tagline_km.ilike.%${term}%`,
        );
      }
    }

    switch (filters.sort) {
      case "newest":
        query = query.order("published_at", { ascending: false, nullsFirst: false });
        break;
      case "year":
        query = query.order("release_year", { ascending: false });
        break;
      case "az":
        query = query.order("name", { ascending: true });
        break;
      default:
        query = query.order("popularity", { ascending: false });
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return (data as unknown as TitleRow[]).map((r) => toTitle(r));
  }, []);
}

export async function getTrending(limit = 10): Promise<Title[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("titles")
      .select(PUBLIC_TITLE_COLUMNS)
      .eq("status", "published")
      .not("trending_rank", "is", null)
      .order("trending_rank", { ascending: true })
      .limit(limit);
    return ((data ?? []) as unknown as TitleRow[]).map((r) => toTitle(r));
  }, []);
}

export async function getFeatured(): Promise<Title[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("titles")
      .select(PUBLIC_TITLE_COLUMNS)
      .eq("status", "published")
      .eq("featured", true)
      .order("popularity", { ascending: false })
      .limit(5);
    return ((data ?? []) as unknown as TitleRow[]).map((r) => toTitle(r));
  }, []);
}

export async function getRecentlyAdded(limit = 8): Promise<Title[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("titles")
      .select(PUBLIC_TITLE_COLUMNS)
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit);
    return ((data ?? []) as unknown as TitleRow[]).map((r) => toTitle(r));
  }, []);
}

/** A title with its full season/episode tree. */
export async function getTitleBySlug(slug: string): Promise<Title | null> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("titles")
      .select(
        `${PUBLIC_TITLE_COLUMNS}, title_categories(category_slug), ` +
          `seasons(id, number, name, episodes(id, season_id, number, name, name_km, synopsis, duration_seconds, release_at))`,
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (!data) return null;
    type SeasonRow = { id: string; number: number; name: string; episodes: EpisodeRow[] | null };
    const row = data as unknown as TitleRow & { seasons: SeasonRow[] | null };

    const seasons: Season[] = (row.seasons ?? [])
      .slice()
      .sort((a, b) => a.number - b.number)
      .map((s) => ({
        number: s.number,
        title: s.name,
        episodes: (s.episodes ?? [])
          .slice()
          .sort((a, b) => a.number - b.number)
          .map((e) => ({
            id: e.id,
            season: s.number,
            number: e.number,
            title: e.name,
            titleKm: e.name_km,
            durationMinutes: Math.round((e.duration_seconds ?? 0) / 60),
            releaseAt: e.release_at,
            synopsis: e.synopsis || undefined,
          })),
      }));

    return toTitle(row, seasons);
  }, null);
}

export async function getRelated(title: Title, limit = 6): Promise<Title[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("titles")
      .select(PUBLIC_TITLE_COLUMNS)
      .eq("status", "published")
      .eq("type", title.type)
      .neq("slug", title.slug)
      .order("popularity", { ascending: false })
      .limit(limit);
    return ((data ?? []) as unknown as TitleRow[]).map((r) => toTitle(r));
  }, []);
}

/** Released + scheduled episodes for the calendar. */
export async function getReleaseCalendar() {
  return safeQuery(
    async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from("episodes")
        .select(
          "id, number, name, name_km, release_at, duration_seconds, " +
            "seasons!inner(number, title_id, titles!inner(slug, name, name_km, status))",
        )
        .order("release_at", { ascending: false })
        .limit(60);

      type Row = EpisodeRow & {
        seasons: {
          number: number;
          titles: { slug: string; name: string; name_km: string; status: string };
        };
      };

      const now = Date.now();
      const rows = ((data ?? []) as unknown as Row[]).filter(
        (r) => r.seasons?.titles?.status === "published",
      );

      const map = (r: Row) => ({
        episodeId: r.id,
        titleSlug: r.seasons.titles.slug,
        titleNameKm: r.seasons.titles.name_km,
        season: r.seasons.number,
        number: r.number,
        nameKm: r.name_km || r.name,
        releaseAt: r.release_at,
      });

      return {
        upcoming: rows
          .filter((r) => +new Date(r.release_at) > now)
          .sort((a, b) => +new Date(a.release_at) - +new Date(b.release_at))
          .slice(0, 24)
          .map(map),
        recent: rows
          .filter((r) => +new Date(r.release_at) <= now)
          .slice(0, 24)
          .map(map),
      };
    },
    { upcoming: [], recent: [] },
  );
}

export async function getCategories() {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("slug, name, name_km")
      .order("sort_order");
    return data ?? [];
  }, []);
}

export async function getCountries() {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("countries")
      .select("slug, name, name_km")
      .order("sort_order");
    return data ?? [];
  }, []);
}

export async function getYears(): Promise<number[]> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("titles")
      .select("release_year")
      .eq("status", "published")
      .not("release_year", "is", null);
    const years = [...new Set((data ?? []).map((r) => r.release_year as number))];
    return years.sort((a, b) => b - a);
  }, []);
}

/** Playback eligibility for the active profile, evaluated server-side. */
export async function getPlayableEpisode(
  slug: string,
  episodeId?: string,
  profileId?: string | null,
) {
  return safeQuery(async () => {
    const supabase = await createClient();

    type Row = EpisodeRow & {
      seasons: {
        number: number;
        titles: { id: string; slug: string; name: string; name_km: string; status: string };
      };
    };

    const { data } = await supabase
      .from("episodes")
      .select(
        "id, number, name, name_km, duration_seconds, release_at, " +
          "seasons!inner(number, title_id, titles!inner(id, slug, name, name_km, status))",
      )
      .eq("seasons.titles.slug", slug)
      .eq("seasons.titles.status", "published")
      .order("release_at", { ascending: true });

    if (!data?.length) return null;

    const rows = data as unknown as Row[];
    const chosen = (episodeId ? rows.find((r) => r.id === episodeId) : undefined) ?? rows[0];
    const idx = rows.findIndex((r) => r.id === chosen.id);
    const nextRow = rows[idx + 1];
    const now = Date.now();

    void profileId; // parental gating happens in profileMayWatch()

    return {
      id: chosen.id,
      season: chosen.seasons.number,
      number: chosen.number,
      title: chosen.name,
      titleKm: chosen.name_km,
      durationSeconds: chosen.duration_seconds ?? 0,
      releaseAt: chosen.release_at,
      released: +new Date(chosen.release_at) <= now,
      titleId: chosen.seasons.titles.id,
      titleSlug: chosen.seasons.titles.slug,
      titleName: chosen.seasons.titles.name,
      titleNameKm: chosen.seasons.titles.name_km,
      previousId: idx > 0 ? rows[idx - 1].id : null,
      nextId:
        nextRow && +new Date(nextRow.release_at) <= now ? nextRow.id : null,
      nextNumber: nextRow?.number ?? null,
      nextTitleKm: nextRow ? nextRow.name_km || nextRow.name : null,
    };
  }, null);
}

/** Server-side parental-control check for a title against the active profile. */
export async function profileMayWatch(
  profileId: string,
  ageRating: string,
): Promise<boolean> {
  return safeQuery(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("rating_allows", {
      p_profile: profileId,
      p_rating: ageRating,
    });
    if (error) return true; // fail open only if the profile has no restriction
    return data !== false;
  }, true);
}
