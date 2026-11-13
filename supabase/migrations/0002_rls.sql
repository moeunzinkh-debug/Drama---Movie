-- =============================================================================
-- CINEMA KH — Row Level Security
--
-- Principles
--  1. Default deny on every table in `public`.
--  2. Visitors may read published catalogue rows only.
--  3. Viewer data is readable/writable only by the owning account, through one
--     of that account's profiles.
--  4. Admin capability comes from `user_roles`, evaluated by `is_admin()` in the
--     database. The client can never assert a role.
--  5. Internal columns (rights notes, source notes) are never readable by
--     anon/authenticated — they are exposed to service-role server code only.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles
    where account_id = auth.uid() and role in ('admin', 'moderator')
  );
$$;

create or replace function public.is_staff_or_admin()
returns boolean language sql stable as $$ select public.is_admin(); $$;

-- True when the given profile belongs to the calling account.
create or replace function public.owns_profile(p_profile uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = p_profile and account_id = auth.uid()
  );
$$;

-- True when the calling account is not suspended.
create or replace function public.is_active_account()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.accounts
    where id = auth.uid() and suspended_at is null
  );
$$;

-- A title is visible when published, or to admins regardless of status.
create or replace function public.can_view_title(t_status publish_status)
returns boolean language sql stable as $$
  select t_status = 'published' or public.is_admin();
$$;

-- Restrict a profile to age-appropriate content (parental control).
create or replace function public.rating_allows(p_profile uuid, p_rating text)
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((
    select case
      when pr.max_age_rating is null then true
      else (
        case when nullif(regexp_replace(coalesce(p_rating, ''), '\\D', '', 'g'), '') is null
             then 0
             else nullif(regexp_replace(coalesce(p_rating, ''), '\\D', '', 'g'), '')::int
        end
      ) <= pr.max_age_rating
    end
    from public.profiles pr
    where pr.id = p_profile
  ), false);
$$;

-- -----------------------------------------------------------------------------
-- Enable RLS everywhere
-- -----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'accounts','user_roles','profiles',
    'categories','countries','titles','title_categories','title_countries',
    'seasons','episodes','video_assets','subtitles',
    'watch_progress','watch_history','watchlists','ratings','comments',
    'content_reports','movie_requests','notification_preferences',
    'video_health_checks','admin_audit_logs','site_settings',
    'ad_placements'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
  end loop;
end $$;

-- -----------------------------------------------------------------------------
-- Reference data: world-readable, admin-writable
-- -----------------------------------------------------------------------------
drop policy if exists categories_read on categories;
create policy categories_read on categories for select using (true);
drop policy if exists categories_admin on categories;
create policy categories_admin on categories for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists countries_read on countries;
create policy countries_read on countries for select using (true);
drop policy if exists countries_admin on countries;
create policy countries_admin on countries for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- accounts
-- -----------------------------------------------------------------------------
drop policy if exists accounts_self_read on accounts;
create policy accounts_self_read on accounts for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists accounts_self_update on accounts;
create policy accounts_self_update on accounts for update
  using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists accounts_admin on accounts;
create policy accounts_admin on accounts for all
  using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- user_roles: readable by the owner (so the UI can show "admin"), writable only
-- by admins. Bootstrap of the first admin happens with the service role.
-- -----------------------------------------------------------------------------
drop policy if exists user_roles_read on user_roles;
create policy user_roles_read on user_roles for select
  using (account_id = auth.uid() or public.is_admin());

drop policy if exists user_roles_admin_write on user_roles;
create policy user_roles_admin_write on user_roles for all
  using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
drop policy if exists profiles_owner on profiles;
create policy profiles_owner on profiles for select
  using (account_id = auth.uid() or public.is_admin());

drop policy if exists profiles_owner_write on profiles;
create policy profiles_owner_write on profiles for insert
  with check (account_id = auth.uid() and public.is_active_account());

drop policy if exists profiles_owner_update on profiles;
create policy profiles_owner_update on profiles for update
  using (account_id = auth.uid()) with check (account_id = auth.uid());

drop policy if exists profiles_owner_delete on profiles;
create policy profiles_owner_delete on profiles for delete
  using (account_id = auth.uid());

-- -----------------------------------------------------------------------------
-- Catalogue
-- -----------------------------------------------------------------------------
drop policy if exists titles_read on titles;
create policy titles_read on titles for select
  using (public.can_view_title(status));

drop policy if exists titles_admin_write on titles;
create policy titles_admin_write on titles for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists title_categories_read on title_categories;
create policy title_categories_read on title_categories for select
  using (exists (select 1 from titles t where t.id = title_id and public.can_view_title(t.status)));

drop policy if exists title_categories_admin on title_categories;
create policy title_categories_admin on title_categories for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists title_countries_read on title_countries;
create policy title_countries_read on title_countries for select
  using (exists (select 1 from titles t where t.id = title_id and public.can_view_title(t.status)));

drop policy if exists title_countries_admin on title_countries;
create policy title_countries_admin on title_countries for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists seasons_read on seasons;
create policy seasons_read on seasons for select
  using (exists (select 1 from titles t where t.id = title_id and public.can_view_title(t.status)));

drop policy if exists seasons_admin on seasons;
create policy seasons_admin on seasons for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists episodes_read on episodes;
create policy episodes_read on episodes for select
  using (exists (select 1 from titles t where t.id = title_id and public.can_view_title(t.status)));

drop policy if exists episodes_admin on episodes;
create policy episodes_admin on episodes for all
  using (public.is_admin()) with check (public.is_admin());

-- Video asset identifiers are readable only to signed-in users on published
-- titles. The signed playback token is minted by a server route, never here.
drop policy if exists video_assets_read on video_assets;
create policy video_assets_read on video_assets for select
  using (
    auth.uid() is not null
    and exists (
      select 1 from episodes e
      join titles t on t.id = e.title_id
      where e.id = video_assets.episode_id and public.can_view_title(t.status)
    )
  );

drop policy if exists video_assets_admin on video_assets;
create policy video_assets_admin on video_assets for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists subtitles_read on subtitles;
create policy subtitles_read on subtitles for select
  using (exists (
    select 1 from episodes e join titles t on t.id = e.title_id
    where e.id = subtitles.episode_id and public.can_view_title(t.status)
  ));

drop policy if exists subtitles_admin on subtitles;
create policy subtitles_admin on subtitles for all
  using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Viewer activity — all scoped to profiles owned by auth.uid()
-- -----------------------------------------------------------------------------
drop policy if exists watch_progress_owner on watch_progress;
create policy watch_progress_owner on watch_progress for select
  using (public.owns_profile(profile_id));
drop policy if exists watch_progress_write on watch_progress;
create policy watch_progress_write on watch_progress for insert
  with check (public.owns_profile(profile_id) and public.is_active_account());
drop policy if exists watch_progress_update on watch_progress;
create policy watch_progress_update on watch_progress for update
  using (public.owns_profile(profile_id)) with check (public.owns_profile(profile_id));
drop policy if exists watch_progress_delete on watch_progress;
create policy watch_progress_delete on watch_progress for delete
  using (public.owns_profile(profile_id));

drop policy if exists watch_history_owner on watch_history;
create policy watch_history_owner on watch_history for select
  using (public.owns_profile(profile_id));
drop policy if exists watch_history_insert on watch_history;
create policy watch_history_insert on watch_history for insert
  with check (public.owns_profile(profile_id) and public.is_active_account());
drop policy if exists watch_history_delete on watch_history;
create policy watch_history_delete on watch_history for delete
  using (public.owns_profile(profile_id));

drop policy if exists watchlists_owner on watchlists;
create policy watchlists_owner on watchlists for select
  using (public.owns_profile(profile_id));
drop policy if exists watchlists_write on watchlists;
create policy watchlists_write on watchlists for insert
  with check (public.owns_profile(profile_id) and public.is_active_account());
drop policy if exists watchlists_delete on watchlists;
create policy watchlists_delete on watchlists for delete
  using (public.owns_profile(profile_id));

drop policy if exists ratings_read on ratings;
create policy ratings_read on ratings for select using (true);
drop policy if exists ratings_write on ratings;
create policy ratings_write on ratings for insert
  with check (public.owns_profile(profile_id) and public.is_active_account());
drop policy if exists ratings_update on ratings;
create policy ratings_update on ratings for update
  using (public.owns_profile(profile_id)) with check (public.owns_profile(profile_id));
drop policy if exists ratings_delete on ratings;
create policy ratings_delete on ratings for delete
  using (public.owns_profile(profile_id));

drop policy if exists comments_read on comments;
create policy comments_read on comments for select using (is_hidden = false or public.is_admin());
drop policy if exists comments_write on comments;
create policy comments_write on comments for insert
  with check (public.owns_profile(profile_id) and public.is_active_account());
drop policy if exists comments_delete on comments;
create policy comments_delete on comments for delete
  using (public.owns_profile(profile_id) or public.is_admin());
drop policy if exists comments_admin on comments;
create policy comments_admin on comments for update
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists reports_insert on content_reports;
create policy reports_insert on content_reports for insert
  with check (profile_id is null or public.owns_profile(profile_id));
drop policy if exists reports_read on content_reports;
create policy reports_read on content_reports for select
  using (public.owns_profile(profile_id) or public.is_admin());
drop policy if exists reports_admin on content_reports;
create policy reports_admin on content_reports for update
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists movie_requests_owner on movie_requests;
create policy movie_requests_owner on movie_requests for select
  using (account_id = auth.uid() or public.is_admin());
drop policy if exists movie_requests_insert on movie_requests;
create policy movie_requests_insert on movie_requests for insert
  with check (account_id = auth.uid() and public.is_active_account());
drop policy if exists movie_requests_admin on movie_requests;
create policy movie_requests_admin on movie_requests for update
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists notif_prefs_owner on notification_preferences;
create policy notif_prefs_owner on notification_preferences for all
  using (public.owns_profile(profile_id)) with check (public.owns_profile(profile_id));

-- -----------------------------------------------------------------------------
-- Operations — admin only (health checks are written by the service role)
-- -----------------------------------------------------------------------------
drop policy if exists health_read on video_health_checks;
create policy health_read on video_health_checks for select using (public.is_admin());
drop policy if exists health_admin on video_health_checks;
create policy health_admin on video_health_checks for all
  using (public.is_admin()) with check (public.is_admin());

-- Audit log is append-only: no update/delete policy exists at all.
drop policy if exists audit_read on admin_audit_logs;
create policy audit_read on admin_audit_logs for select using (public.is_admin());
drop policy if exists audit_insert on admin_audit_logs;
create policy audit_insert on admin_audit_logs for insert
  with check (public.is_admin() or auth.role() = 'service_role');

drop policy if exists settings_read on site_settings;
create policy settings_read on site_settings for select using (true);
drop policy if exists settings_admin on site_settings;
create policy settings_admin on site_settings for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists ad_placements_read on ad_placements;
create policy ad_placements_read on ad_placements for select using (true);
drop policy if exists ad_placements_admin on ad_placements;
create policy ad_placements_admin on ad_placements for all
  using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Privileges
--
-- RLS filters rows; table/column grants decide what is addressable at all.
-- `rights_note` / `source_note` / `created_by` are internal-only columns and are
-- deliberately NOT granted to anon/authenticated, so they can never leak to a
-- browser — even with a direct PostgREST call.
-- -----------------------------------------------------------------------------
revoke all on all tables in schema public from anon, authenticated;

-- Public catalogue (read-only, minus internal columns)
grant select (id, slug, name, name_km, alt_title, synopsis, synopsis_km,
  tagline, tagline_km, type, country_slug, release_year, age_rating,
  cast_members, subtitle_langs, palette, featured, trending_rank, popularity,
  status, created_at, updated_at, published_at)
  on titles to anon, authenticated;

grant select on categories, countries, title_categories, title_countries,
  seasons, episodes, subtitles, site_settings, ad_placements, ratings
  to anon, authenticated;

-- Viewer data: row access is narrowed by RLS to owned profiles.
grant select, insert, update, delete on profiles, watch_progress, watch_history,
  watchlists, ratings, comments, movie_requests, notification_preferences
  to authenticated;

grant select, insert on content_reports to authenticated;
grant select on video_assets to authenticated;

-- Admin surfaces: RLS + is_admin() decide which rows and, for writes, whether
-- the statement is allowed at all.
grant select, insert, update, delete on categories, countries, titles,
  title_categories, title_countries, seasons, episodes, video_assets, subtitles,
  comments, content_reports, movie_requests, video_health_checks, site_settings,
  ad_placements, accounts, user_roles
  to authenticated;

grant select (id, slug, name, name_km, alt_title, synopsis, synopsis_km, tagline,
  tagline_km, type, country_slug, release_year, age_rating, cast_members,
  subtitle_langs, palette, featured, trending_rank, popularity, status,
  created_by, created_at, updated_at, published_at)
  on titles to authenticated;

grant select on admin_audit_logs to authenticated;
grant insert on admin_audit_logs to authenticated;

grant usage, select on all sequences in schema public to authenticated;
