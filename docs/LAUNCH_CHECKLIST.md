# បញ្ជីត្រួតពិនិត្យមុនការចេញផ្សាយ (Launch Checklist)

ឯកសារនេះជាផែនការចេញផ្សាយជាសាធារណៈ (production launch) របស់ **CINEMA KH**។
ធ្វើតាមលំដាប់ពីលើចុះក្រោម។ មិនត្រូវរំលងផ្នែក **ក** ឡើយ។

> **ស្ថានភាពបច្ចុប្បន្ន៖ មិនទាន់ត្រៀមរួចរាល់ទេ។**
> ពិនិត្យដោយស្វ័យប្រវត្តិដោយ `npm run check:launch` — បញ្ជីខាងក្រោមពន្យល់ពីរបៀបបិទចន្លោះនីមួយៗ។

---

## ក. ឧបសគ្គចាំបាច់ (Blockers) — ត្រូវបិទមុនផ្សាយ

ឧបសគ្គទាំងនេះជាបញ្ហាច្បាប់ និងសិទ្ធិ មិនមែនបញ្ហាបច្ចេកទេសទេ។
បើមិនបិទ អ្នកអាចប្រឈមនឹងការបិទគេហទំព័រ ឬបញ្ហាច្បាប់។

### ក.១ — ជំនួសមាតិកាគំរូទាំងអស់

បញ្ជីឈ្មោះក្នុង `supabase/migrations/0003_seed.sql` ជា **រឿងប្រឌិត** ១៤ ចំណងជើង
ដែលបង្កើតឡើងសម្រាប់ការសាកល្បងប៉ុណ្ណោះ។ មិនត្រូវផ្សាយជាសាធារណៈឡើយ។

```
□ លុបចោល ឬបិទ (unpublish) ចំណងជើងគំរូទាំង ១៤
□ បញ្ចូលតែចំណងជើងដែលអ្នកមានសិទ្ធិផ្សាយពិតប្រាកដ
□ កត់ត្រាឯកសារសិទ្ធិ (rights_note) សម្រាប់រាល់ចំណងជើង
```

### ក.២ — ជំនួសវីដេអូគំរូ

គ្រប់ភាគបច្ចុប្បន្នចង្អុលទៅ `test-streams.mux.dev` — ជាស្ទ្រីមរបស់ភាគីទីបី។

```
□ Upload វីដេអូពិតទៅ Cloudflare Stream
□ កត់ត្រា video UID ក្នុងតារាង video_assets
□ លុបជួរដែលនៅចង្អុល test-streams.mux.dev
□ ចាក់សាកល្បងរាល់ភាគម្តងទៀត
```

### ក.៣ — ត្រួតពិនិត្យផ្នែកច្បាប់

```
□ ឲ្យមេធាវី / អ្នកជំនាញច្បាប់ពិនិត្យ /privacy និង /terms
□ បំពេញអ៊ីមែលទំនាក់ទំនងពិត (បច្ចុប្បន្ននៅទទេ)
□ បំពេញឈ្មោះក្រុមហ៊ុន/ម្ចាស់គេហទំព័រ និងអាសយដ្ឋាន
□ លុបបដិសេធ "ឯកសារគំរូ" ចេញពីទំព័រទាំងពីរ
```

### ក.៤ — សំណួរអំពីភាពឯកជន (សម្រាប់កុមារ)

ប្រសិនបើទស្សនិកជនរួមមានកុមារ ត្រូវមានការយល់ព្រមពីឪពុកម្តាយ។

```
□ ធ្វើឲ្យលំហូរ PIN សម្រាប់ឪពុកម្តាយដំណើរការពិត (ឥឡូវមានតែការកំណត់កម្រិតអាយុ)
□ សរសេរនៅក្នុង /privacy ថាទិន្នន័យកុមារត្រូវបានដោះស្រាយយ៉ាងដូចម្តេច
```

---

## ខ. សុវត្ថិភាព (Security)

```
□ NEXT_PUBLIC_SITE_URL = ដែនពិត https://...
□ SUPABASE_SERVICE_ROLE_KEY ជា Worker secret (មិនមែន NEXT_PUBLIC_)
□ CLOUDFLARE_STREAM_SIGNING_KEY ជា Worker secret
□ ដំណើរការ npm run check:config ដោយគ្មានកំហុស
□ ចូល /admin ដោយគណនីធម្មតា → ត្រូវបដិសេធ
□ ហៅ POST /api/playback ដោយគ្មាន session → 401
□ ពិនិត្យថា RLS បើកលើតារាងទាំង ២៤ (`npm run check:launch` ផ្ទៀងផ្ទាត់)
□ បង្វិល (rotate) key ទាំងអស់បើធ្លាប់ចែករំលែកក្នុងជំនួយ
```

និយាយលម្អិត៖ `docs/SECURITY.md`

---

## គ. ការត្រួតពិនិត្យបច្ចេកទេស (Technical)

```
□ npm run typecheck — គ្មានកំហុស
□ npm run build — build ជោគជ័យ (worker.js + verification ឆ្លង)
□ npm run check:launch — គ្មាន blocker
□ /api/health → 200 និង "database":"ok"
□ ទំព័រ 404 បង្ហាញជាភាសាខ្មែរ
□ Security headers ត្រូវបានបញ្ជូន (CSP, HSTS, nosniff)
□ manifest.webmanifest ដំណើរការ → អាចដំឡើងជា app
□ og-default.png បង្ហាញត្រឹមត្រូវពេលចែករំលែកលើ Facebook/Telegram
□ ចាក់វីដេអូលើទូរសព្ទពិត (iOS + Android)
□ សាកល្បងលើអ៊ីនធឺណិតយឺត (3G throttling)
```

---

## ឃ. ការចេញផ្សាយ (Deploy)

```
□ ធ្វើតាម docs/DEPLOY_CLOUDFLARE.md
□ npx wrangler secret put សម្រាប់ secret ទាំងអស់
□ npx wrangler deploy (ឬ npm run cf:deploy)
□ ពិនិត្យ https://<ដែន>/api/health → status ok
□ កំណត់ដែនផ្ទាល់ខ្លួន (custom domain) + SSL
□ បន្ថែម Google OAuth redirect URI សម្រាប់ដែនពិត
□ ពិនិត្យចូលដោយ Google លើដែនពិត
```

---

## ង. ក្រោយការចេញផ្សាយ (Post-launch, ២៤ ម៉ោងដំបូង)

```
□ តាមដាន /api/health រៀងរាល់ ៥ នាទី (UptimeRobot ឬស្រដៀង)
□ ត្រួតពិនិត្យ log កំហុសក្នុង Cloudflare dashboard
□ សាកល្បងស្នើសុំរឿង → ឃើញក្នុង /admin/requests
□ សាកល្បង my-list, continue-watching, rating
□ ពិនិត្យល្បឿន (Lighthouse mobile ≥ 80)
□ ត្រៀមផែនការបម្រុងប្រសិនបើ database ធ្លាក់
```

---

## ច. ការផ្សាយពាណិជ្ជកម្ម (Ads) — ដាច់ដោយឡែក

**មិនត្រូវបើកមុនការអនុម័តពីអ្នកផ្តល់សេវាឡើយ។**

```
□ ដាក់ពាក្យសុំ AdSense ជាមួយដែនពិត
□ រង់ចាំការអនុម័ត (អាចយូរ ១–៤ សប្តាហ៍)
□ បន្ទាប់ពីអនុម័ត៖ បន្ថែមដែន AdSense ក្នុង CSP (next.config.ts)
□ បន្ថែមបន្ទាត់ seller ពិតក្នុង public/ads.txt
□ កំណត់ NEXT_PUBLIC_ADS_ENABLED=true
□ បើក ad_placements ក្នុង database
```

លម្អិត៖ `docs/ADS_INTEGRATION.md`

---

## ឆ. ការដោះស្រាយបញ្ហា

| រោគសញ្ញា | មូលហេតុ | ដំណោះស្រាយ |
| --- | --- | --- |
| `/api/health` → 503 | database មិនភ្ជាប់ | ពិនិត្យ `NEXT_PUBLIC_SUPABASE_URL` និងស្ថានភាព project |
| Build បរាជ័យ "Maximum call stack" | `buildCommand` ខ្វះ | ពិនិត្យ `open-next.config.ts` |
| ចូល Google មិនបាន | redirect URI ខុស | បន្ថែម `https://<ដែន>/auth/callback` ក្នុង Google Console |
| រូបភាពមិនបង្ហាញ | CSP បិទដែន | បន្ថែមដែនក្នុង `img-src` |
| វីដេអូមិនចាក់ | token ផុតកំណត់ / signing key ខុស | ពិនិត្យ secret និង `PLAYBACK_TOKEN_TTL_SECONDS` |

---

## ជ. និយមន័យ "រួចរាល់"

គេហទំព័រត្រូវបានចាត់ទុកថា **រួចរាល់សម្រាប់ការផ្សាយ** លុះត្រាតែ៖

1. `npm run check:launch` បង្ហាញ **READY TO PUBLISH** ដោយគ្មាន blocker។
2. ផ្នែក **ក** ទាំងអស់ត្រូវបានបិទ និងមានឯកសារបញ្ជាក់។
3. មានមនុស្សម្នាក់ទទួលខុសត្រូវតាមដាន `/api/health` រៀងរាល់ថ្ងៃ។
