/**
 * Generates supabase/migrations/0003_seed.sql from lib/catalogue.ts.
 *
 * Emits flat, idempotent statements (no chained CTEs) so the seed can be applied
 * repeatedly and read by a human. Upserts are keyed on natural keys
 * (titles.slug, seasons (title_id, number), episodes (season_id, number)).
 *
 * Run: node --experimental-strip-types scripts/generate-seed.ts
 */
import {
  TITLES,
  CATEGORIES,
  COUNTRIES,
  CATEGORIES_KM,
  COUNTRIES_KM,
} from "../lib/catalogue.ts";
import { writeFileSync } from "node:fs";

const q = (s: string | null | undefined) =>
  s === null || s === undefined ? "null" : `'${s.replace(/'/g, "''")}'`;

const arr = (xs: string[]) =>
  xs.length ? `array[${xs.map(q).join(", ")}]::text[]` : `'{}'::text[]`;

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/**
 * Sample playback source.
 *
 * Big Buck Bunny — © Blender Foundation, licensed CC BY 3.0. It is used here
 * purely so the player has something real to stream during development.
 * Replace every row with your own rights-cleared Cloudflare Stream asset
 * (scripts/attach-video.ts) before serving real traffic.
 */
const DEMO_VIDEO_URL = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

const out: string[] = [];
const w = (s = "") => out.push(s);

w(`-- =============================================================================
-- CINEMA KH — demo catalogue seed  (GENERATED — do not edit by hand)
-- Regenerate with: node --experimental-strip-types scripts/generate-seed.ts
--
-- Every title is FICTIONAL and exists only to exercise the interface.
--
-- VIDEO: each episode is wired to one sample HLS stream (Big Buck Bunny,
-- © Blender Foundation, CC BY 3.0) so the player, progress tracking and
-- auto-next can be tested with a real stream. These rows are placeholders:
-- replace them with your own rights-cleared Cloudflare Stream assets via
-- scripts/attach-video.ts. Do not ship third-party content you are not
-- licensed to distribute.
-- =============================================================================

begin;
`);

// --- reference data ----------------------------------------------------------
w("-- Reference data ------------------------------------------------------------");
CATEGORIES.forEach((name, i) => {
  w(`insert into categories (slug, name, name_km, sort_order)
values (${q(slugify(name))}, ${q(name)}, ${q(CATEGORIES_KM[name] ?? name)}, ${i})
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;`);
});
w();
COUNTRIES.forEach((name, i) => {
  w(`insert into countries (slug, name, name_km, sort_order)
values (${q(slugify(name))}, ${q(name)}, ${q(COUNTRIES_KM[name] ?? name)}, ${i})
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;`);
});
w();

// --- catalogue ---------------------------------------------------------------
w("-- Titles -------------------------------------------------------------------");
for (const t of TITLES) {
  const countrySlug = slugify(t.country);
  w(`insert into titles (slug, name, name_km, alt_title, synopsis, synopsis_km,
  tagline, tagline_km, type, country_slug, release_year, age_rating,
  cast_members, subtitle_langs, palette, featured, trending_rank, popularity,
  status, rights_note, created_at, published_at)
values (${q(t.slug)}, ${q(t.name)}, ${q(t.nameKm)}, ${q(t.altTitle)},
  ${q(t.synopsis)}, ${q(t.synopsisKm)}, ${q(t.tagline)}, ${q(t.taglineKm)},
  ${q(t.type)}::content_type, ${q(countrySlug)}, ${t.year}, ${q(t.ageRating)},
  ${arr(t.cast)}, ${arr(t.subtitleLanguages)}, ${arr(t.palette)},
  ${t.featured}, ${t.trendingRank ?? "null"}, ${t.popularity},
  'published', ${q(t.rightsNote)}, ${q(t.addedAt)}, ${q(t.addedAt)})
on conflict (slug) do update set
  name = excluded.name, name_km = excluded.name_km, alt_title = excluded.alt_title,
  synopsis = excluded.synopsis, synopsis_km = excluded.synopsis_km,
  tagline = excluded.tagline, tagline_km = excluded.tagline_km,
  type = excluded.type, country_slug = excluded.country_slug,
  release_year = excluded.release_year, age_rating = excluded.age_rating,
  cast_members = excluded.cast_members, subtitle_langs = excluded.subtitle_langs,
  palette = excluded.palette, featured = excluded.featured,
  trending_rank = excluded.trending_rank, popularity = excluded.popularity,
  status = excluded.status, rights_note = excluded.rights_note;`);
}
w();

w("-- Categories / countries (many-to-many) ------------------------------------");
for (const t of TITLES) {
  for (const c of t.categories) {
    w(`insert into title_categories (title_id, category_slug)
select id, ${q(slugify(c))} from titles where slug = ${q(t.slug)}
on conflict do nothing;`);
  }
  w(`insert into title_countries (title_id, country_slug)
select id, ${q(slugify(t.country))} from titles where slug = ${q(t.slug)}
on conflict do nothing;`);
}
w();

w("-- Seasons ------------------------------------------------------------------");
for (const t of TITLES) {
  for (const s of t.seasons) {
    w(`insert into seasons (title_id, number, name)
select id, ${s.number}, ${q(s.title)} from titles where slug = ${q(t.slug)}
on conflict (title_id, number) do update set name = excluded.name;`);
  }
}
w();

w("-- Episodes -----------------------------------------------------------------");
for (const t of TITLES) {
  for (const s of t.seasons) {
    for (const e of s.episodes) {
      w(`insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, ${e.number}, ${q(e.title)}, ${q(e.titleKm)},
  ${e.durationMinutes * 60}, ${q(e.releaseAt)}
from titles t
join seasons s on s.title_id = t.id and s.number = ${s.number}
where t.slug = ${q(t.slug)}
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;`);
    }
  }
}
w();

w("-- Video assets (PLACEHOLDER — replace with licensed assets) ----------------");
for (const t of TITLES) {
  for (const s of t.seasons) {
    for (const e of s.episodes) {
      w(`insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', ${q(DEMO_VIDEO_URL)}, 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = ${q(t.slug)} and s.number = ${s.number} and e.number = ${e.number}
on conflict (episode_id, label) do nothing;`);
    }
  }
}
w();

// --- operational defaults ----------------------------------------------------
w(`-- Ad placements: created but DISABLED. Turning these on before provider
-- approval would violate AdSense policy, so the default must stay false.
insert into ad_placements (id, page, format, enabled, notes) values
  ('home-mid', 'home', 'leaderboard', false, 'Between homepage sections, away from the hero.'),
  ('home-bottom', 'home', 'leaderboard', false, 'After all homepage content.'),
  ('browse-mid', 'browse', 'leaderboard', false, 'Below the first grid row.'),
  ('detail-bottom', 'title', 'leaderboard', false, 'Below the Watch button and episode list.'),
  ('watch-below-player', 'watch', 'leaderboard', false, 'Below the player — never above or inside it.')
on conflict (id) do nothing;

insert into site_settings (key, value) values
  ('branding', '{"name": "CINEMA KH", "tagline_km": "មើលភាពយន្ត និងរឿងភាគឥតគិតថ្លៃ"}'::jsonb),
  ('ads_enabled', 'false'::jsonb),
  ('max_profiles_per_account', '5'::jsonb)
on conflict (key) do nothing;

commit;
`);

writeFileSync("supabase/migrations/0003_seed.sql", out.join("\n"));
console.log(
  `wrote supabase/migrations/0003_seed.sql (${out.length} lines, ${TITLES.length} titles)`,
);
