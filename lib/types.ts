export type ContentType = "movie" | "drama";

export interface Episode {
  id: string;
  season: number;
  number: number;
  title: string;
  titleKm: string;
  durationMinutes: number;
  /** ISO timestamp. Future dates are "scheduled", not yet playable. */
  releaseAt: string;
  synopsis?: string;
}

export interface Season {
  number: number;
  title: string;
  episodes: Episode[];
}

export interface Title {
  /** Database id (uuid). */
  id: string;
  slug: string;
  name: string;
  nameKm: string;
  altTitle?: string;
  type: ContentType;
  country: string;
  year: number;
  categories: string[];
  ageRating: string;
  /** Short logline shown on cards and detail pages. */
  tagline: string;
  taglineKm: string;
  synopsis: string;
  synopsisKm: string;
  cast: string[];
  subtitleLanguages: string[];
  featured: boolean;
  trendingRank?: number;
  /** Simple, explainable popularity score used for sorting. */
  popularity: number;
  addedAt: string;
  /** Two hex colours used to generate placeholder artwork. */
  palette: [string, string];
  seasons: Season[];
  /** Only published titles are visible to visitors. */
  status: "published" | "draft" | "scheduled";
  rightsNote: string;
}
