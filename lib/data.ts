import { TITLES } from "./catalogue";
import type { Episode, Season, Title } from "./types";

export function publishedTitles(): Title[] {
  return TITLES.filter((t) => t.status === "published");
}

export function getTitle(slug: string): Title | undefined {
  return publishedTitles().find((t) => t.slug === slug);
}

export function allEpisodes(title: Title): Episode[] {
  return title.seasons.flatMap((s) => s.episodes);
}

export function isReleased(episode: Episode, now = Date.now()): boolean {
  return new Date(episode.releaseAt).getTime() <= now;
}

export function firstPlayableEpisode(title: Title): Episode | undefined {
  return allEpisodes(title).find((e) => isReleased(e));
}

export function findEpisode(title: Title, episodeId: string): Episode | undefined {
  return allEpisodes(title).find((e) => e.id === episodeId);
}

export function nextEpisode(title: Title, episodeId: string): Episode | undefined {
  const all = allEpisodes(title);
  const i = all.findIndex((e) => e.id === episodeId);
  if (i < 0) return undefined;
  const next = all[i + 1];
  return next && isReleased(next) ? next : undefined;
}

export function previousEpisode(title: Title, episodeId: string): Episode | undefined {
  const all = allEpisodes(title);
  const i = all.findIndex((e) => e.id === episodeId);
  return i > 0 ? all[i - 1] : undefined;
}

export function trending(limit = 10): Title[] {
  return publishedTitles()
    .filter((t) => t.trendingRank)
    .sort((a, b) => (a.trendingRank ?? 99) - (b.trendingRank ?? 99))
    .slice(0, limit);
}

export function popular(limit = 12): Title[] {
  return [...publishedTitles()].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

export function recentlyAdded(limit = 12): Title[] {
  return [...publishedTitles()]
    .sort((a, b) => +new Date(b.addedAt) - +new Date(a.addedAt))
    .slice(0, limit);
}

export function featured(): Title[] {
  const f = publishedTitles().filter((t) => t.featured);
  return f.length ? f : publishedTitles().slice(0, 3);
}

export function related(title: Title, limit = 6): Title[] {
  return publishedTitles()
    .filter((t) => t.slug !== title.slug)
    .map((t) => ({
      t,
      score:
        t.categories.filter((c) => title.categories.includes(c)).length * 10 +
        (t.country === title.country ? 4 : 0) +
        (t.type === title.type ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score || b.t.popularity - a.t.popularity)
    .slice(0, limit)
    .map((x) => x.t);
}

export interface BrowseFilters {
  q?: string;
  type?: string;
  category?: string;
  country?: string;
  year?: string;
  sort?: string;
}

export function browse(filters: BrowseFilters): Title[] {
  const q = filters.q?.trim().toLowerCase();
  let out = publishedTitles().filter((t) => {
    if (q) {
      const hay = [t.name, t.nameKm, t.altTitle, t.tagline, ...t.cast, ...t.categories]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.type && filters.type !== "all" && t.type !== filters.type) return false;
    if (filters.category && !t.categories.includes(filters.category)) return false;
    if (filters.country && t.country !== filters.country) return false;
    if (filters.year && String(t.year) !== filters.year) return false;
    return true;
  });

  switch (filters.sort) {
    case "newest":
      out = out.sort((a, b) => +new Date(b.addedAt) - +new Date(a.addedAt));
      break;
    case "year":
      out = out.sort((a, b) => b.year - a.year);
      break;
    case "az":
      out = out.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      out = out.sort((a, b) => b.popularity - a.popularity);
  }
  return out;
}

export function years(): number[] {
  return [...new Set(publishedTitles().map((t) => t.year))].sort((a, b) => b - a);
}

export interface CalendarEntry {
  title: Title;
  season: Season;
  episode: Episode;
}

/** Released + upcoming episodes, newest first for released, soonest first for upcoming. */
export function releaseCalendar(now = Date.now()): { upcoming: CalendarEntry[]; recent: CalendarEntry[] } {
  const entries: CalendarEntry[] = [];
  for (const title of publishedTitles()) {
    for (const season of title.seasons) {
      for (const episode of season.episodes) entries.push({ title, season, episode });
    }
  }
  const upcoming = entries
    .filter((e) => +new Date(e.episode.releaseAt) > now)
    .sort((a, b) => +new Date(a.episode.releaseAt) - +new Date(b.episode.releaseAt))
    .slice(0, 24);
  const recent = entries
    .filter((e) => +new Date(e.episode.releaseAt) <= now)
    .sort((a, b) => +new Date(b.episode.releaseAt) - +new Date(a.episode.releaseAt))
    .slice(0, 24);
  return { upcoming, recent };
}

export function watchHref(title: Title, episode?: Episode): string {
  const ep = episode ?? firstPlayableEpisode(title);
  return ep ? `/watch/${title.slug}?ep=${ep.id}` : `/title/${title.slug}`;
}

export function totalEpisodes(): number {
  return publishedTitles().reduce((n, t) => n + allEpisodes(t).length, 0);
}
