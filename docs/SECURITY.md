# Security Model & Production Checklist (CINEMA KH)

This document describes what is **actually implemented** now, and what still
needs doing before public launch. It replaced the earlier "prototype" checklist.

---

## 1. What is enforced today

| Control | Implementation | Verified by |
|---|---|---|
| Sign-in | Supabase Auth + Google OAuth (PKCE, httpOnly cookies) | `actions/auth.ts`, `app/auth/callback/route.ts` |
| Session refresh | Middleware refreshes cookies on every request | `middleware.ts` |
| Admin authorisation | `user_roles` read server-side; checked in middleware **and** in every admin page/action | `lib/auth.ts::requireAdmin`, `app/admin/layout.tsx` |
| Row access | RLS enabled + `force row level security` on all 24 tables | `supabase/migrations/0002_rls.sql` |
| Internal columns | `rights_note`, `source_note`, `created_by` not granted to `anon`/`authenticated` | column-level `revoke`/`grant` in `0002_rls.sql` |
| Video access | Server verifies session → suspension → published → release time → parental ceiling, then mints a short-lived token | `app/api/playback/route.ts` |
| Viewer data ownership | Every write re-checks `owns_profile()` in SQL; actions also verify before writing | `actions/viewer.ts`, RLS policies |
| Profile limit | Enforced by a database trigger (max 5), not the UI | `enforce_profile_limit()` |
| Rate limiting | Movie requests capped at 5 pending / 10 per day, checked server-side | `actions/requests.ts` |
| Admin audit | Every mutation inserts into `admin_audit_logs` (append-only: no update/delete policy) | `actions/admin.ts` |
| Ads safety | Enabling a placement is refused unless `NEXT_PUBLIC_ADS_ENABLED=true`; no ad script is loaded | `actions/admin.ts`, `components/ad-slot.tsx` |
| Rights gate | A title cannot be published without a `rights_note` | `setTitleStatus`, `upsertTitle` |

### Defence in depth: why each layer exists

1. **Middleware** — cheap redirect for anonymous `/admin` hits. Treat as UX.
2. **Page/layout** — server render re-checks the role; middleware can be misconfigured.
3. **Server action** — `requireAdmin()` runs again before any write.
4. **RLS** — the final authority. Even a bug in all three layers above cannot
   write another account's rows or read a draft title.

---

## 2. Verify the guarantees yourself

Run these against a real deployment. All four must **fail**.

```bash
# 1. No session → no playback token
curl -X POST https://your-site/api/playback -H 'content-type: application/json' \
  -d '{"episodeId":"<uuid>"}'                     # expect 401

# 2. Internal columns are unreachable even with the anon key
curl "https://<ref>.supabase.co/rest/v1/titles?select=rights_note" \
  -H "apikey: $ANON"                              # expect 400/403, not data

# 3. Draft titles are invisible
curl "https://<ref>.supabase.co/rest/v1/titles?status=eq.draft" \
  -H "apikey: $ANON"                              # expect []

# 4. Another account's progress is invisible
curl "https://<ref>.supabase.co/rest/v1/watch_progress" \
  -H "apikey: $ANON"                              # expect []
```

---

## 3. Secrets

**Never** in the repo, never under a `NEXT_PUBLIC_` name:

- `SUPABASE_SERVICE_ROLE_KEY`
- Google OAuth client secret (lives in Supabase, not in this app)
- `CLOUDFLARE_STREAM_API_TOKEN`, `CLOUDFLARE_STREAM_SIGNING_KEY`

Set them with `npx wrangler secret put <NAME>` on Cloudflare.
`scripts/check-config.ts` fails the build if a long secret-looking value appears
in a `NEXT_PUBLIC_` variable.

---

## 4. Still required before public launch

These are **not** implemented, and each is a launch blocker for a real service:

| # | Item | Why it matters |
|---|---|---|
| 1 | Replace the 14 fictional titles with rights-cleared content | Publishing without rights is copyright infringement |
| 2 | Replace the sample HLS URL with your Cloudflare Stream assets | The placeholder is a third-party test stream |
| 3 | Legal review of `/privacy` and `/terms` | Both are still templates |
| 4 | Real contact address on `/about` | Required for AdSense review |
| 5 | Parental PIN flow | `parental_settings`/`pin_hash` exist in schema; no UI yet |
| 6 | Automated video health checks | Tables exist (`video_health_checks`); no cron job yet |
| 7 | Uptime + error alerting | `observability` is on; no alert routing |
| 8 | Backup + restore drill | Enable Supabase PITR and test one restore |
| 9 | Data deletion path for users | Required by privacy law in many jurisdictions |
| 10 | AdSense application + ads.txt | Only after content is substantial and legal pages are real |

---

## 5. Advertising rules (enforced in code)

- `AdSlot` renders **no** network script. It is a fixed-height placeholder.
- Ads are never rendered above or inside the player, nor beside Play / Next.
- Enabling a placement in `/admin/ads` is refused unless
  `NEXT_PUBLIC_ADS_ENABLED=true`.
- No impression, click, or revenue figure is ever written to the database —
  only provider reports are authoritative.
- `public/ads.txt` stays empty until the provider issues the real line.

---

## 6. Data retention

Define and document these before launch (none are automated yet):

- Delete `watch_history` older than N months.
- Delete `content_reports` after resolution + N months.
- `admin_audit_logs` retained for at least 1 year.
- On account deletion: cascade removes profiles and all viewer data
  (`on delete cascade` is already declared throughout the schema).
