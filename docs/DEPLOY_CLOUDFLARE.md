# ដាក់ផ្សាយ CINEMA KH ទៅ Cloudflare (ដោយដៃ — គ្មាន GitHub Actions)

ឯកសារនេះពន្យល់ជាភាសាខ្មែរ អំពីរបៀប build និង deploy គេហទំព័រនេះទៅ **Cloudflare Workers**
ដោយប្រើ **`wrangler` ពីកុំព្យូទ័ររបស់អ្នក**។

> **សេចក្តីសម្រេចចិត្ត៖** គម្រោងនេះ **មិនប្រើ GitHub Actions** ទេ។
> គ្មានស្គ្រីប CI/CD ក្នុង `.github/workflows` ឡើយ — អ្នកគឺជាអ្នកបញ្ជា deploy ដោយខ្លួនឯង។

---

## ១. ហេតុអ្វីប្រើ Cloudflare Workers (+ OpenNext)

| ជម្រើស | ស្ថានភាព |
|---|---|
| Next.js + `@opennextjs/cloudflare` លើ Workers | ✅ បានប្រើក្នុងគម្រោងនេះ |
| `@cloudflare/next-on-pages` (Pages) | ❌ ចាស់ / មិនណែនាំសម្រាប់ Next.js 16 |
| GitHub Actions | ❌ មិនប្រើ (តាមសំណើរបស់អ្នក) |

OpenNext យក output របស់ `next build` មកបង្កើតជា Worker មួយ (`worker.js`) បូកជាមួយ
static assets (`/assets`)។ អ្នកគ្រាន់តែរត់ command ពីរ ប៉ុណ្ណោះ។

---

## ២. តម្រូវការមុនចាប់ផ្តើម

1. **Node.js 20+** (គម្រោងនេះសាកល្បងលើ Node 22)
2. **គណនី Cloudflare** — https://dash.cloudflare.com/sign-up
3. **ឈ្មោះក្រុមហ៊ុន/គម្រោង** ក្នុង `wrangler.jsonc` (បច្ចុប្បន្ន `"name": "cinema-kh"`)
4. (ស្រេចចិត្ត) **ដែន** ដែលបានបន្ថែមទៅ Cloudflare

---

## ៣. ដំណើរការក្នុងម៉ាស៊ីនរបស់អ្នក (local)

```bash
git clone <repo-url> && cd Drama---Movie
npm install
cp .env.example .env.local     # បំពេញ Supabase keys (មើល SETUP_REAL_BACKEND.md)

# មើលគេហទំព័រនៅ http://localhost:3000
npm run dev

# ពិនិត្យប្រភេទ (type checking)
npm run typecheck

# build ធម្មតាសម្រាប់ Next.js
npm run build
```

---

## ៤. ចូល Cloudflare ពី terminal

```bash
npx wrangler login
```

វានឹងបើកកម្មវិធីរុករកឲ្យអ្នកចូល Cloudflare។ បន្ទាប់មកពិនិត្យថាត្រូវបានចូល៖

```bash
npx wrangler whoami
```

> 🔐 **កុំដាក់ API token ក្នុង code ឬ chat។** បើអ្នកចង់ប្រើ token សម្រាប់ CI នៅពេលក្រោយ
> សូមប្រើ environment variable `CLOUDFLARE_API_TOKEN` នៅក្នុងម៉ាស៊ីនរបស់អ្នក ឬ secret manager។

---

## ៥. សាកល្បង build សម្រាប់ Cloudflare នៅ local

```bash
# build + ដំណើរការ Worker នៅ local (សាកល្បងមុន deploy)
npm run cf:preview
```

បើឃើញ URL ដូច `http://localhost:8787` ហើយទំព័រដំណើរការ នោះបានល្អ។

Command ទាំងនេះមាននៅក្នុង `package.json`៖

| Command | អ្វីដែលវាធ្វើ |
|---|---|
| `npm run cf:build` | build Next.js + បង្កើត bundle នៅ `.open-next/` |
| `npm run cf:preview` | build + រត់ Worker នៅ local |
| `npm run cf:deploy` | build + ដាក់ផ្សាយទៅ Cloudflare (**ជំហានសំខាន់**) |
| `npm run cf:uploads` | upload static assets ទៅ Cloudflare (បើត្រូវការ) |

---

## ៦. Deploy ពិតប្រាកដ (ដំណើរការចម្បង)

```bash
npm run cf:deploy
```

វានឹងធ្វើដូចខាងក្រោម៖

1. `next build` — compile គេហទំព័រ
2. `opennextjs-cloudflare build` — បង្កើត `.open-next/worker.js` + assets
3. `wrangler deploy` — បញ្ជូនទៅ Cloudflare Workers

នៅចុងបញ្ចប់ អ្នកនឹងបាន URL ដូច៖

```
https://cinema-kh.<your-subdomain>.workers.dev
```

### បើមាន error ពេល deploy

| Error | ដំណោះស្រាយ |
|---|---|
| `Not logged in` | រត់ `npx wrangler login` ម្តងទៀត |
| `wrangler not found` | រត់ `npm install` (wrangler ជា devDependency) |
| `compatibility_date` error | កែ `wrangler.jsonc` ឲ្យត្រូវនឹងកាលបរិច្ឆេទបច្ចុប្បន្ន (ឬមុននោះ) |
| Bundle ធំពេក | ពិនិត្យ `node_modules` ដែលមិនចាំបាច់ ឬប្រើ dynamic import |

---

## ៦.១ បើប្រើ Cloudflare Workers Builds (build ក្នុង dashboard)

បើអ្នកភ្ជាប់ GitHub repo ទៅ **Workers Builds** ក្នុង Cloudflare dashboard
ហើយឃើញ error នេះ៖

```
ERROR Could not find compiled Open Next config, did you run the build command?
Failed: error occurred while running deploy command
```

**មូលហេតុ៖** `npm run build` ពីមុនជា `opennextjs-cloudflare build` ដែលខាងក្នុង
វាហៅ `npm run build` ម្តងទៀត → recursion គ្មានទីបញ្ចប់ → `.open-next/` មិនត្រូវបានបង្កើត
→ deploy រកមិនឃើញ worker។

**បានជួសជុលរួចហើយ** ក្នុង `open-next.config.ts`៖

```ts
export default {
  ...defineCloudflareConfig(),
  buildCommand: "next build",   // ⚠️ ត្រូវតែនៅ top-level
};
```

> ចំណាំ៖ ការដាក់ `buildCommand` ខាងក្នុង `defineCloudflareConfig({...})`
> **មិនដំណើរការទេ** — function នោះយកតែ field របស់ adapter ហើយបោះ field ផ្សេងចោល។

**ការកំណត់ក្នុង dashboard (Workers Builds)៖**

| ការកំណត់ | តម្លៃ |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` (ឬទទេ) |
| Node version | 20 ឬ 22 (`NODE_VERSION=22`) |

បើអ្នកចង់ឲ្យ build command ធ្វើអ្វីៗទាំងអស់ សូមប្រើ៖

| Build command | Deploy command |
|---|---|
| *(ទទេ)* | *(ទទេ)* |
| — ហើយដាក់ `npm run cf:deploy` ជា **Deploy command** តែម្តង | |

**ពិនិត្យមុន deploy (ណែនាំ)៖**

```bash
npm run verify:build
```

បើឃើញ `Build verification passed` នោះប្រាកដថា deploy នឹងដំណើរការ។

---

## ៧. ភ្ជាប់ដែនផ្ទាល់ខ្លួន (Custom domain)

**វិធីទី ១ — តាម Dashboard (ងាយស្រួល)**

1. ចូល https://dash.cloudflare.com → **Workers & Pages**
2. ជ្រើសរើស Worker ឈ្មោះ `cinema-kh`
3. **Settings** → **Domains & Routes** → **Add custom domain**
4. បញ្ចូលដូច `cinema-kh.com` ឬ `www.cinema-kh.com`
5. ធ្វើតាមការណែនាំ DNS (បើដែននៅ Cloudflare វានឹងបង្កើត record ដោយស្វ័យប្រវត្តិ)
6. HTTPS ត្រូវបានបើកដោយស្វ័យប្រវត្តិ

**វិធីទី ២ — តាម `wrangler.jsonc`**

```jsonc
{
  "routes": [
    { "pattern": "cinema-kh.com", "custom_domain": true },
    { "pattern": "www.cinema-kh.com", "custom_domain": true }
  ]
}
```

បន្ទាប់មក `npm run cf:deploy` ម្តងទៀត។

---

## ៨. Environment variables (ចាំបាច់ឥឡូវ)

គម្រោងនេះ**ត្រូវការ** Supabase ដើម្បីដំណើរការ។ មើល `docs/SETUP_REAL_BACKEND.md`
សម្រាប់ការណែនាំពេញលេញ។

**បន្ថែម secrets ដោយ command (មិនដាក់ក្នុង `wrangler.jsonc`)៖**

```bash
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put CLOUDFLARE_STREAM_API_TOKEN
npx wrangler secret put CLOUDFLARE_STREAM_SIGNING_KEY
```

**Variables ធម្មតា** អាចដាក់ក្នុង Dashboard ឬ `wrangler.jsonc`៖

**Workers & Pages → cinema-kh → Settings → Variables and Secrets → Add**

| ឈ្មោះ | ប្រភេទ | កំណត់សម្គាល់ |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Variable | `https://cinema-kh.com` (សម្រាប់ sitemap + OG) |
| `NEXT_PUBLIC_ADS_ENABLED` | Variable | `false` រហូតដល់ AdSense អនុម័ត |
| `NEXT_PUBLIC_SUPABASE_URL` | Variable | ពី Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Variable | anon key (public-safe, RLS ការពារ) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | ⚠️ មិនត្រូវចេញទៅ browser ឡើយ |
| `CLOUDFLARE_ACCOUNT_ID` | Variable | សម្រាប់ Cloudflare Stream |
| `CLOUDFLARE_STREAM_API_TOKEN` | **Secret** | សម្រាប់បង្កើត playback token |
| `CLOUDFLARE_STREAM_SIGNING_KEY` | **Secret** | signed URLs (ណែនាំ) |

> ⚠️ **`NEXT_PUBLIC_*` ត្រូវបានបង្ហាញទៅ browser។** កុំដាស់ service-role key ឬ secret ណាមួយ
> ក្នុង variable ប្រភេទ `NEXT_PUBLIC_`។

សម្រាប់ local development សូមបង្កើត `.env.local` (វាត្រូវបាន `.gitignore` រួចហើយ)។

---

## ៩. ស្ថានភាពបច្ចុប្បន្ន (សូមអានមុនផ្សព្វផ្សាយ)

គេហទំព័រនេះជា **prototype/គំរូរចនា** ដែលដំណើរការបានពេញលេញ ប៉ុន្តែ៖

| មុខងារ | ស្ថានភាព |
|---|---|
| UI / ទំព័រ / responsive | ✅ រួចរាល់ |
| ទិន្នន័យមាតិកា | ✅ ក្នុង PostgreSQL (seed ១៤ រឿងប្រឌិតសម្រាប់សាកល្បង) |
| ការចូល Google | ✅ OAuth ពិត + httpOnly cookies |
| វីដេអូពិត | ✅ HLS player + server-side token (ត្រូវកំណត់ Cloudflare Stream) |
| Database (Supabase) | ✅ schema + RLS + migrations |
| ការផ្សាយពាណិជ្ជកម្ម | ❌ មិនទាន់បើក (រង់ចាំការអនុម័ត AdSense) |
| Admin | ✅ ការពារដោយ role + RLS + audit log |

👉 **មុនពេលបង្ហាញជាសាធារណៈ៖** អាន `docs/SECURITY.md` និងដាក់ការការពារ admin
បើមិនដូច្នេះ `/admin` នឹងអាចចូលបានដោយនរណាម្នាក់។

---

## ១០. Rollback និងការត្រួតពិនិត្យ

```bash
# មើល deployment ទាំងអស់។
npx wrangler deployments list

# ត្រឡប់ទៅ version មុន
npx wrangler rollback

# មើល log ពេលមានបញ្ហា (បើ observability បើក)
npx wrangler tail
```

`observability` ត្រូវបានបើកក្នុង `wrangler.jsonc` ដើម្បីមើល log នៅ Dashboard។

---

## ១១. ជំហានបន្ទាប់ដែលណែនាំ

1. Deploy ជំនាញនេះទៅ `workers.dev` ដើម្បីពិនិត្យលើទូរស័ព្ទពិត
2. បង្កើត Supabase project → ភ្ជាប់ database ពិត (ជំនួស `lib/catalogue.ts`)
3. កំណត់ Google OAuth → ជំនួសការចូលសាកល្បង
4. ជ្រើសរើស Cloudflare Stream → ភ្ជាប់វីដេអូដែលមានសិទ្ធិ
5. ដាក់ការការពារ admin (server-side) មុនបើកជាសាធារណៈ
6. ដាក់ពាក្យ AdSense បន្ទាប់ពីគេហទំព័រមានខ្លឹមសារគ្រប់គ្រាន់
