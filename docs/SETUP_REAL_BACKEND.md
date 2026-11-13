# ដំឡើង Backend ពិតប្រាកដ (Supabase + Google + Cloudflare Stream)

ឯកសារនេះបង្ហាញជំហាន **ពីដំបូងដល់ចប់** ដើម្បីប្តូរគេហទំព័រពី prototype ទៅជា
**សេវាកម្មពិត**៖ database ពិត, ការចូល Google ពិត, និងវីដេអូពិត។

> ⏱ ពេលវេលាប៉ាន់ស្មាន៖ **៤៥–៦០ នាទី** (ភាគច្រើនជាការរង់ចាំ Google OAuth និង upload វីដេអូ)

---

## ០. តើអ្វីប្រែប្រួល?

| មុន (prototype) | ឥឡូវ (real) |
|---|---|
| `lib/catalogue.ts` រឿងប្រឌិតក្នុងឯកសារ | PostgreSQL (Supabase) + migrations |
| localStorage "login" | Google OAuth ពិត + httpOnly cookies |
| Gate ក្នុង browser | `POST /api/playback` ត្រួតពិនិត្យនៅ server |
| Progress ក្នុង browser | `watch_progress` table (sync ឆ្លងឧបករណ៍) |
| `/admin` បើកចំហ | `user_roles` + RLS + middleware + audit log |
| Player គំរូ | HLS ពិត (Cloudflare Stream ឬ URL ដែលមានសិទ្ធិ) |

---

## ១. បង្កើត Supabase project

1. ចូល https://supabase.com/dashboard → **New project**
2. ជ្រើសរើស region ជិតបំផុត (Singapore ល្អសម្រាប់កម្ពុជា)
3. រង់ចាំ database បង្កើតរួច (~២ នាទី)
4. ចូល **Project Settings → API** ហើយចម្លង៖
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **កុំដាក់ក្នុង browser**

---

## ២. រត់ migrations (schema + RLS + seed)

### វិធី A — Supabase CLI (ណែនាំ)

```bash
npm install -g supabase        # ឬ brew install supabase/tap/supabase
supabase login
supabase link --project-ref <your-project-ref>

supabase db push               # រត់ 0001, 0002, 0003 តាមលំដាប់
```

### វិធី B — SQL Editor (គ្មាន CLI)

បើក **SQL Editor** ក្នុង dashboard ហើយចម្លងឯកសារទាំង ៣ តាមលំដាប់៖

1. `supabase/migrations/0001_core_schema.sql` → Run
2. `supabase/migrations/0002_rls.sql` → Run
3. `supabase/migrations/0003_seed.sql` → Run

**ត្រូវតែតាមលំដាប់នេះ** ព្រោះ RLS យោងលើតារាងដែលបង្កើតក្នុង 0001។

### ពិនិត្យថាបានត្រឹមត្រូវ

```sql
select count(*) from titles;          -- គួរបាន 14
select count(*) from episodes;        -- គួរបាន ~60
select tablename, rowsecurity from pg_tables
  where schemaname = 'public' and rowsecurity = false;
-- គួរបាន 0 ជួរ (គ្រប់តារាងមាន RLS)
```

---

## ៣. កំណត់ Google OAuth (ពិត)

### ៣.១ ក្នុង Google Cloud Console

1. ចូល https://console.cloud.google.com → បង្កើត project ថ្មី (ឧ. "CINEMA KH")
2. **APIs & Services → OAuth consent screen**
   - User type៖ **External**
   - App name៖ CINEMA KH, support email, developer email
   - Scopes៖ គ្រាន់តែ `email`, `profile`, `openid` (កុំស្នើសុំច្រើនជាងចាំបាច់)
   - បន្ថែម test users របស់អ្នក (ក្នុងរបៀប Testing)
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type៖ **Web application**
   - **Authorized redirect URIs** — បន្ថែមទាំងពីរ៖
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```
   - ចម្លង **Client ID** និង **Client Secret**

> ⚠️ Redirect URI ត្រូវជា Supabase callback មិនមែន domain របស់អ្នកទេ។
> Supabase ជាអ្នកទទួល Google បន្ទាប់មកបញ្ជូនមក `/auth/callback` របស់អ្នក។

### ៣.២ ក្នុង Supabase

**Authentication → Providers → Google → Enable**
បញ្ចូល Client ID និង Client Secret ហើយ Save។

**Authentication → URL Configuration**
- Site URL៖ `https://cinema-kh.com` (ឬ domain របស់អ្នក)
- Redirect URLs — បន្ថែម៖
  ```
  http://localhost:3000/auth/callback
  https://cinema-kh.com/auth/callback
  https://*.workers.dev/auth/callback
  ```

---

## ៤. កំណត់ `.env.local`

```bash
cp .env.example .env.local
```

បំពេញតម្លៃ ៤ ខាងក្រោម (យ៉ាងតិច)៖

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_STREAM_API_TOKEN=...
NEXT_PUBLIC_ADS_ENABLED=false
```

ពិនិត្យថាត្រឹមត្រូវ៖

```bash
node --experimental-strip-types scripts/check-config.ts
```

បើឃើញ `✗` ត្រូវបំពេញបន្ថែម។

---

## ៥. កំណត់អ្នកគ្រប់គ្រងដំបូង

**មិនមានវិធីធ្វើជា admin តាមគេហទំព័រទេ** — នេះជាការការពារដោយចេតនា។

```bash
# ១. ចូលគេហទំព័រដោយ Google ម្តង ដើម្បីបង្កើត account row
npm run dev
# → ចូល http://localhost:3000/login ដោយ Google

# ២. ផ្តល់សិទ្ធិ admin
SUPABASE_URL=https://xxxxx.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=eyJ... \
node --experimental-strip-types scripts/bootstrap-admin.ts you@example.com
```

ឥឡូវ `/admin` នឹងបើកសម្រាប់អ្នក។

> 🔒 Script នេះត្រូវការ service-role key ហើយរត់តែពីកុំព្យូទ័ររបស់អ្នក។
> កុំដាក់ key នេះក្នុង Cloudflare variable ប្រភេទ `NEXT_PUBLIC_`។

---

## ៦. ភ្ជាប់វីដេអូពិត (Cloudflare Stream)

### ៦.១ បង្កើត API token

**Cloudflare Dashboard → My Profile → API Tokens → Create Token**
- Permissions៖ **Account → Stream → Edit**
- Account Resources៖ ជ្រើស account របស់អ្នក
- ចម្លង token → `CLOUDFLARE_STREAM_API_TOKEN`
- Account ID (ពី URL dashboard) → `CLOUDFLARE_ACCOUNT_ID`

### ៦.២ Upload វីដេអូ

```bash
# បាន video UID ត្រឡប់មកវិញ
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/stream" \
  -H "Authorization: Bearer $CLOUDFLARE_STREAM_API_TOKEN" \
  -F "file=@my-episode.mp4" \
  -F "requireSignedURLs=true"
```

### ៦.៣ ភ្ជាប់ទៅភាគ

**វិធី A — តាម Admin UI (ងាយបំផុត)**

`/admin/episodes` → បន្ថែមភាគ → ជ្រើស **Cloudflare Stream** → បញ្ចូល Video UID → រក្សាទុក

**វិធី B — តាម SQL**

```sql
insert into video_assets (episode_id, provider, provider_asset_id, label, is_primary)
values ('<episode-uuid>', 'cloudflare_stream', '<video-uid>', 'main', true)
on conflict (episode_id, label) do update
  set provider_asset_id = excluded.provider_asset_id;
```

### ៦.៤ Signed playback tokens (ណែនាំខ្លាំង)

1. **Stream → Settings → Signed URLs** → បង្កើត signing key
2. បន្ថែមទៅ env៖
   ```env
   CLOUDFLARE_STREAM_SIGNING_KEY=<key>
   CLOUDFLARE_STREAM_SIGNING_KEY_ID=<id>
   CLOUDFLARE_STREAM_CUSTOMER_CODE=<customer code>
   ```
3. Upload ជាមួយ `requireSignedURLs=true`

ឥឡូវ `/api/playback` នឹងបង្កើត token ខ្លី (១ ម៉ោង) ដែលភ្ជាប់នឹង user id។
Token មិនអាចចែករំលែក ឬ hot-link បានទេ។

---

## ៧. សាកល្បងគ្រប់យ៉ាង

```bash
npm run dev
```

| សាកល្បង | អ្វីដែលគួរកើតឡើង |
|---|---|
| បើក `/` | ឃើញរឿងពី database (មិនមែនឯកសារ) |
| ចុចរឿង → មើលឥឡូវ ពេលមិនបាន login | ឃើញ "ចូលដើម្បីមើល" |
| ចូលដោយ Google | ត្រឡប់មក `/auth/callback` → ចូលបាន |
| ចាក់វីដេអូ | HLS ដំណើរការ, progress រក្សាទុក |
| បិទ tab ហើយបើកវិញ | "មើលបន្ត" បង្ហាញកន្លែងដែលឈប់ |
| បន្ថែមប្រវត្តិរូបទី២ | Watchlist ដាច់ដោយឡែក |
| បើក `/admin` ជាអ្នកធម្មតា | ត្រូវបញ្ជូនទៅ `/` |
| បើក `/admin` ជា admin | ឃើញលេខពិតពី DB |

### សាកល្បងសុវត្ថិភាព (សំខាន់)

```bash
# ១. ព្យាយាមទាញ token ដោយគ្មាន session → គួរបាន 401
curl -X POST http://localhost:3000/api/playback \
  -H 'content-type: application/json' \
  -d '{"episodeId":"<some-uuid>"}'

# ២. ព្យាយាមអាន rights_note ជាសាធារណៈ → គួរបរាជ័យ (column មិនត្រូវបាន grant)
curl "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/titles?select=rights_note" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY"

# ៣. ព្យាយាមអាន watch_progress អ្នកដទៃ → គួរបាន []
curl "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/watch_progress" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY"
```

ទាំង ៣ ត្រូវតែ **បរាជ័យ**។ បើមិនដូច្នេះ សូមពិនិត្យថា `0002_rls.sql` រត់រួចហើយ។

---

## ៨. Deploy ទៅ Cloudflare

មើល `docs/DEPLOY_CLOUDFLARE.md` សម្រាប់ព័ត៌មានលម្អិត។ សង្ខេប៖

```bash
# បន្ថែម secrets ទៅ Worker (មិនមែន NEXT_PUBLIC_)
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put CLOUDFLARE_STREAM_API_TOKEN
npx wrangler secret put CLOUDFLARE_STREAM_SIGNING_KEY

# បន្ថែម variables ធម្មតា ក្នុង wrangler.jsonc ឬ Dashboard
# NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SITE_URL

npm run cf:deploy
```

បន្ទាប់មកបន្ថែម domain ទៅ **Supabase → Redirect URLs** និង
**Google Cloud → Authorized redirect URIs**។

---

## ៩. បើមានបញ្ហា

| បញ្ហា | មូលហេតុ / ដំណោះស្រាយ |
|---|---|
| `Missing NEXT_PUBLIC_SUPABASE_URL` | មិនទាន់មាន `.env.local` ឬឈ្មោះខុស |
| ចុច login ហើយត្រឡប់មកវិញដដែល | Redirect URI មិនត្រូវក្នុង Google Console |
| `redirect_uri_mismatch` (Google) | ត្រូវបន្ថែម `https://<ref>.supabase.co/auth/v1/callback` |
| ចាក់វីដេអូ → 503 | មិនទាន់កំណត់ `CLOUDFLARE_ACCOUNT_ID` / API token |
| ចាក់វីដេអូ → 403 NOT_RELEASED | `release_at` នៅអនាគត — កែក្នុង `/admin/episodes` |
| `/admin` → ត្រឡប់ទៅ `/` | អ្នកមិនទាន់មាន role — រត់ `bootstrap-admin.ts` |
| ទំព័រទទេ គ្មានរឿង | migrations មិនទាន់រត់ — មើលជំហាន ២ |
| `profile limit reached` | អតិបរមា ៥ ប្រវត្តិរូប (trigger ក្នុង DB) |

---

## ១០. អ្វីដែលនៅសល់មុនផ្សាយជាសាធារណៈ

- [ ] **មាតិកាពិត** — ជំនួសរឿងប្រឌិតទាំង ១៤ ដោយមាតិកាដែលមានសិទ្ធិ
- [ ] **វីដេអូពិត** — ជំនួស sample HLS ដោយ Cloudflare Stream
- [ ] **គោលការណ៍ភាពឯកជន / លក្ខខណ្ឌ** — ត្រូវការការពិនិត្យផ្នែកច្បាប់
- [ ] **អ៊ីមែលទំនាក់ទំនង** — ត្រូវការសម្រាប់ AdSense review
- [ ] **ការផ្សាយពាណិជ្ជកម្ម** — ដាក់ពាក្យបន្ទាប់ពីមាតិកាគ្រប់គ្រាន់
- [ ] **Backup** — បើក PITR ក្នុង Supabase ហើយសាកល្បង restore
- [ ] **Monitoring** — `wrangler tail` និង Supabase logs

សូមមើល `docs/SECURITY.md` សម្រាប់បញ្ជីពេញលេញ។
