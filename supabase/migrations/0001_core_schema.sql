-- =============================================================================
-- CINEMA KH — core schema
-- Postgres / Supabase migration. Idempotent where practical.
--
-- Design notes
--  * A "title" is the unifying content record: a movie has exactly one season
--    with exactly one episode; a drama has N seasons × M episodes.
--  * Viewer data is owned by (account_id, profile_id). Profiles are not
--    identities, they are sub-accounts of an authenticated user.
--  * Admin rights live in `user_roles` and are only ever evaluated server-side
--    (see `is_admin()`), never trusted from the client.
--  * No ad revenue/impression data is stored here: provider reports are the only
--    source of truth (see docs/ADS_INTEGRATION.md).
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
do $$ begin
  create type content_type as enum ('movie', 'drama');
exception when duplicate_object then null; end $$;

do $$ begin
  create type publish_status as enum ('draft', 'scheduled', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type app_role as enum ('admin', 'moderator');
exception when duplicate_object then null; end $$;

do $$ begin
  create type request_status as enum ('pending', 'planned', 'fulfilled', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type ad_format as enum ('leaderboard', 'rectangle', 'mobile');
exception when duplicate_object then null; end $$;

-- -----------------------------------------------------------------------------
-- Reference tables
-- -----------------------------------------------------------------------------
create table if not exists categories (
  slug        text primary key,
  name        text not null unique,
  name_km     text not null,
  sort_order  int  not null default 0
);

create table if not exists countries (
  slug        text primary key,
  name        text not null unique,
  name_km     text not null,
  sort_order  int  not null default 0
);

-- -----------------------------------------------------------------------------
-- Accounts → profiles
-- -----------------------------------------------------------------------------
create table if not exists accounts (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text,
  display_name text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  suspended_at timestamptz,
  suspended_reason text
);

create table if not exists user_roles (
  account_id uuid not null references accounts (id) on delete cascade,
  role       app_role not null,
  granted_at timestamptz not null default now(),
  granted_by uuid references accounts (id),
  primary key (account_id, role)
);

create table if not exists profiles (
  id         uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 24),
  avatar_url text,
  is_kids    boolean not null default false,
  max_age_rating int check (max_age_rating between 0 and 21),
  pin_hash   text,
  created_at timestamptz not null default now(),
  unique (account_id, name)
);
create index if not exists profiles_account_idx on profiles (account_id);

-- Enforce the "max 5 profiles per account" rule in the database, not the UI.
create or replace function enforce_profile_limit() returns trigger
language plpgsql as $$
begin
  if (select count(*) from profiles where account_id = new.account_id) >= 5 then
    raise exception 'profile limit reached (max 5 per account)';
  end if;
  return new;
end $$;

drop trigger if exists profiles_limit on profiles;
create trigger profiles_limit before insert on profiles
for each row execute function enforce_profile_limit();

-- -----------------------------------------------------------------------------
-- Catalogue
-- -----------------------------------------------------------------------------
create table if not exists titles (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name          text not null,
  name_km       text not null,
  alt_title     text,
  synopsis      text not null default '',
  synopsis_km   text not null default '',
  tagline       text not null default '',
  tagline_km    text not null default '',
  type          content_type not null,
  country_slug  text references countries (slug),
  release_year  int check (release_year between 1900 and 2100),
  age_rating    text not null default 'All',
  cast_members  text[] not null default '{}',
  subtitle_langs text[] not null default '{}',
  palette       text[] not null default array['#101018', '#3a3a55'],
  featured      boolean not null default false,
  trending_rank int,
  popularity    int not null default 0,
  status        publish_status not null default 'draft',
  -- Internal only: rights/source traceability. Never exposed publicly.
  rights_note   text not null default '',
  source_note   text,
  created_by    uuid references accounts (id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  published_at  timestamptz
);
create index if not exists titles_status_idx on titles (status, popularity desc);
create index if not exists titles_type_idx on titles (type, status);
create index if not exists titles_featured_idx on titles (featured) where featured;

create table if not exists title_categories (
  title_id      uuid not null references titles (id) on delete cascade,
  category_slug text not null references categories (slug) on delete restrict,
  primary key (title_id, category_slug)
);
create index if not exists title_categories_cat_idx on title_categories (category_slug);

create table if not exists title_countries (
  title_id     uuid not null references titles (id) on delete cascade,
  country_slug text not null references countries (slug) on delete restrict,
  primary key (title_id, country_slug)
);

create table if not exists seasons (
  id           uuid primary key default gen_random_uuid(),
  title_id     uuid not null references titles (id) on delete cascade,
  number       int  not null check (number > 0),
  name         text not null default '',
  created_at   timestamptz not null default now(),
  unique (title_id, number)
);

create table if not exists episodes (
  id             uuid primary key default gen_random_uuid(),
  title_id       uuid not null references titles (id) on delete cascade,
  season_id      uuid not null references seasons (id) on delete cascade,
  number         int  not null check (number > 0),
  name           text not null default '',
  name_km        text not null default '',
  synopsis       text not null default '',
  duration_seconds int check (duration_seconds > 0),
  -- Scheduled release. Playback is refused before this timestamp (server-side).
  release_at     timestamptz not null default now(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (season_id, number)
);
create index if not exists episodes_title_idx on episodes (title_id, release_at desc);
create index if not exists episodes_release_idx on episodes (release_at);

-- Video sources. `provider` is 'cloudflare_stream' or 'external_embed'.
-- Tokens are NEVER stored here — only the provider asset id / embed URL that
-- the server needs to mint a short-lived signed playback token per request.
create table if not exists video_assets (
  id              uuid primary key default gen_random_uuid(),
  episode_id      uuid not null references episodes (id) on delete cascade,
  provider        text not null check (provider in ('cloudflare_stream', 'external_embed')),
  provider_asset_id text,
  embed_url       text,
  label           text not null default 'main',
  quality         text,
  is_primary      boolean not null default true,
  created_at      timestamptz not null default now(),
  unique (episode_id, label),
  check (
    (provider = 'cloudflare_stream' and provider_asset_id is not null) or
    (provider = 'external_embed' and embed_url is not null)
  )
);
create index if not exists video_assets_episode_idx on video_assets (episode_id);

create table if not exists subtitles (
  id         uuid primary key default gen_random_uuid(),
  episode_id uuid not null references episodes (id) on delete cascade,
  language   text not null,
  label      text not null,
  format     text not null default 'vtt' check (format in ('vtt', 'srt')),
  storage_path text not null,
  is_default boolean not null default false
);
create index if not exists subtitles_episode_idx on subtitles (episode_id);

-- -----------------------------------------------------------------------------
-- Viewer activity (profile-scoped)
-- -----------------------------------------------------------------------------
create table if not exists watch_progress (
  profile_id      uuid not null references profiles (id) on delete cascade,
  episode_id      uuid not null references episodes (id) on delete cascade,
  title_id        uuid not null references titles (id) on delete cascade,
  position_seconds int not null check (position_seconds >= 0),
  duration_seconds int not null check (duration_seconds > 0),
  completed       boolean not null default false,
  updated_at      timestamptz not null default now(),
  primary key (profile_id, episode_id)
);
create index if not exists watch_progress_recent_idx on watch_progress (profile_id, updated_at desc);

create table if not exists watch_history (
  id         bigserial primary key,
  profile_id uuid not null references profiles (id) on delete cascade,
  episode_id uuid not null references episodes (id) on delete cascade,
  title_id   uuid not null references titles (id) on delete cascade,
  watched_at timestamptz not null default now(),
  seconds    int not null default 0
);
create index if not exists watch_history_profile_idx on watch_history (profile_id, watched_at desc);

create table if not exists watchlists (
  profile_id uuid not null references profiles (id) on delete cascade,
  title_id   uuid not null references titles (id) on delete cascade,
  added_at   timestamptz not null default now(),
  primary key (profile_id, title_id)
);

create table if not exists ratings (
  profile_id uuid not null references profiles (id) on delete cascade,
  title_id   uuid not null references titles (id) on delete cascade,
  stars      int  not null check (stars between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (profile_id, title_id)
);

create table if not exists comments (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles (id) on delete cascade,
  title_id    uuid not null references titles (id) on delete cascade,
  body        text not null check (char_length(body) between 1 and 2000),
  is_hidden   boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists comments_title_idx on comments (title_id, created_at desc);

create table if not exists content_reports (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid references profiles (id) on delete set null,
  episode_id  uuid references episodes (id) on delete cascade,
  title_id    uuid references titles (id) on delete cascade,
  reason      text not null check (char_length(reason) between 1 and 500),
  status      report_status not null default 'open',
  created_at  timestamptz not null default now(),
  resolved_at timestamptz,
  check (episode_id is not null or title_id is not null)
);

create table if not exists movie_requests (
  id         uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts (id) on delete cascade,
  title      text not null check (char_length(title) between 2 and 200),
  country    text,
  year       int check (year between 1900 and 2100),
  notes      text check (char_length(notes) <= 400),
  status     request_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists movie_requests_account_idx on movie_requests (account_id, created_at desc);
create index if not exists movie_requests_status_idx on movie_requests (status, created_at);

create table if not exists notification_preferences (
  profile_id      uuid primary key references profiles (id) on delete cascade,
  new_episodes    boolean not null default true,
  email_enabled   boolean not null default false,
  timezone        text not null default 'Asia/Phnom_Penh'
);

-- -----------------------------------------------------------------------------
-- Operations
-- -----------------------------------------------------------------------------
create table if not exists video_health_checks (
  id           bigserial primary key,
  video_asset_id uuid not null references video_assets (id) on delete cascade,
  checked_at   timestamptz not null default now(),
  ok           boolean not null,
  status_code  int,
  error_category text,
  detail       text
);
create index if not exists video_health_recent_idx on video_health_checks (video_asset_id, checked_at desc);

create table if not exists admin_audit_logs (
  id         bigserial primary key,
  actor_id   uuid references accounts (id),
  action     text not null,
  entity     text not null,
  entity_id  text,
  before     jsonb,
  after      jsonb,
  ip         text,
  created_at timestamptz not null default now()
);
create index if not exists audit_actor_idx on admin_audit_logs (actor_id, created_at desc);

create table if not exists site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references accounts (id)
);

create table if not exists ad_placements (
  id            text primary key,
  page          text not null,
  format        ad_format not null,
  enabled       boolean not null default false,
  frequency_cap int,
  notes         text,
  updated_at    timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- updated_at triggers
-- -----------------------------------------------------------------------------
create or replace function touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['titles', 'episodes', 'accounts', 'movie_requests', 'ratings']
  loop
    execute format('drop trigger if exists touch_%1$s on %1$s', t);
    execute format(
      'create trigger touch_%1$s before update on %1$s for each row execute function touch_updated_at()', t);
  end loop;
end $$;

-- Keep denormalised updated_at/`is_primary` consistent
create or replace function ensure_single_primary_asset() returns trigger
language plpgsql as $$
begin
  if new.is_primary then
    update video_assets set is_primary = false
      where episode_id = new.episode_id and id <> new.id and is_primary;
  end if;
  return new;
end $$;

drop trigger if exists video_assets_primary on video_assets;
create trigger video_assets_primary after insert or update of is_primary on video_assets
for each row execute function ensure_single_primary_asset();

-- -----------------------------------------------------------------------------
-- Account bootstrap: an auth.users row creates the matching account record.
-- -----------------------------------------------------------------------------
create or replace function handle_new_auth_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.accounts (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, ''), '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(excluded.display_name, accounts.display_name),
        avatar_url = coalesce(excluded.avatar_url, accounts.avatar_url);
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert or update on auth.users
for each row execute function handle_new_auth_user();
