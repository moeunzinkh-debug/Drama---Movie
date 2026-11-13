# CINEMA KH

គេហទំព័រមើលភាពយន្ត និងរឿងភាគសម្រាប់ទស្សនិកជនខ្មែរ — Next.js 16 + Tailwind CSS 4 ដាក់ផ្សាយលើ **Cloudflare Workers**។

> ⚠️ **ស្ថានភាព៖ គំរូអភិវឌ្ឍន៍ (prototype)។**
មាតិកាទាំងអស់ជារឿងប្រឌិតសម្រាប់ការសាកល្បង។
> ការចូល Google ជាការសាកល្បងក្នុង localStorage, វីដេអូមិនទាន់ភ្ជាប់, និង **មិនទាន់មានពាណិជ្ជកម្ម**។
> សូមអាន [docs/SECURITY.md](docs/SECURITY.md) **មុន** ដាក់ផ្សាយជាសាធារណៈ។

## ចាប់ផ្តើមរហ័ស

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build ធម្មតា
npm run typecheck  # ពិនិត្យ TypeScript
```

## Deploy ទៅ Cloudflare (ដោយដៃ — គ្មាន GitHub Actions)

```bash
npx wrangler login
npm run cf:preview   # សាកល្បង Worker នៅ local
npm run cf:deploy    # ដាក់ផ្សាយពិត
```

👉 ការណែនាំពេញលេញជាភាសាខ្មែរ៖ **[docs/DEPLOY_CLOUDFLARE.md](docs/DEPLOY_CLOUDFLARE.md)**

| Command | ការងារ |
|---|---|
| `npm run cf:build` | build Next.js + bundle សម្រាប់ Cloudflare |
| `npm run cf:preview` | build + រត់នៅ local (port 8787) |
| `npm run cf:deploy` | build + deploy ទៅ Cloudflare Workers |
| `npm run cf:uploads` | upload static assets |

គម្រោងនេះ **មិនប្រើ** `.github/workflows` ទេ — deploy ធ្វើពីកុំព្យូទ័ររបស់អ្នក។

## រចនាសម្ព័ន្ធ

```
app/
  page.tsx                 ទំព័រដើម (hero, top10, ប្រភេទ, មើលបន្ត)
  browse/                  រកមើល + តម្រង (ប្រភេទ/ប្រទេស/ឆ្នាំ/តម្រៀប)
  search/                  ស្វែងរក
  title/[slug]/            ទំព័រព័ត៌មានលម្អិត + បញ្ជីភាគ + ពិន្ទុ + បញ្ជីរក្សាទុក
  watch/[slug]/            ទំព័រចាក់វីដេអូ (gate + player + auto-next)
  calendar/                កាលវិភាគភាគថ្មី
  request/                 ស្នើសុំរឿង
  my-list/                 បញ្ជីរក្សាទុក + ប្រវត្តិ + ប្រវត្តិរូប
  admin/                   ផ្ទាំងគ្រប់គ្រង (គំរូអានបានតែប៉ុណ្ណោះ)
  privacy/ terms/ about/   ទំព័រច្បាប់ និងព័ត៌មាន
  api/poster/[slug]/       បង្កើតផ្ទាំងរូបភាព SVG (គ្មានរូបភាពខាងក្រៅ)
components/                UI components
lib/                       catalogue (ទិន្នន័យគំរូ) + queries + types
public/ads.txt             ads.txt (ទទេដោយចេតនា — រង់ចាំការអនុម័ត)
docs/                      ឯកសារ deploy និងសុវត្ថិភាព
```

## លក្ខណៈពិសេស

- រចនាបែប **dark cinematic** ត្រូវនឹងទូរស័ព្ទ និងកុំព្យូទ័រ
- ភាសាខ្មែរជាភាសាចម្បង (`lang="km"`)
- ចូលមើលបានដោយសេរី, ចាក់វីដេអូត្រូវការចូល
- មើលបន្ត, បញ្ជីរក្សាទុក, ពិន្ទុ, ប្រវត្តិរូបច្រើន (ក្នុងមួយគណនី)
- Auto next episode ជាមួយ countdown និង Cancel
- ចន្លោះពាណិជ្ជកម្មដែលគោរពគោលការណ៍ (`components/ad-slot.tsx`) — មិនទាន់បើក
- Accessibility: skip link, focus ring, `aria-*`, `prefers-reduced-motion`

## អ្វីដែលមិនទាន់មាន (មុនដាក់ផ្សាយ)

- Supabase (database + RLS) និង Google OAuth ពិតប្រាកដ
- វីដេអូពិត (គម្រោងប្រើ Cloudflare Stream)
- ការការពារ `/admin` នៅខាង server
- ការអនុម័ត AdSense + ads.txt ពិតប្រាកដ
- ការពិនិត្យផ្នែកច្បាប់ (គោលការណ៍ភាពឯកជន / លក្ខខណ្ឌ)
