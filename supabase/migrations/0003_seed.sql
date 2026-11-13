-- =============================================================================
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

-- Reference data ------------------------------------------------------------
insert into categories (slug, name, name_km, sort_order)
values ('comedy', 'Comedy', 'កំប្លែង', 0)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into categories (slug, name, name_km, sort_order)
values ('horror', 'Horror', 'ភ័យរន្ធត់', 1)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into categories (slug, name, name_km, sort_order)
values ('action', 'Action', 'សកម្មភាព', 2)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into categories (slug, name, name_km, sort_order)
values ('romance', 'Romance', 'មនោសញ្ចេតនា', 3)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into categories (slug, name, name_km, sort_order)
values ('drama', 'Drama', 'ដ្រាម៉ា', 4)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into categories (slug, name, name_km, sort_order)
values ('thriller', 'Thriller', 'រន្ធត់ចិត្ត', 5)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into categories (slug, name, name_km, sort_order)
values ('fantasy', 'Fantasy', 'រឿងប្រឌិត', 6)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into categories (slug, name, name_km, sort_order)
values ('adventure', 'Adventure', 'ផ្សងព្រេង', 7)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into categories (slug, name, name_km, sort_order)
values ('science-fiction', 'Science Fiction', 'វិទ្យាសាស្ត្រប្រឌិត', 8)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into categories (slug, name, name_km, sort_order)
values ('mystery', 'Mystery', 'អាថ៌កំបាំង', 9)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into categories (slug, name, name_km, sort_order)
values ('crime', 'Crime', 'ឧក្រិដ្ឋកម្ម', 10)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into categories (slug, name, name_km, sort_order)
values ('family', 'Family', 'គ្រួសារ', 11)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into categories (slug, name, name_km, sort_order)
values ('animation', 'Animation', 'គំនូរជីវចល', 12)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into categories (slug, name, name_km, sort_order)
values ('historical', 'Historical', 'ប្រវត្តិសាស្ត្រ', 13)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into categories (slug, name, name_km, sort_order)
values ('documentary', 'Documentary', 'ឯកសារ', 14)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into categories (slug, name, name_km, sort_order)
values ('war', 'War', 'សង្គ្រាម', 15)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into categories (slug, name, name_km, sort_order)
values ('martial-arts', 'Martial Arts', 'ក្បាច់គុន', 16)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;

insert into countries (slug, name, name_km, sort_order)
values ('khmer', 'Khmer', 'ខ្មែរ', 0)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into countries (slug, name, name_km, sort_order)
values ('chinese', 'Chinese', 'ចិន', 1)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into countries (slug, name, name_km, sort_order)
values ('korean', 'Korean', 'កូរ៉េ', 2)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into countries (slug, name, name_km, sort_order)
values ('thai', 'Thai', 'ថៃ', 3)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into countries (slug, name, name_km, sort_order)
values ('japanese', 'Japanese', 'ជប៉ុន', 4)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;
insert into countries (slug, name, name_km, sort_order)
values ('other', 'Other', 'ផ្សេងៗ', 5)
on conflict (slug) do update set name = excluded.name, name_km = excluded.name_km, sort_order = excluded.sort_order;

-- Titles -------------------------------------------------------------------
insert into titles (slug, name, name_km, alt_title, synopsis, synopsis_km,
  tagline, tagline_km, type, country_slug, release_year, age_rating,
  cast_members, subtitle_langs, palette, featured, trending_rank, popularity,
  status, rights_note, created_at, published_at)
values ('mekong-shadows', 'Mekong Shadows', 'ស្រមោលទន្លេមេគង្គ', 'The River Murders',
  'Detective Sreyna Chea left Kampong Chhnang at nineteen with nothing but a bus ticket. Fifteen years later a body is pulled from the Mekong wearing her brother''s watch, and the case file the province buried comes back with her name on it.', 'អ្នកស៊ើបអង្កេត ស្រីណា ជា បានចាកចេញពីកំពង់ឆ្នាំងនៅអាយុ ១៩ ឆ្នាំ។ ដប់ប្រាំឆ្នាំក្រោយមក សាកសពមួយត្រូវបានគេស្រង់ចេញពីទន្លេមេគង្គ ដោយពាក់នាឡិការបស់បងប្រុសនាង។', 'A detective returns to the river town she swore never to see again.', 'អ្នកស៊ើបអង្កេតម្នាក់ត្រឡប់មកក្រុងមេគង្គដែលនាងបានស្បថមិនវិលត្រឡប់។',
  'drama'::content_type, 'khmer', 2026, '16+',
  array['Sreyna Chea', 'Vibol Nim', 'Dara Sok']::text[], array['Khmer', 'English']::text[], array['#0b3d4a', '#f0a03c']::text[],
  true, 1, 9810,
  'published', 'Original production — owner: CINEMA KH.', '2026-11-01T00:00:00.000Z', '2026-11-01T00:00:00.000Z')
on conflict (slug) do update set
  name = excluded.name, name_km = excluded.name_km, alt_title = excluded.alt_title,
  synopsis = excluded.synopsis, synopsis_km = excluded.synopsis_km,
  tagline = excluded.tagline, tagline_km = excluded.tagline_km,
  type = excluded.type, country_slug = excluded.country_slug,
  release_year = excluded.release_year, age_rating = excluded.age_rating,
  cast_members = excluded.cast_members, subtitle_langs = excluded.subtitle_langs,
  palette = excluded.palette, featured = excluded.featured,
  trending_rank = excluded.trending_rank, popularity = excluded.popularity,
  status = excluded.status, rights_note = excluded.rights_note;
insert into titles (slug, name, name_km, alt_title, synopsis, synopsis_km,
  tagline, tagline_km, type, country_slug, release_year, age_rating,
  cast_members, subtitle_langs, palette, featured, trending_rank, popularity,
  status, rights_note, created_at, published_at)
values ('golden-lotus-hotel', 'Golden Lotus Hotel', 'សណ្ឋាគារផ្កាឈូកមាស', null,
  'A fading riverside hotel keeps a ledger of every guest since 1974. When a new manager finds the book, she recognises a name that should not exist — and a debt the building has been collecting for fifty years.', 'សណ្ឋាគារចាស់មួយរក្សាកំណត់ត្រាភ្ញៀវគ្រប់រូបតាំងពីឆ្នាំ ១៩៧៤។ នៅពេលអ្នកគ្រប់គ្រងថ្មីរកឃើញសៀវភៅនោះ នាងស្គាល់ឈ្មោះមួយដែលមិនគួរមាន។', 'Six strangers check in. The hotel decides who checks out.', 'ភ្ញៀវប្រាំមួយនាក់ចូលស្នាក់។ សណ្ឋាគារជាអ្នកសម្រេចថាអ្នកណានឹងចេញ។',
  'drama'::content_type, 'thai', 2025, '13+',
  array['Naphat Sirichai', 'Kanya Wong', 'Mira Tan']::text[], array['Khmer', 'English', 'Thai']::text[], array['#3a1230', '#e8b04a']::text[],
  true, 3, 8720,
  'published', 'Licensed for streaming — sample record only.', '2026-10-04T00:00:00.000Z', '2026-10-04T00:00:00.000Z')
on conflict (slug) do update set
  name = excluded.name, name_km = excluded.name_km, alt_title = excluded.alt_title,
  synopsis = excluded.synopsis, synopsis_km = excluded.synopsis_km,
  tagline = excluded.tagline, tagline_km = excluded.tagline_km,
  type = excluded.type, country_slug = excluded.country_slug,
  release_year = excluded.release_year, age_rating = excluded.age_rating,
  cast_members = excluded.cast_members, subtitle_langs = excluded.subtitle_langs,
  palette = excluded.palette, featured = excluded.featured,
  trending_rank = excluded.trending_rank, popularity = excluded.popularity,
  status = excluded.status, rights_note = excluded.rights_note;
insert into titles (slug, name, name_km, alt_title, synopsis, synopsis_km,
  tagline, tagline_km, type, country_slug, release_year, age_rating,
  cast_members, subtitle_langs, palette, featured, trending_rank, popularity,
  status, rights_note, created_at, published_at)
values ('neon-phnom-penh', 'Neon Phnom Penh', 'ភ្នំពេញពន្លឺនេអុង', null,
  'Rithy drives nights to pay for his sister''s tuition. When a passenger leaves a phone full of someone else''s secrets on his seat, every fixer in the city wants it back before sunrise.', 'រិទ្ធីបើករថយន្តកង់បីពេលយប់ដើម្បីរកលុយឲ្យប្អូនស្រីរៀន។ នៅពេលអ្នកដំណើរម្នាក់ទុកទូរស័ព្ទពោរពេញដោយអាថ៌កំបាំងនៅលើកៅអី គ្រប់គ្នាក្នុងក្រុងចង់បានវាមកវិញ។', 'A tuk-tuk driver, a stolen phone, and one very long night.', 'អ្នកបើករថយន្តកង់បី ទូរស័ព្ទដែលត្រូវលួច និងយប់វែងមួយ។',
  'movie'::content_type, 'khmer', 2026, '18+',
  array['Rithy Meas', 'Sopheap Lim', 'Kosal Yim']::text[], array['Khmer', 'English']::text[], array['#1a0b3d', '#2ef2d8']::text[],
  true, 2, 9130,
  'published', 'Original production — owner: CINEMA KH.', '2026-10-23T00:00:00.000Z', '2026-10-23T00:00:00.000Z')
on conflict (slug) do update set
  name = excluded.name, name_km = excluded.name_km, alt_title = excluded.alt_title,
  synopsis = excluded.synopsis, synopsis_km = excluded.synopsis_km,
  tagline = excluded.tagline, tagline_km = excluded.tagline_km,
  type = excluded.type, country_slug = excluded.country_slug,
  release_year = excluded.release_year, age_rating = excluded.age_rating,
  cast_members = excluded.cast_members, subtitle_langs = excluded.subtitle_langs,
  palette = excluded.palette, featured = excluded.featured,
  trending_rank = excluded.trending_rank, popularity = excluded.popularity,
  status = excluded.status, rights_note = excluded.rights_note;
insert into titles (slug, name, name_km, alt_title, synopsis, synopsis_km,
  tagline, tagline_km, type, country_slug, release_year, age_rating,
  cast_members, subtitle_langs, palette, featured, trending_rank, popularity,
  status, rights_note, created_at, published_at)
values ('the-quiet-harvest', 'The Quiet Harvest', 'រដូវចម្រូតស្ងប់ស្ងាត់', null,
  'A grandmother divides her land between two sons who stopped speaking in 1993. Her granddaughter arrives from Melbourne with a camera and a question nobody in the family wants to answer.', 'យាយម្នាក់បែងចែកដីរបស់គាត់រវាងកូនប្រុសពីរនាក់ដែលឈប់និយាយគ្នាតាំងពីឆ្នាំ ១៩៩៣។ ចៅស្រីរបស់គាត់មកពីទីក្រុងមែលប៊នជាមួយកាមេរ៉ា និងសំណួរមួយ។', 'One rice field. Three generations. A promise nobody wrote down.', 'ស្រែមួយ។ បីជំនាន់។ ការសន្យាដែលគ្មាននរណាសរសេរទុក។',
  'movie'::content_type, 'khmer', 2024, '13+',
  array['Sophal Keo', 'Bopha Chan', 'Nita Ros']::text[], array['Khmer', 'English']::text[], array['#1f3210', '#c8d96f']::text[],
  false, null, 6140,
  'published', 'Original production — owner: CINEMA KH.', '2026-04-27T00:00:00.000Z', '2026-04-27T00:00:00.000Z')
on conflict (slug) do update set
  name = excluded.name, name_km = excluded.name_km, alt_title = excluded.alt_title,
  synopsis = excluded.synopsis, synopsis_km = excluded.synopsis_km,
  tagline = excluded.tagline, tagline_km = excluded.tagline_km,
  type = excluded.type, country_slug = excluded.country_slug,
  release_year = excluded.release_year, age_rating = excluded.age_rating,
  cast_members = excluded.cast_members, subtitle_langs = excluded.subtitle_langs,
  palette = excluded.palette, featured = excluded.featured,
  trending_rank = excluded.trending_rank, popularity = excluded.popularity,
  status = excluded.status, rights_note = excluded.rights_note;
insert into titles (slug, name, name_km, alt_title, synopsis, synopsis_km,
  tagline, tagline_km, type, country_slug, release_year, age_rating,
  cast_members, subtitle_langs, palette, featured, trending_rank, popularity,
  status, rights_note, created_at, published_at)
values ('sky-train-love', 'Sky Train Love', 'ស្នេហាលើរថភ្លើងអាកាស', null,
  'For eleven months two strangers take the same carriage at 7:42 and never speak. A broken lift, one misdelivered notebook, and a resignation letter change the whole timetable.', 'រយៈពេល ១១ ខែ មនុស្សចម្លែកពីរនាក់ជិះរថភ្លើងតែមួយនៅម៉ោង ៧:៤២ ហើយមិនដែលនិយាយគ្នា។ ជណ្តើរយន្តខូច សៀវភៅកត់ត្រាមួយដែលផ្ញើខុស និងលិខិតលាឈប់ ផ្លាស់ប្តូរកាលវិភាគទាំងអស់។', 'They share a commute, a playlist, and absolutely no names.', 'ពួកគេចែករំលែកការធ្វើដំណើរ បញ្ជីចម្រៀង និងគ្មានឈ្មោះទាល់តែសោះ។',
  'drama'::content_type, 'korean', 2026, 'All',
  array['Hana Seo', 'Jae Min', 'Yuri Baek']::text[], array['Khmer', 'English', 'Korean']::text[], array['#12203f', '#ff9ec4']::text[],
  true, 4, 8410,
  'published', 'Licensed for streaming — sample record only.', '2026-11-06T00:00:00.000Z', '2026-11-06T00:00:00.000Z')
on conflict (slug) do update set
  name = excluded.name, name_km = excluded.name_km, alt_title = excluded.alt_title,
  synopsis = excluded.synopsis, synopsis_km = excluded.synopsis_km,
  tagline = excluded.tagline, tagline_km = excluded.tagline_km,
  type = excluded.type, country_slug = excluded.country_slug,
  release_year = excluded.release_year, age_rating = excluded.age_rating,
  cast_members = excluded.cast_members, subtitle_langs = excluded.subtitle_langs,
  palette = excluded.palette, featured = excluded.featured,
  trending_rank = excluded.trending_rank, popularity = excluded.popularity,
  status = excluded.status, rights_note = excluded.rights_note;
insert into titles (slug, name, name_km, alt_title, synopsis, synopsis_km,
  tagline, tagline_km, type, country_slug, release_year, age_rating,
  cast_members, subtitle_langs, palette, featured, trending_rank, popularity,
  status, rights_note, created_at, published_at)
values ('iron-pagoda', 'Iron Pagoda', 'វត្តដែក', null,
  'When the Iron Pagoda falls, a kitchen boy escapes with half a manual. Every sect in the valley wants the other half, and none of them agree on what it teaches.', 'នៅពេលវត្តដែកធ្លាក់ ក្មេងប្រុសម្នាក់រត់គេចជាមួយសៀវភៅពាក់កណ្តាល។ គ្រប់ក្រុមក្នុងជ្រលងភ្នំចង់បានពាក់កណ្តាលទៀត។', 'The last disciple of a burned temple carries its only surviving page.', 'សិស្សចុងក្រោយនៃវត្តដែលត្រូវដុត នាំយកទំព័រតែមួយគត់ដែលនៅសល់។',
  'drama'::content_type, 'chinese', 2025, '16+',
  array['Lin Zhao', 'Wei Fan', 'Chen Lu']::text[], array['Khmer', 'English', 'Chinese']::text[], array['#2b1414', '#e25822']::text[],
  false, null, 7650,
  'published', 'Licensed for streaming — sample record only.', '2026-08-15T00:00:00.000Z', '2026-08-15T00:00:00.000Z')
on conflict (slug) do update set
  name = excluded.name, name_km = excluded.name_km, alt_title = excluded.alt_title,
  synopsis = excluded.synopsis, synopsis_km = excluded.synopsis_km,
  tagline = excluded.tagline, tagline_km = excluded.tagline_km,
  type = excluded.type, country_slug = excluded.country_slug,
  release_year = excluded.release_year, age_rating = excluded.age_rating,
  cast_members = excluded.cast_members, subtitle_langs = excluded.subtitle_langs,
  palette = excluded.palette, featured = excluded.featured,
  trending_rank = excluded.trending_rank, popularity = excluded.popularity,
  status = excluded.status, rights_note = excluded.rights_note;
insert into titles (slug, name, name_km, alt_title, synopsis, synopsis_km,
  tagline, tagline_km, type, country_slug, release_year, age_rating,
  cast_members, subtitle_langs, palette, featured, trending_rank, popularity,
  status, rights_note, created_at, published_at)
values ('the-understudy', 'The Understudy', 'តួជំនួស', null,
  'A theatre understudy is promoted overnight after the lead''s disappearance. The police call it an accident. The script''s final scene says otherwise.', 'តួជំនួសម្នាក់ត្រូវបានតែងតាំងភ្លាមៗបន្ទាប់ពីតួឯកបាត់ខ្លួន។ ប៉ូលិសហៅវាថាគ្រោះថ្នាក់។ ឈុតចុងក្រោយនៃអត្ថបទនិយាយខុសគ្នា។', 'She learned every line. She just never expected to be given the stage.', 'នាងបានរៀនគ្រប់បន្ទាត់។ នាងមិនដែលរំពឹងថានឹងបានឡើងឆាកទេ។',
  'movie'::content_type, 'japanese', 2025, '16+',
  array['Aoi Muto', 'Ren Kudo', 'Emi Sano']::text[], array['Khmer', 'English', 'Japanese']::text[], array['#101010', '#d62828']::text[],
  false, null, 6980,
  'published', 'Licensed for streaming — sample record only.', '2026-06-16T00:00:00.000Z', '2026-06-16T00:00:00.000Z')
on conflict (slug) do update set
  name = excluded.name, name_km = excluded.name_km, alt_title = excluded.alt_title,
  synopsis = excluded.synopsis, synopsis_km = excluded.synopsis_km,
  tagline = excluded.tagline, tagline_km = excluded.tagline_km,
  type = excluded.type, country_slug = excluded.country_slug,
  release_year = excluded.release_year, age_rating = excluded.age_rating,
  cast_members = excluded.cast_members, subtitle_langs = excluded.subtitle_langs,
  palette = excluded.palette, featured = excluded.featured,
  trending_rank = excluded.trending_rank, popularity = excluded.popularity,
  status = excluded.status, rights_note = excluded.rights_note;
insert into titles (slug, name, name_km, alt_title, synopsis, synopsis_km,
  tagline, tagline_km, type, country_slug, release_year, age_rating,
  cast_members, subtitle_langs, palette, featured, trending_rank, popularity,
  status, rights_note, created_at, published_at)
values ('village-of-rain', 'Village of Rain', 'ភូមិភ្លៀង', null,
  'A nurse posted to a remote village notices the rain stops at the temple gate. The older villagers say it always has. The children say it started when the well was closed.', 'គិលានុបដ្ឋាយិកាដែលត្រូវបានបញ្ជូនទៅភូមិដាច់ស្រយាលសង្កេតឃើញថាភ្លៀងឈប់នៅមាត់ទ្វារវត្ត។ អ្នកភូមិចាស់និយាយថាវាមានជានិច្ច។', 'It has rained for four months. Nobody in the village thinks that is strange.', 'ភ្លៀងបានធ្លាក់រយៈពេលបួនខែ។ គ្មាននរណាក្នុងភូមិគិតថាចម្លែកទេ។',
  'drama'::content_type, 'khmer', 2025, '16+',
  array['Chan Dara', 'Sokunthea Pich', 'Veasna Em']::text[], array['Khmer', 'English']::text[], array['#0e1f1a', '#5ea8a0']::text[],
  false, null, 5470,
  'published', 'Original production — owner: CINEMA KH.', '2026-09-14T00:00:00.000Z', '2026-09-14T00:00:00.000Z')
on conflict (slug) do update set
  name = excluded.name, name_km = excluded.name_km, alt_title = excluded.alt_title,
  synopsis = excluded.synopsis, synopsis_km = excluded.synopsis_km,
  tagline = excluded.tagline, tagline_km = excluded.tagline_km,
  type = excluded.type, country_slug = excluded.country_slug,
  release_year = excluded.release_year, age_rating = excluded.age_rating,
  cast_members = excluded.cast_members, subtitle_langs = excluded.subtitle_langs,
  palette = excluded.palette, featured = excluded.featured,
  trending_rank = excluded.trending_rank, popularity = excluded.popularity,
  status = excluded.status, rights_note = excluded.rights_note;
insert into titles (slug, name, name_km, alt_title, synopsis, synopsis_km,
  tagline, tagline_km, type, country_slug, release_year, age_rating,
  cast_members, subtitle_langs, palette, featured, trending_rank, popularity,
  status, rights_note, created_at, published_at)
values ('the-last-seller', 'The Last Seller', 'អ្នកលក់ចុងក្រោយ', null,
  'When a covered market closes for renovation, a noodle seller''s son turns her stall into a livestream. She hates it. The internet does not care.', 'នៅពេលផ្សារបិទសម្រាប់ការជួសជុល កូនប្រុសអ្នកលក់គុយទាវប្តូរតូបរបស់ម្តាយទៅជាការផ្សាយផ្ទាល់។ គាត់ស្អប់វា។ អ៊ីនធឺណិតមិនខ្វល់ទេ។', 'A market stall, a phone camera, and a mother who refuses to be replaced.', 'តូបលក់ដូរមួយ កាមេរ៉ាទូរស័ព្ទ និងម្តាយម្នាក់ដែលមិនព្រមត្រូវជំនួស។',
  'movie'::content_type, 'khmer', 2023, 'All',
  array['Maly Ngin', 'Phirun Sok', 'Borey Hak']::text[], array['Khmer', 'English']::text[], array['#3d2a05', '#f7c948']::text[],
  false, null, 6320,
  'published', 'Original production — owner: CINEMA KH.', '2025-12-28T00:00:00.000Z', '2025-12-28T00:00:00.000Z')
on conflict (slug) do update set
  name = excluded.name, name_km = excluded.name_km, alt_title = excluded.alt_title,
  synopsis = excluded.synopsis, synopsis_km = excluded.synopsis_km,
  tagline = excluded.tagline, tagline_km = excluded.tagline_km,
  type = excluded.type, country_slug = excluded.country_slug,
  release_year = excluded.release_year, age_rating = excluded.age_rating,
  cast_members = excluded.cast_members, subtitle_langs = excluded.subtitle_langs,
  palette = excluded.palette, featured = excluded.featured,
  trending_rank = excluded.trending_rank, popularity = excluded.popularity,
  status = excluded.status, rights_note = excluded.rights_note;
insert into titles (slug, name, name_km, alt_title, synopsis, synopsis_km,
  tagline, tagline_km, type, country_slug, release_year, age_rating,
  cast_members, subtitle_langs, palette, featured, trending_rank, popularity,
  status, rights_note, created_at, published_at)
values ('orbit-9', 'Orbit 9', 'គន្លងទី៩', null,
  'A supply run to a decommissioned station should take eleven days. On day six the crew receives a message from their own ship, timestamped three weeks from now.', 'ការដឹកជញ្ជូនទៅស្ថានីយដែលបានបិទគួរតែយករយៈពេល ១១ ថ្ងៃ។ នៅថ្ងៃទី ៦ នាវិកទទួលសារពីកប៉ាល់ខ្លួនឯង។', 'Nine crew left Earth. Eight are answering the radio.', 'នាវិកប្រាំបួននាក់ចាកចេញពីផែនដី។ ប្រាំបីនាក់កំពុងឆ្លើយតបវិទ្យុ។',
  'drama'::content_type, 'other', 2026, '13+',
  array['Ada Ridley', 'Tomas Vogel', 'Nia Osei']::text[], array['Khmer', 'English']::text[], array['#050b1f', '#6c8cff']::text[],
  false, 5, 7180,
  'published', 'Licensed for streaming — sample record only.', '2026-11-10T00:00:00.000Z', '2026-11-10T00:00:00.000Z')
on conflict (slug) do update set
  name = excluded.name, name_km = excluded.name_km, alt_title = excluded.alt_title,
  synopsis = excluded.synopsis, synopsis_km = excluded.synopsis_km,
  tagline = excluded.tagline, tagline_km = excluded.tagline_km,
  type = excluded.type, country_slug = excluded.country_slug,
  release_year = excluded.release_year, age_rating = excluded.age_rating,
  cast_members = excluded.cast_members, subtitle_langs = excluded.subtitle_langs,
  palette = excluded.palette, featured = excluded.featured,
  trending_rank = excluded.trending_rank, popularity = excluded.popularity,
  status = excluded.status, rights_note = excluded.rights_note;
insert into titles (slug, name, name_km, alt_title, synopsis, synopsis_km,
  tagline, tagline_km, type, country_slug, release_year, age_rating,
  cast_members, subtitle_langs, palette, featured, trending_rank, popularity,
  status, rights_note, created_at, published_at)
values ('salt-and-jasmine', 'Salt and Jasmine', 'អំបិល និងផ្កាម្លិះ', null,
  'Estranged siblings inherit a shophouse restaurant and a recipe book written in a code neither of them can read. Their father''s old rival offers to translate — for a price.', 'បងប្អូនដែលឃ្លាតឆ្ងាយទទួលមរតកភោជនីយដ្ឋាន និងសៀវភៅរូបមន្តដែលសរសេរជាកូដ។ គូប្រកួតចាស់របស់ឪពុកព្រមបកប្រែឲ្យ — ក្នុងតម្លៃមួយ។', 'Two cooks, one recipe, and a father''s last letter.', 'ចុងភៅពីរនាក់ រូបមន្តមួយ និងលិខិតចុងក្រោយរបស់ឪពុក។',
  'movie'::content_type, 'thai', 2024, '13+',
  array['Pimchanok A.', 'Anan T.', 'Suda R.']::text[], array['Khmer', 'English', 'Thai']::text[], array['#2a1408', '#e9c46a']::text[],
  false, null, 5890,
  'published', 'Licensed for streaming — sample record only.', '2026-02-26T00:00:00.000Z', '2026-02-26T00:00:00.000Z')
on conflict (slug) do update set
  name = excluded.name, name_km = excluded.name_km, alt_title = excluded.alt_title,
  synopsis = excluded.synopsis, synopsis_km = excluded.synopsis_km,
  tagline = excluded.tagline, tagline_km = excluded.tagline_km,
  type = excluded.type, country_slug = excluded.country_slug,
  release_year = excluded.release_year, age_rating = excluded.age_rating,
  cast_members = excluded.cast_members, subtitle_langs = excluded.subtitle_langs,
  palette = excluded.palette, featured = excluded.featured,
  trending_rank = excluded.trending_rank, popularity = excluded.popularity,
  status = excluded.status, rights_note = excluded.rights_note;
insert into titles (slug, name, name_km, alt_title, synopsis, synopsis_km,
  tagline, tagline_km, type, country_slug, release_year, age_rating,
  cast_members, subtitle_langs, palette, featured, trending_rank, popularity,
  status, rights_note, created_at, published_at)
values ('the-cartographer', 'The Cartographer', 'អ្នកគូរផែនទី', null,
  'In 1928 a young surveyor is sent to chart the tributaries of the upper basin. The maps he draws are accurate. The ones the ministry publishes are not.', 'ក្នុងឆ្នាំ ១៩២៨ អ្នកវាស់ដីវ័យក្មេងម្នាក់ត្រូវបានបញ្ជូនឲ្យគូរផែនទីដៃទន្លេខាងលើ។ ផែនទីដែលគាត់គូរគឺត្រឹមត្រូវ។ ផែនទីដែលក្រសួងបោះពុម្ពមិនត្រឹមត្រូវ។', 'He mapped every river but could not find his way home.', 'គាត់គូរផែនទីគ្រប់ទន្លេ ប៉ុន្តែរកផ្លូវទៅផ្ទះមិនបាន។',
  'movie'::content_type, 'other', 2022, '13+',
  array['Émile Roux', 'Sok Heng', 'Linh Pham']::text[], array['Khmer', 'English', 'French']::text[], array['#1b2430', '#a8b8c8']::text[],
  false, null, 4310,
  'published', 'Licensed for streaming — sample record only.', '2025-07-01T00:00:00.000Z', '2025-07-01T00:00:00.000Z')
on conflict (slug) do update set
  name = excluded.name, name_km = excluded.name_km, alt_title = excluded.alt_title,
  synopsis = excluded.synopsis, synopsis_km = excluded.synopsis_km,
  tagline = excluded.tagline, tagline_km = excluded.tagline_km,
  type = excluded.type, country_slug = excluded.country_slug,
  release_year = excluded.release_year, age_rating = excluded.age_rating,
  cast_members = excluded.cast_members, subtitle_langs = excluded.subtitle_langs,
  palette = excluded.palette, featured = excluded.featured,
  trending_rank = excluded.trending_rank, popularity = excluded.popularity,
  status = excluded.status, rights_note = excluded.rights_note;
insert into titles (slug, name, name_km, alt_title, synopsis, synopsis_km,
  tagline, tagline_km, type, country_slug, release_year, age_rating,
  cast_members, subtitle_langs, palette, featured, trending_rank, popularity,
  status, rights_note, created_at, published_at)
values ('little-elephant-road', 'Little Elephant Road', 'ផ្លូវដំរីតូច', null,
  'Tuk-Tuk the elephant follows a melody down a road that is not on any map, meeting animals who each know one line of the song.', 'ទូកទូក ដំរីតូច ដើរតាមបទភ្លេងមួយនៅលើផ្លូវដែលមិនមានក្នុងផែនទី ជួបសត្វដែលម្នាក់ៗដឹងបន្ទាត់មួយនៃចម្រៀង។', 'A small elephant, a long road, and a song that opens gates.', 'ដំរីតូច ផ្លូវវែង និងចម្រៀងដែលបើកទ្វារ។',
  'drama'::content_type, 'khmer', 2026, 'All',
  array['Voices by CINEMA KH Studio']::text[], array['Khmer', 'English']::text[], array['#123c2b', '#9be564']::text[],
  true, 6, 8020,
  'published', 'Original production — owner: CINEMA KH.', '2026-11-12T00:00:00.000Z', '2026-11-12T00:00:00.000Z')
on conflict (slug) do update set
  name = excluded.name, name_km = excluded.name_km, alt_title = excluded.alt_title,
  synopsis = excluded.synopsis, synopsis_km = excluded.synopsis_km,
  tagline = excluded.tagline, tagline_km = excluded.tagline_km,
  type = excluded.type, country_slug = excluded.country_slug,
  release_year = excluded.release_year, age_rating = excluded.age_rating,
  cast_members = excluded.cast_members, subtitle_langs = excluded.subtitle_langs,
  palette = excluded.palette, featured = excluded.featured,
  trending_rank = excluded.trending_rank, popularity = excluded.popularity,
  status = excluded.status, rights_note = excluded.rights_note;
insert into titles (slug, name, name_km, alt_title, synopsis, synopsis_km,
  tagline, tagline_km, type, country_slug, release_year, age_rating,
  cast_members, subtitle_langs, palette, featured, trending_rank, popularity,
  status, rights_note, created_at, published_at)
values ('silent-frequency', 'Silent Frequency', 'រលកសំឡេងស្ងាត់', null,
  'Late-night talk radio is supposed to be harmless. Then a caller recites a confession in the host''s own voice, and the station''s archive starts losing tapes.', 'វិទ្យុពេលយប់មិនគួរមានបញ្ហាទេ។ បន្ទាប់មកអ្នកហៅចូលម្នាក់សូត្រការសារភាពដោយសំឡេងរបស់ពិធីករខ្លួនឯង។', 'A radio host takes a call from a man who has been dead for a year.', 'ពិធីករវិទ្យុទទួលការហៅពីបុរសម្នាក់ដែលស្លាប់អស់មួយឆ្នាំ។',
  'drama'::content_type, 'korean', 2025, '18+',
  array['Jung Ho', 'Sena Park', 'Min Gi']::text[], array['Khmer', 'English', 'Korean']::text[], array['#0d0d14', '#9b5de5']::text[],
  false, null, 6740,
  'published', 'Licensed for streaming — sample record only.', '2026-09-29T00:00:00.000Z', '2026-09-29T00:00:00.000Z')
on conflict (slug) do update set
  name = excluded.name, name_km = excluded.name_km, alt_title = excluded.alt_title,
  synopsis = excluded.synopsis, synopsis_km = excluded.synopsis_km,
  tagline = excluded.tagline, tagline_km = excluded.tagline_km,
  type = excluded.type, country_slug = excluded.country_slug,
  release_year = excluded.release_year, age_rating = excluded.age_rating,
  cast_members = excluded.cast_members, subtitle_langs = excluded.subtitle_langs,
  palette = excluded.palette, featured = excluded.featured,
  trending_rank = excluded.trending_rank, popularity = excluded.popularity,
  status = excluded.status, rights_note = excluded.rights_note;

-- Categories / countries (many-to-many) ------------------------------------
insert into title_categories (title_id, category_slug)
select id, 'mystery' from titles where slug = 'mekong-shadows'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'crime' from titles where slug = 'mekong-shadows'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'thriller' from titles where slug = 'mekong-shadows'
on conflict do nothing;
insert into title_countries (title_id, country_slug)
select id, 'khmer' from titles where slug = 'mekong-shadows'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'drama' from titles where slug = 'golden-lotus-hotel'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'romance' from titles where slug = 'golden-lotus-hotel'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'mystery' from titles where slug = 'golden-lotus-hotel'
on conflict do nothing;
insert into title_countries (title_id, country_slug)
select id, 'thai' from titles where slug = 'golden-lotus-hotel'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'action' from titles where slug = 'neon-phnom-penh'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'crime' from titles where slug = 'neon-phnom-penh'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'thriller' from titles where slug = 'neon-phnom-penh'
on conflict do nothing;
insert into title_countries (title_id, country_slug)
select id, 'khmer' from titles where slug = 'neon-phnom-penh'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'drama' from titles where slug = 'the-quiet-harvest'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'family' from titles where slug = 'the-quiet-harvest'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'historical' from titles where slug = 'the-quiet-harvest'
on conflict do nothing;
insert into title_countries (title_id, country_slug)
select id, 'khmer' from titles where slug = 'the-quiet-harvest'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'romance' from titles where slug = 'sky-train-love'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'comedy' from titles where slug = 'sky-train-love'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'drama' from titles where slug = 'sky-train-love'
on conflict do nothing;
insert into title_countries (title_id, country_slug)
select id, 'korean' from titles where slug = 'sky-train-love'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'martial-arts' from titles where slug = 'iron-pagoda'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'action' from titles where slug = 'iron-pagoda'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'fantasy' from titles where slug = 'iron-pagoda'
on conflict do nothing;
insert into title_countries (title_id, country_slug)
select id, 'chinese' from titles where slug = 'iron-pagoda'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'thriller' from titles where slug = 'the-understudy'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'mystery' from titles where slug = 'the-understudy'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'drama' from titles where slug = 'the-understudy'
on conflict do nothing;
insert into title_countries (title_id, country_slug)
select id, 'japanese' from titles where slug = 'the-understudy'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'horror' from titles where slug = 'village-of-rain'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'mystery' from titles where slug = 'village-of-rain'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'drama' from titles where slug = 'village-of-rain'
on conflict do nothing;
insert into title_countries (title_id, country_slug)
select id, 'khmer' from titles where slug = 'village-of-rain'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'comedy' from titles where slug = 'the-last-seller'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'family' from titles where slug = 'the-last-seller'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'drama' from titles where slug = 'the-last-seller'
on conflict do nothing;
insert into title_countries (title_id, country_slug)
select id, 'khmer' from titles where slug = 'the-last-seller'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'science-fiction' from titles where slug = 'orbit-9'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'thriller' from titles where slug = 'orbit-9'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'mystery' from titles where slug = 'orbit-9'
on conflict do nothing;
insert into title_countries (title_id, country_slug)
select id, 'other' from titles where slug = 'orbit-9'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'romance' from titles where slug = 'salt-and-jasmine'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'drama' from titles where slug = 'salt-and-jasmine'
on conflict do nothing;
insert into title_countries (title_id, country_slug)
select id, 'thai' from titles where slug = 'salt-and-jasmine'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'adventure' from titles where slug = 'the-cartographer'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'historical' from titles where slug = 'the-cartographer'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'drama' from titles where slug = 'the-cartographer'
on conflict do nothing;
insert into title_countries (title_id, country_slug)
select id, 'other' from titles where slug = 'the-cartographer'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'animation' from titles where slug = 'little-elephant-road'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'family' from titles where slug = 'little-elephant-road'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'adventure' from titles where slug = 'little-elephant-road'
on conflict do nothing;
insert into title_countries (title_id, country_slug)
select id, 'khmer' from titles where slug = 'little-elephant-road'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'thriller' from titles where slug = 'silent-frequency'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'crime' from titles where slug = 'silent-frequency'
on conflict do nothing;
insert into title_categories (title_id, category_slug)
select id, 'drama' from titles where slug = 'silent-frequency'
on conflict do nothing;
insert into title_countries (title_id, country_slug)
select id, 'korean' from titles where slug = 'silent-frequency'
on conflict do nothing;

-- Seasons ------------------------------------------------------------------
insert into seasons (title_id, number, name)
select id, 1, 'Season 1' from titles where slug = 'mekong-shadows'
on conflict (title_id, number) do update set name = excluded.name;
insert into seasons (title_id, number, name)
select id, 2, 'Season 2' from titles where slug = 'mekong-shadows'
on conflict (title_id, number) do update set name = excluded.name;
insert into seasons (title_id, number, name)
select id, 1, 'Season 1' from titles where slug = 'golden-lotus-hotel'
on conflict (title_id, number) do update set name = excluded.name;
insert into seasons (title_id, number, name)
select id, 1, 'Feature Film' from titles where slug = 'neon-phnom-penh'
on conflict (title_id, number) do update set name = excluded.name;
insert into seasons (title_id, number, name)
select id, 1, 'Feature Film' from titles where slug = 'the-quiet-harvest'
on conflict (title_id, number) do update set name = excluded.name;
insert into seasons (title_id, number, name)
select id, 1, 'Season 1' from titles where slug = 'sky-train-love'
on conflict (title_id, number) do update set name = excluded.name;
insert into seasons (title_id, number, name)
select id, 1, 'Season 1' from titles where slug = 'iron-pagoda'
on conflict (title_id, number) do update set name = excluded.name;
insert into seasons (title_id, number, name)
select id, 1, 'Feature Film' from titles where slug = 'the-understudy'
on conflict (title_id, number) do update set name = excluded.name;
insert into seasons (title_id, number, name)
select id, 1, 'Season 1' from titles where slug = 'village-of-rain'
on conflict (title_id, number) do update set name = excluded.name;
insert into seasons (title_id, number, name)
select id, 1, 'Feature Film' from titles where slug = 'the-last-seller'
on conflict (title_id, number) do update set name = excluded.name;
insert into seasons (title_id, number, name)
select id, 1, 'Season 1' from titles where slug = 'orbit-9'
on conflict (title_id, number) do update set name = excluded.name;
insert into seasons (title_id, number, name)
select id, 1, 'Feature Film' from titles where slug = 'salt-and-jasmine'
on conflict (title_id, number) do update set name = excluded.name;
insert into seasons (title_id, number, name)
select id, 1, 'Feature Film' from titles where slug = 'the-cartographer'
on conflict (title_id, number) do update set name = excluded.name;
insert into seasons (title_id, number, name)
select id, 1, 'Season 1' from titles where slug = 'little-elephant-road'
on conflict (title_id, number) do update set name = excluded.name;
insert into seasons (title_id, number, name)
select id, 1, 'Season 1' from titles where slug = 'silent-frequency'
on conflict (title_id, number) do update set name = excluded.name;

-- Episodes -----------------------------------------------------------------
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 1, 'Low Water', 'ទឹកស្រក',
  2700, '2026-09-18T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'mekong-shadows'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 2, 'The Watch', 'នាឡិកា',
  2700, '2026-09-25T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'mekong-shadows'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 3, 'Ferry at Dawn', 'សាឡាងព្រឹកព្រលឹម',
  2700, '2026-10-02T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'mekong-shadows'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 4, 'Everyone Knew', 'អ្នកទាំងអស់បានដឹង',
  2700, '2026-10-09T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'mekong-shadows'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 5, 'Red Dust', 'ធូលីក្រហម',
  2700, '2026-10-16T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'mekong-shadows'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 6, 'The File Room', 'បន្ទប់ឯកសារ',
  2700, '2026-10-23T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'mekong-shadows'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 7, 'High Water', 'ទឹកឡើង',
  2700, '2026-10-30T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'mekong-shadows'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 8, 'Homecoming', 'ការត្រឡប់មកផ្ទះ',
  2700, '2026-11-06T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'mekong-shadows'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 1, 'New Province', 'ខេត្តថ្មី',
  2700, '2026-11-18T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 2
where t.slug = 'mekong-shadows'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 2, 'The Witness Who Left', 'សាក្សីដែលចាកចេញ',
  2700, '2026-11-25T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 2
where t.slug = 'mekong-shadows'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 3, 'Dry Season', 'រដូវប្រាំង',
  2700, '2026-12-02T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 2
where t.slug = 'mekong-shadows'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 4, 'Two Boats', 'ទូកពីរ',
  2700, '2026-12-09T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 2
where t.slug = 'mekong-shadows'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 5, 'Nothing Personal', 'គ្មានរឿងផ្ទាល់ខ្លួន',
  2700, '2026-12-16T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 2
where t.slug = 'mekong-shadows'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 6, 'The Last Ferry', 'សាឡាងចុងក្រោយ',
  2700, '2026-12-23T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 2
where t.slug = 'mekong-shadows'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 1, 'Check-In', 'ចូលស្នាក់',
  2700, '2026-07-16T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'golden-lotus-hotel'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 2, 'Room 214', 'បន្ទប់ ២១៤',
  2700, '2026-07-23T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'golden-lotus-hotel'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 3, 'Room Service', 'សេវាបន្ទប់',
  2700, '2026-07-30T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'golden-lotus-hotel'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 4, 'The Ledger', 'សៀវភៅកត់ត្រា',
  2700, '2026-08-06T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'golden-lotus-hotel'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 5, 'Blackout', 'ដាច់ភ្លើង',
  2700, '2026-08-13T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'golden-lotus-hotel'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 6, 'Check-Out', 'ចេញ',
  2700, '2026-08-20T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'golden-lotus-hotel'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 1, 'Neon Phnom Penh', 'ភ្នំពេញពន្លឺនេអុង',
  7080, '2026-10-23T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'neon-phnom-penh'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 1, 'The Quiet Harvest', 'រដូវចម្រូតស្ងប់ស្ងាត់',
  6240, '2026-04-27T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'the-quiet-harvest'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 1, '7:42', '៧:៤២',
  3720, '2026-10-23T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'sky-train-love'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 2, 'The Notebook', 'សៀវភៅកត់ត្រា',
  3720, '2026-10-30T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'sky-train-love'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 3, 'Rain, Late', 'ភ្លៀង យឺតពេល',
  3720, '2026-11-06T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'sky-train-love'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 4, 'Platform Two', 'វេទិកាទីពីរ',
  3720, '2026-11-13T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'sky-train-love'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 5, 'Last Train', 'រថភ្លើងចុងក្រោយ',
  3720, '2026-11-20T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'sky-train-love'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 1, 'The Kitchen Boy', 'ក្មេងប្រុសផ្ទះបាយ',
  2880, '2026-08-15T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'iron-pagoda'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 2, 'Half a Manual', 'សៀវភៅពាក់កណ្តាល',
  2880, '2026-08-22T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'iron-pagoda'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 3, 'Nine Steps', 'ប្រាំបួនជំហាន',
  2880, '2026-08-29T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'iron-pagoda'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 4, 'The Valley', 'ជ្រលងភ្នំ',
  2880, '2026-09-05T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'iron-pagoda'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 5, 'Ash', 'ផេះ',
  2880, '2026-09-12T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'iron-pagoda'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 6, 'Rebuild', 'សាងសង់ឡើងវិញ',
  2880, '2026-09-19T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'iron-pagoda'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 1, 'The Understudy', 'តួជំនួស',
  6720, '2026-06-16T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'the-understudy'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 1, 'The Posting', 'ការបញ្ជូន',
  2640, '2026-09-14T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'village-of-rain'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 2, 'Temple Gate', 'មាត់ទ្វារវត្ត',
  2640, '2026-09-21T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'village-of-rain'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 3, 'The Well', 'អណ្តូង',
  2640, '2026-09-28T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'village-of-rain'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 4, 'Four Months', 'បួនខែ',
  2640, '2026-10-05T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'village-of-rain'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 5, 'Dry Again', 'ស្ងួតវិញ',
  2640, '2026-10-12T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'village-of-rain'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 1, 'The Last Seller', 'អ្នកលក់ចុងក្រោយ',
  5760, '2025-12-28T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'the-last-seller'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 1, 'Eleven Days', 'ដប់មួយថ្ងៃ',
  3060, '2026-11-10T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'orbit-9'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 2, 'Day Six', 'ថ្ងៃទីប្រាំមួយ',
  3060, '2026-11-17T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'orbit-9'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 3, 'Own Signal', 'សញ្ញាខ្លួនឯង',
  3060, '2026-11-24T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'orbit-9'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 4, 'Quiet Deck', 'នាវាស្ងប់ស្ងាត់',
  3060, '2026-12-01T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'orbit-9'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 1, 'Salt and Jasmine', 'អំបិល និងផ្កាម្លិះ',
  6480, '2026-02-26T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'salt-and-jasmine'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 1, 'The Cartographer', 'អ្នកគូរផែនទី',
  7620, '2025-07-01T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'the-cartographer'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 1, 'The Melody', 'បទភ្លេង',
  1320, '2026-11-12T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'little-elephant-road'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 2, 'Gate of Reeds', 'ទ្វារដើមរំដេង',
  1320, '2026-11-19T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'little-elephant-road'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 3, 'The Frog''s Line', 'បន្ទាត់របស់កង្កែប',
  1320, '2026-11-26T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'little-elephant-road'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 4, 'Long Road', 'ផ្លូវវែង',
  1320, '2026-12-03T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'little-elephant-road'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 1, 'Caller One', 'អ្នកហៅទីមួយ',
  3480, '2026-09-29T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'silent-frequency'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 2, 'Dead Air', 'ខ្យល់ស្លាប់',
  3480, '2026-10-06T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'silent-frequency'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 3, 'Archive', 'បណ្ណសារ',
  3480, '2026-10-13T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'silent-frequency'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 4, 'Live', 'ផ្សាយផ្ទាល់',
  3480, '2026-10-20T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'silent-frequency'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;
insert into episodes (title_id, season_id, number, name, name_km, duration_seconds, release_at)
select t.id, s.id, 5, 'Sign-Off', 'បញ្ចប់ការផ្សាយ',
  3480, '2026-10-27T00:00:00.000Z'
from titles t
join seasons s on s.title_id = t.id and s.number = 1
where t.slug = 'silent-frequency'
on conflict (season_id, number) do update set
  name = excluded.name, name_km = excluded.name_km,
  duration_seconds = excluded.duration_seconds, release_at = excluded.release_at;

-- Video assets (PLACEHOLDER — replace with licensed assets) ----------------
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'mekong-shadows' and s.number = 1 and e.number = 1
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'mekong-shadows' and s.number = 1 and e.number = 2
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'mekong-shadows' and s.number = 1 and e.number = 3
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'mekong-shadows' and s.number = 1 and e.number = 4
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'mekong-shadows' and s.number = 1 and e.number = 5
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'mekong-shadows' and s.number = 1 and e.number = 6
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'mekong-shadows' and s.number = 1 and e.number = 7
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'mekong-shadows' and s.number = 1 and e.number = 8
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'mekong-shadows' and s.number = 2 and e.number = 1
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'mekong-shadows' and s.number = 2 and e.number = 2
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'mekong-shadows' and s.number = 2 and e.number = 3
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'mekong-shadows' and s.number = 2 and e.number = 4
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'mekong-shadows' and s.number = 2 and e.number = 5
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'mekong-shadows' and s.number = 2 and e.number = 6
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'golden-lotus-hotel' and s.number = 1 and e.number = 1
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'golden-lotus-hotel' and s.number = 1 and e.number = 2
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'golden-lotus-hotel' and s.number = 1 and e.number = 3
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'golden-lotus-hotel' and s.number = 1 and e.number = 4
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'golden-lotus-hotel' and s.number = 1 and e.number = 5
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'golden-lotus-hotel' and s.number = 1 and e.number = 6
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'neon-phnom-penh' and s.number = 1 and e.number = 1
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'the-quiet-harvest' and s.number = 1 and e.number = 1
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'sky-train-love' and s.number = 1 and e.number = 1
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'sky-train-love' and s.number = 1 and e.number = 2
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'sky-train-love' and s.number = 1 and e.number = 3
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'sky-train-love' and s.number = 1 and e.number = 4
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'sky-train-love' and s.number = 1 and e.number = 5
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'iron-pagoda' and s.number = 1 and e.number = 1
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'iron-pagoda' and s.number = 1 and e.number = 2
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'iron-pagoda' and s.number = 1 and e.number = 3
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'iron-pagoda' and s.number = 1 and e.number = 4
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'iron-pagoda' and s.number = 1 and e.number = 5
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'iron-pagoda' and s.number = 1 and e.number = 6
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'the-understudy' and s.number = 1 and e.number = 1
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'village-of-rain' and s.number = 1 and e.number = 1
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'village-of-rain' and s.number = 1 and e.number = 2
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'village-of-rain' and s.number = 1 and e.number = 3
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'village-of-rain' and s.number = 1 and e.number = 4
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'village-of-rain' and s.number = 1 and e.number = 5
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'the-last-seller' and s.number = 1 and e.number = 1
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'orbit-9' and s.number = 1 and e.number = 1
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'orbit-9' and s.number = 1 and e.number = 2
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'orbit-9' and s.number = 1 and e.number = 3
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'orbit-9' and s.number = 1 and e.number = 4
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'salt-and-jasmine' and s.number = 1 and e.number = 1
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'the-cartographer' and s.number = 1 and e.number = 1
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'little-elephant-road' and s.number = 1 and e.number = 1
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'little-elephant-road' and s.number = 1 and e.number = 2
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'little-elephant-road' and s.number = 1 and e.number = 3
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'little-elephant-road' and s.number = 1 and e.number = 4
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'silent-frequency' and s.number = 1 and e.number = 1
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'silent-frequency' and s.number = 1 and e.number = 2
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'silent-frequency' and s.number = 1 and e.number = 3
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'silent-frequency' and s.number = 1 and e.number = 4
on conflict (episode_id, label) do nothing;
insert into video_assets (episode_id, provider, embed_url, label, is_primary)
select e.id, 'external_embed', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'main', true
from episodes e
join seasons s on s.id = e.season_id
join titles t on t.id = s.title_id
where t.slug = 'silent-frequency' and s.number = 1 and e.number = 5
on conflict (episode_id, label) do nothing;

-- Ad placements: created but DISABLED. Turning these on before provider
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
