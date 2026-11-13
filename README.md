# CINEMA KH

គេហទំព័រមើលភាពយន្ត និងរឿងភាគសម្រាប់ទស្សនិកជនខ្មែរ — Next.js 16 + Tailwind CSS 4 +
**Supabase** (Postgres + Auth) + **Cloudflare Workers**។

> **ស្ថានភាព៖ backend ពិតដំណើរការ។** ការចូល Google, database, RLS, ការការពារ admin,
> និង player វីដេអូ សុទ្ធតែជាកូដផលិតកម្ម។
> **មាតិកានៅជារឿងប្រឌិតសម្រាប់សាកល្បង** និង **មិនទាន់មានពាណិជ្ជកម្ម** —
> សូមអាន [docs/SECURITY.md](docs/SECURITY.md) មុនដាក់ផ្សាយជាសាធារណៈ។

## ចាប់ផ្តើម

```bash
npm install
cp .env.example .env.local     # បំពេញ Supabase keys
npm run check:config           # ពិនិត្យថា env ត្រឹមត្រូវ
npm run dev                    # http://localhost:3000
```

ត្រូវការ Supabase project ជាមុន៖ **👉 [docs/SETUP_REAL_BACKEND.md](docs/SETUP_REAL_BACKEND.md)**

```bash
# រត់ migrations (schema + RLS + seed)
supabase db push

# ផ្តល់សិទ្ធិ admin ដំបូង (បន្ទាប់ពីចូលដោយ Google ម្តង)
npm run admin:grant you@example.com
```

## Deploy ទៅ Cloudflare (ដោយដៃ — គ្មាន GitHub Actions)

```bash
npx wrangler login
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put CLOUDFLARE_STREAM_API_TOKEN
npm run cf:preview   # សាកល្បងនៅ local
npm run cf:deploy    # ដាក់ផ្សាយពិត
```

👉 **[docs/DEPLOY_CLOUDFLARE.md](docs/DEPLOY_CLOUDFLARE.md)** (ជាភាសាខ្មែរ)

| Command | ការងារ |
|---|---|
| `npm run dev` | dev server |
| `npm run typecheck` | ពិនិត្យ TypeScript |
| `npm run check:config` | ពិនិត្យ environment variables |
| `npm run seed:generate` | បង្កើត SQL seed ពី `lib/catalogue.ts` |
| `npm run admin:grant <email>` | ផ្តល់សិទ្ធិ admin |
| `npm run cf:deploy` | build + deploy ទៅ Cloudflare Workers |

## រចនាសម្ព័ន្ធ

```
app/
  page.tsx                  ទំព័រដើម (hero, top10, មើលបន្ត)
  browse/ search/           រកមើល + តម្រង
  title/[slug]/             ព័ត៌មានលម្អិត + ភាគ + ពិន្ទុ + បញ្ជី
  watch/[slug]/             player (gate + HLS + auto-next)
  calendar/ request/        កាលវិភាគ + ស្នើសុំរឿង
  my-list/                  បញ្ជី + ប្រវត្តិ + ប្រវត្តិរូប
  admin/                    គ្រប់គ្រង (មាតិកា / ភាគ / សំណើ / ពាណិជ្ជកម្ម)
  auth/callback/            Google OAuth callback
  api/playback/             ★ ការត្រួតពិនិត្យវីដេអូ + token
  api/poster/[slug]/        ផ្ទាំងរូបភាព SVG
actions/                    server actions (viewer / admin / requests / auth)
lib/
  supabase/{client,server,admin}.ts   Supabase clients (browser / RLS / service)
  auth.ts                   ★ session + role checks
  queries.ts                DB queries
  progress.ts               continue watching
supabase/migrations/
  0001_core_schema.sql      24 tables
  0002_rls.sql              ★ RLS policies + column grants
  0003_seed.sql             demo catalogue (generated)
middleware.ts               session refresh + /admin gate
docs/                       ឯកសារ setup, deploy, សុវត្ថិភាព
```

★ = ឯកសារសំខាន់ខាងសុវត្ថិភាព

## សុវត្ថិភាព (សង្ខេប)

- **RLS បើកលើគ្រប់តារាងទាំង ២៤** — default deny
- **`rights_note` / `source_note` មិនត្រូវបាន grant** ដល់ anon/authenticated → មិនអាចលេចធ្លាយ
- **`/api/playback`** ត្រួតពិនិត្យ session → suspension → published → release time → parent ceiling មុនបង្កើត token
- **Admin** ត្រួតពិនិត្យ ៤ ជាន់ — middleware → layout → action → RLS
- **Audit log** សម្រាប់រាល់សកម្មភាព admin
- **មិនអាចផ្សាយចំណងជើងដោយគ្មាន `rights_note`**

សាកល្បងខ្លួនឯង៖ [docs/SECURITY.md §2](docs/SECURITY.md)

## អ្វីដែលនៅសល់មុនផ្សាយ

1. ជំនួសរឿងប្រឌិត ១៤ ដោយមាតិកាដែលមានសិទ្ធិ
2. ជំនួស sample HLS ដោយ Cloudflare Stream assets ពិត
3. ការពិនិត្យផ្នែកច្បាប់លើ `/privacy` និង `/terms`
4. អ៊ីមែលទំនាក់ទំនងពិត (ត្រូវការសម្រាប់ AdSense)
5. Backup + monitoring + alerting
6. ដាក់ពាក្យ AdSense បន្ទាប់ពីមាតិកាគ្រប់គ្រាន់
