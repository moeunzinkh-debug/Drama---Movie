import type { Title, Episode, Season } from "./types";

/**
 * Seed rows are authored by slug, not by uuid — the database assigns ids on
 * insert. `SeedTitle` is the compile-time shape checked against the real Title
 * so drift between this file and lib/types.ts is caught by tsc.
 */
export type SeedTitle = Omit<Title, "id">;

/**
 * Sample catalogue.
 *
 * Every title below is fictional and exists purely so the interface can be
 * designed and tested. Posters are generated from each title's palette by
 * /api/poster/[slug] — no third-party artwork is bundled with this repo.
 * Nothing here is a real distributable film: replace this file with Supabase
 * queries once the rights-cleared catalogue exists (see docs/DEPLOY_CLOUDFLARE.md).
 */

const DAY = 86_400_000;
const BASE = Date.UTC(2026, 10, 13); // 2026-11-13

function eps(
  prefix: string,
  season: number,
  titles: [string, string][],
  startOffsetDays: number,
  duration = 45,
): Episode[] {
  return titles.map(([en, km], i) => ({
    id: `${prefix}-s${season}e${i + 1}`,
    season,
    number: i + 1,
    title: en,
    titleKm: km,
    durationMinutes: duration,
    releaseAt: new Date(BASE + (startOffsetDays + i * 7) * DAY).toISOString(),
  }));
}

function season(number: number, title: string, episodes: Episode[]): Season {
  return { number, title, episodes };
}

export const TITLES: SeedTitle[] = [
  {
    slug: "mekong-shadows",
    name: "Mekong Shadows",
    nameKm: "ស្រមោលទន្លេមេគង្គ",
    altTitle: "The River Murders",
    type: "drama",
    country: "Khmer",
    year: 2026,
    categories: ["Mystery", "Crime", "Thriller"],
    ageRating: "16+",
    tagline: "A detective returns to the river town she swore never to see again.",
    taglineKm: "អ្នកស៊ើបអង្កេតម្នាក់ត្រឡប់មកក្រុងមេគង្គដែលនាងបានស្បថមិនវិលត្រឡប់។",
    synopsis:
      "Detective Sreyna Chea left Kampong Chhnang at nineteen with nothing but a bus ticket. Fifteen years later a body is pulled from the Mekong wearing her brother's watch, and the case file the province buried comes back with her name on it.",
    synopsisKm:
      "អ្នកស៊ើបអង្កេត ស្រីណា ជា បានចាកចេញពីកំពង់ឆ្នាំងនៅអាយុ ១៩ ឆ្នាំ។ ដប់ប្រាំឆ្នាំក្រោយមក សាកសពមួយត្រូវបានគេស្រង់ចេញពីទន្លេមេគង្គ ដោយពាក់នាឡិការបស់បងប្រុសនាង។",
    cast: ["Sreyna Chea", "Vibol Nim", "Dara Sok"],
    subtitleLanguages: ["Khmer", "English"],
    featured: true,
    trendingRank: 1,
    popularity: 9810,
    addedAt: new Date(BASE - 12 * DAY).toISOString(),
    palette: ["#0b3d4a", "#f0a03c"],
    status: "published",
    rightsNote: "Original production — owner: CINEMA KH.",
    seasons: [
      season(1, "Season 1", eps("mekong-shadows", 1, [
        ["Low Water", "ទឹកស្រក"],
        ["The Watch", "នាឡិកា"],
        ["Ferry at Dawn", "សាឡាងព្រឹកព្រលឹម"],
        ["Everyone Knew", "អ្នកទាំងអស់បានដឹង"],
        ["Red Dust", "ធូលីក្រហម"],
        ["The File Room", "បន្ទប់ឯកសារ"],
        ["High Water", "ទឹកឡើង"],
        ["Homecoming", "ការត្រឡប់មកផ្ទះ"],
      ], -56)),
      season(2, "Season 2", eps("mekong-shadows", 2, [
        ["New Province", "ខេត្តថ្មី"],
        ["The Witness Who Left", "សាក្សីដែលចាកចេញ"],
        ["Dry Season", "រដូវប្រាំង"],
        ["Two Boats", "ទូកពីរ"],
        ["Nothing Personal", "គ្មានរឿងផ្ទាល់ខ្លួន"],
        ["The Last Ferry", "សាឡាងចុងក្រោយ"],
      ], 5)),
    ],
  },
  {
    slug: "golden-lotus-hotel",
    name: "Golden Lotus Hotel",
    nameKm: "សណ្ឋាគារផ្កាឈូកមាស",
    type: "drama",
    country: "Thai",
    year: 2025,
    categories: ["Drama", "Romance", "Mystery"],
    ageRating: "13+",
    tagline: "Six strangers check in. The hotel decides who checks out.",
    taglineKm: "ភ្ញៀវប្រាំមួយនាក់ចូលស្នាក់។ សណ្ឋាគារជាអ្នកសម្រេចថាអ្នកណានឹងចេញ។",
    synopsis:
      "A fading riverside hotel keeps a ledger of every guest since 1974. When a new manager finds the book, she recognises a name that should not exist — and a debt the building has been collecting for fifty years.",
    synopsisKm:
      "សណ្ឋាគារចាស់មួយរក្សាកំណត់ត្រាភ្ញៀវគ្រប់រូបតាំងពីឆ្នាំ ១៩៧៤។ នៅពេលអ្នកគ្រប់គ្រងថ្មីរកឃើញសៀវភៅនោះ នាងស្គាល់ឈ្មោះមួយដែលមិនគួរមាន។",
    cast: ["Naphat Sirichai", "Kanya Wong", "Mira Tan"],
    subtitleLanguages: ["Khmer", "English", "Thai"],
    featured: true,
    trendingRank: 3,
    popularity: 8720,
    addedAt: new Date(BASE - 40 * DAY).toISOString(),
    palette: ["#3a1230", "#e8b04a"],
    status: "published",
    rightsNote: "Licensed for streaming — sample record only.",
    seasons: [
      season(1, "Season 1", eps("golden-lotus-hotel", 1, [
        ["Check-In", "ចូលស្នាក់"],
        ["Room 214", "បន្ទប់ ២១៤"],
        ["Room Service", "សេវាបន្ទប់"],
        ["The Ledger", "សៀវភៅកត់ត្រា"],
        ["Blackout", "ដាច់ភ្លើង"],
        ["Check-Out", "ចេញ"],
      ], -120)),
    ],
  },
  {
    slug: "neon-phnom-penh",
    name: "Neon Phnom Penh",
    nameKm: "ភ្នំពេញពន្លឺនេអុង",
    type: "movie",
    country: "Khmer",
    year: 2026,
    categories: ["Action", "Crime", "Thriller"],
    ageRating: "18+",
    tagline: "A tuk-tuk driver, a stolen phone, and one very long night.",
    taglineKm: "អ្នកបើករថយន្តកង់បី ទូរស័ព្ទដែលត្រូវលួច និងយប់វែងមួយ។",
    synopsis:
      "Rithy drives nights to pay for his sister's tuition. When a passenger leaves a phone full of someone else's secrets on his seat, every fixer in the city wants it back before sunrise.",
    synopsisKm:
      "រិទ្ធីបើករថយន្តកង់បីពេលយប់ដើម្បីរកលុយឲ្យប្អូនស្រីរៀន។ នៅពេលអ្នកដំណើរម្នាក់ទុកទូរស័ព្ទពោរពេញដោយអាថ៌កំបាំងនៅលើកៅអី គ្រប់គ្នាក្នុងក្រុងចង់បានវាមកវិញ។",
    cast: ["Rithy Meas", "Sopheap Lim", "Kosal Yim"],
    subtitleLanguages: ["Khmer", "English"],
    featured: true,
    trendingRank: 2,
    popularity: 9130,
    addedAt: new Date(BASE - 21 * DAY).toISOString(),
    palette: ["#1a0b3d", "#2ef2d8"],
    status: "published",
    rightsNote: "Original production — owner: CINEMA KH.",
    seasons: [season(1, "Feature Film", eps("neon-phnom-penh", 1, [["Neon Phnom Penh", "ភ្នំពេញពន្លឺនេអុង"]], -21, 118))],
  },
  {
    slug: "the-quiet-harvest",
    name: "The Quiet Harvest",
    nameKm: "រដូវចម្រូតស្ងប់ស្ងាត់",
    type: "movie",
    country: "Khmer",
    year: 2024,
    categories: ["Drama", "Family", "Historical"],
    ageRating: "13+",
    tagline: "One rice field. Three generations. A promise nobody wrote down.",
    taglineKm: "ស្រែមួយ។ បីជំនាន់។ ការសន្យាដែលគ្មាននរណាសរសេរទុក។",
    synopsis:
      "A grandmother divides her land between two sons who stopped speaking in 1993. Her granddaughter arrives from Melbourne with a camera and a question nobody in the family wants to answer.",
    synopsisKm:
      "យាយម្នាក់បែងចែកដីរបស់គាត់រវាងកូនប្រុសពីរនាក់ដែលឈប់និយាយគ្នាតាំងពីឆ្នាំ ១៩៩៣។ ចៅស្រីរបស់គាត់មកពីទីក្រុងមែលប៊នជាមួយកាមេរ៉ា និងសំណួរមួយ។",
    cast: ["Sophal Keo", "Bopha Chan", "Nita Ros"],
    subtitleLanguages: ["Khmer", "English"],
    featured: false,
    popularity: 6140,
    addedAt: new Date(BASE - 200 * DAY).toISOString(),
    palette: ["#1f3210", "#c8d96f"],
    status: "published",
    rightsNote: "Original production — owner: CINEMA KH.",
    seasons: [season(1, "Feature Film", eps("the-quiet-harvest", 1, [["The Quiet Harvest", "រដូវចម្រូតស្ងប់ស្ងាត់"]], -200, 104))],
  },
  {
    slug: "sky-train-love",
    name: "Sky Train Love",
    nameKm: "ស្នេហាលើរថភ្លើងអាកាស",
    type: "drama",
    country: "Korean",
    year: 2026,
    categories: ["Romance", "Comedy", "Drama"],
    ageRating: "All",
    tagline: "They share a commute, a playlist, and absolutely no names.",
    taglineKm: "ពួកគេចែករំលែកការធ្វើដំណើរ បញ្ជីចម្រៀង និងគ្មានឈ្មោះទាល់តែសោះ។",
    synopsis:
      "For eleven months two strangers take the same carriage at 7:42 and never speak. A broken lift, one misdelivered notebook, and a resignation letter change the whole timetable.",
    synopsisKm:
      "រយៈពេល ១១ ខែ មនុស្សចម្លែកពីរនាក់ជិះរថភ្លើងតែមួយនៅម៉ោង ៧:៤២ ហើយមិនដែលនិយាយគ្នា។ ជណ្តើរយន្តខូច សៀវភៅកត់ត្រាមួយដែលផ្ញើខុស និងលិខិតលាឈប់ ផ្លាស់ប្តូរកាលវិភាគទាំងអស់។",
    cast: ["Hana Seo", "Jae Min", "Yuri Baek"],
    subtitleLanguages: ["Khmer", "English", "Korean"],
    featured: true,
    trendingRank: 4,
    popularity: 8410,
    addedAt: new Date(BASE - 7 * DAY).toISOString(),
    palette: ["#12203f", "#ff9ec4"],
    status: "published",
    rightsNote: "Licensed for streaming — sample record only.",
    seasons: [
      season(1, "Season 1", eps("sky-train-love", 1, [
        ["7:42", "៧:៤២"],
        ["The Notebook", "សៀវភៅកត់ត្រា"],
        ["Rain, Late", "ភ្លៀង យឺតពេល"],
        ["Platform Two", "វេទិកាទីពីរ"],
        ["Last Train", "រថភ្លើងចុងក្រោយ"],
      ], -21, 62)),
    ],
  },
  {
    slug: "iron-pagoda",
    name: "Iron Pagoda",
    nameKm: "វត្តដែក",
    type: "drama",
    country: "Chinese",
    year: 2025,
    categories: ["Martial Arts", "Action", "Fantasy"],
    ageRating: "16+",
    tagline: "The last disciple of a burned temple carries its only surviving page.",
    taglineKm: "សិស្សចុងក្រោយនៃវត្តដែលត្រូវដុត នាំយកទំព័រតែមួយគត់ដែលនៅសល់។",
    synopsis:
      "When the Iron Pagoda falls, a kitchen boy escapes with half a manual. Every sect in the valley wants the other half, and none of them agree on what it teaches.",
    synopsisKm:
      "នៅពេលវត្តដែកធ្លាក់ ក្មេងប្រុសម្នាក់រត់គេចជាមួយសៀវភៅពាក់កណ្តាល។ គ្រប់ក្រុមក្នុងជ្រលងភ្នំចង់បានពាក់កណ្តាលទៀត។",
    cast: ["Lin Zhao", "Wei Fan", "Chen Lu"],
    subtitleLanguages: ["Khmer", "English", "Chinese"],
    featured: false,
    popularity: 7650,
    addedAt: new Date(BASE - 90 * DAY).toISOString(),
    palette: ["#2b1414", "#e25822"],
    status: "published",
    rightsNote: "Licensed for streaming — sample record only.",
    seasons: [
      season(1, "Season 1", eps("iron-pagoda", 1, [
        ["The Kitchen Boy", "ក្មេងប្រុសផ្ទះបាយ"],
        ["Half a Manual", "សៀវភៅពាក់កណ្តាល"],
        ["Nine Steps", "ប្រាំបួនជំហាន"],
        ["The Valley", "ជ្រលងភ្នំ"],
        ["Ash", "ផេះ"],
        ["Rebuild", "សាងសង់ឡើងវិញ"],
      ], -90, 48)),
    ],
  },
  {
    slug: "the-understudy",
    name: "The Understudy",
    nameKm: "តួជំនួស",
    type: "movie",
    country: "Japanese",
    year: 2025,
    categories: ["Thriller", "Mystery", "Drama"],
    ageRating: "16+",
    tagline: "She learned every line. She just never expected to be given the stage.",
    taglineKm: "នាងបានរៀនគ្រប់បន្ទាត់។ នាងមិនដែលរំពឹងថានឹងបានឡើងឆាកទេ។",
    synopsis:
      "A theatre understudy is promoted overnight after the lead's disappearance. The police call it an accident. The script's final scene says otherwise.",
    synopsisKm:
      "តួជំនួសម្នាក់ត្រូវបានតែងតាំងភ្លាមៗបន្ទាប់ពីតួឯកបាត់ខ្លួន។ ប៉ូលិសហៅវាថាគ្រោះថ្នាក់។ ឈុតចុងក្រោយនៃអត្ថបទនិយាយខុសគ្នា។",
    cast: ["Aoi Muto", "Ren Kudo", "Emi Sano"],
    subtitleLanguages: ["Khmer", "English", "Japanese"],
    featured: false,
    popularity: 6980,
    addedAt: new Date(BASE - 150 * DAY).toISOString(),
    palette: ["#101010", "#d62828"],
    status: "published",
    rightsNote: "Licensed for streaming — sample record only.",
    seasons: [season(1, "Feature Film", eps("the-understudy", 1, [["The Understudy", "តួជំនួស"]], -150, 112))],
  },
  {
    slug: "village-of-rain",
    name: "Village of Rain",
    nameKm: "ភូមិភ្លៀង",
    type: "drama",
    country: "Khmer",
    year: 2025,
    categories: ["Horror", "Mystery", "Drama"],
    ageRating: "16+",
    tagline: "It has rained for four months. Nobody in the village thinks that is strange.",
    taglineKm: "ភ្លៀងបានធ្លាក់រយៈពេលបួនខែ។ គ្មាននរណាក្នុងភូមិគិតថាចម្លែកទេ។",
    synopsis:
      "A nurse posted to a remote village notices the rain stops at the temple gate. The older villagers say it always has. The children say it started when the well was closed.",
    synopsisKm:
      "គិលានុបដ្ឋាយិកាដែលត្រូវបានបញ្ជូនទៅភូមិដាច់ស្រយាលសង្កេតឃើញថាភ្លៀងឈប់នៅមាត់ទ្វារវត្ត។ អ្នកភូមិចាស់និយាយថាវាមានជានិច្ច។",
    cast: ["Chan Dara", "Sokunthea Pich", "Veasna Em"],
    subtitleLanguages: ["Khmer", "English"],
    featured: false,
    popularity: 5470,
    addedAt: new Date(BASE - 60 * DAY).toISOString(),
    palette: ["#0e1f1a", "#5ea8a0"],
    status: "published",
    rightsNote: "Original production — owner: CINEMA KH.",
    seasons: [
      season(1, "Season 1", eps("village-of-rain", 1, [
        ["The Posting", "ការបញ្ជូន"],
        ["Temple Gate", "មាត់ទ្វារវត្ត"],
        ["The Well", "អណ្តូង"],
        ["Four Months", "បួនខែ"],
        ["Dry Again", "ស្ងួតវិញ"],
      ], -60, 44)),
    ],
  },
  {
    slug: "the-last-seller",
    name: "The Last Seller",
    nameKm: "អ្នកលក់ចុងក្រោយ",
    type: "movie",
    country: "Khmer",
    year: 2023,
    categories: ["Comedy", "Family", "Drama"],
    ageRating: "All",
    tagline: "A market stall, a phone camera, and a mother who refuses to be replaced.",
    taglineKm: "តូបលក់ដូរមួយ កាមេរ៉ាទូរស័ព្ទ និងម្តាយម្នាក់ដែលមិនព្រមត្រូវជំនួស។",
    synopsis:
      "When a covered market closes for renovation, a noodle seller's son turns her stall into a livestream. She hates it. The internet does not care.",
    synopsisKm:
      "នៅពេលផ្សារបិទសម្រាប់ការជួសជុល កូនប្រុសអ្នកលក់គុយទាវប្តូរតូបរបស់ម្តាយទៅជាការផ្សាយផ្ទាល់។ គាត់ស្អប់វា។ អ៊ីនធឺណិតមិនខ្វល់ទេ។",
    cast: ["Maly Ngin", "Phirun Sok", "Borey Hak"],
    subtitleLanguages: ["Khmer", "English"],
    featured: false,
    popularity: 6320,
    addedAt: new Date(BASE - 320 * DAY).toISOString(),
    palette: ["#3d2a05", "#f7c948"],
    status: "published",
    rightsNote: "Original production — owner: CINEMA KH.",
    seasons: [season(1, "Feature Film", eps("the-last-seller", 1, [["The Last Seller", "អ្នកលក់ចុងក្រោយ"]], -320, 96))],
  },
  {
    slug: "orbit-9",
    name: "Orbit 9",
    nameKm: "គន្លងទី៩",
    type: "drama",
    country: "Other",
    year: 2026,
    categories: ["Science Fiction", "Thriller", "Mystery"],
    ageRating: "13+",
    tagline: "Nine crew left Earth. Eight are answering the radio.",
    taglineKm: "នាវិកប្រាំបួននាក់ចាកចេញពីផែនដី។ ប្រាំបីនាក់កំពុងឆ្លើយតបវិទ្យុ។",
    synopsis:
      "A supply run to a decommissioned station should take eleven days. On day six the crew receives a message from their own ship, timestamped three weeks from now.",
    synopsisKm:
      "ការដឹកជញ្ជូនទៅស្ថានីយដែលបានបិទគួរតែយករយៈពេល ១១ ថ្ងៃ។ នៅថ្ងៃទី ៦ នាវិកទទួលសារពីកប៉ាល់ខ្លួនឯង។",
    cast: ["Ada Ridley", "Tomas Vogel", "Nia Osei"],
    subtitleLanguages: ["Khmer", "English"],
    featured: false,
    trendingRank: 5,
    popularity: 7180,
    addedAt: new Date(BASE - 3 * DAY).toISOString(),
    palette: ["#050b1f", "#6c8cff"],
    status: "published",
    rightsNote: "Licensed for streaming — sample record only.",
    seasons: [
      season(1, "Season 1", eps("orbit-9", 1, [
        ["Eleven Days", "ដប់មួយថ្ងៃ"],
        ["Day Six", "ថ្ងៃទីប្រាំមួយ"],
        ["Own Signal", "សញ្ញាខ្លួនឯង"],
        ["Quiet Deck", "នាវាស្ងប់ស្ងាត់"],
      ], -3, 51)),
    ],
  },
  {
    slug: "salt-and-jasmine",
    name: "Salt and Jasmine",
    nameKm: "អំបិល និងផ្កាម្លិះ",
    type: "movie",
    country: "Thai",
    year: 2024,
    categories: ["Romance", "Drama"],
    ageRating: "13+",
    tagline: "Two cooks, one recipe, and a father's last letter.",
    taglineKm: "ចុងភៅពីរនាក់ រូបមន្តមួយ និងលិខិតចុងក្រោយរបស់ឪពុក។",
    synopsis:
      "Estranged siblings inherit a shophouse restaurant and a recipe book written in a code neither of them can read. Their father's old rival offers to translate — for a price.",
    synopsisKm:
      "បងប្អូនដែលឃ្លាតឆ្ងាយទទួលមរតកភោជនីយដ្ឋាន និងសៀវភៅរូបមន្តដែលសរសេរជាកូដ។ គូប្រកួតចាស់របស់ឪពុកព្រមបកប្រែឲ្យ — ក្នុងតម្លៃមួយ។",
    cast: ["Pimchanok A.", "Anan T.", "Suda R."],
    subtitleLanguages: ["Khmer", "English", "Thai"],
    featured: false,
    popularity: 5890,
    addedAt: new Date(BASE - 260 * DAY).toISOString(),
    palette: ["#2a1408", "#e9c46a"],
    status: "published",
    rightsNote: "Licensed for streaming — sample record only.",
    seasons: [season(1, "Feature Film", eps("salt-and-jasmine", 1, [["Salt and Jasmine", "អំបិល និងផ្កាម្លិះ"]], -260, 108))],
  },
  {
    slug: "the-cartographer",
    name: "The Cartographer",
    nameKm: "អ្នកគូរផែនទី",
    type: "movie",
    country: "Other",
    year: 2022,
    categories: ["Adventure", "Historical", "Drama"],
    ageRating: "13+",
    tagline: "He mapped every river but could not find his way home.",
    taglineKm: "គាត់គូរផែនទីគ្រប់ទន្លេ ប៉ុន្តែរកផ្លូវទៅផ្ទះមិនបាន។",
    synopsis:
      "In 1928 a young surveyor is sent to chart the tributaries of the upper basin. The maps he draws are accurate. The ones the ministry publishes are not.",
    synopsisKm:
      "ក្នុងឆ្នាំ ១៩២៨ អ្នកវាស់ដីវ័យក្មេងម្នាក់ត្រូវបានបញ្ជូនឲ្យគូរផែនទីដៃទន្លេខាងលើ។ ផែនទីដែលគាត់គូរគឺត្រឹមត្រូវ។ ផែនទីដែលក្រសួងបោះពុម្ពមិនត្រឹមត្រូវ។",
    cast: ["Émile Roux", "Sok Heng", "Linh Pham"],
    subtitleLanguages: ["Khmer", "English", "French"],
    featured: false,
    popularity: 4310,
    addedAt: new Date(BASE - 500 * DAY).toISOString(),
    palette: ["#1b2430", "#a8b8c8"],
    status: "published",
    rightsNote: "Licensed for streaming — sample record only.",
    seasons: [season(1, "Feature Film", eps("the-cartographer", 1, [["The Cartographer", "អ្នកគូរផែនទី"]], -500, 127))],
  },
  {
    slug: "little-elephant-road",
    name: "Little Elephant Road",
    nameKm: "ផ្លូវដំរីតូច",
    type: "drama",
    country: "Khmer",
    year: 2026,
    categories: ["Animation", "Family", "Adventure"],
    ageRating: "All",
    tagline: "A small elephant, a long road, and a song that opens gates.",
    taglineKm: "ដំរីតូច ផ្លូវវែង និងចម្រៀងដែលបើកទ្វារ។",
    synopsis:
      "Tuk-Tuk the elephant follows a melody down a road that is not on any map, meeting animals who each know one line of the song.",
    synopsisKm:
      "ទូកទូក ដំរីតូច ដើរតាមបទភ្លេងមួយនៅលើផ្លូវដែលមិនមានក្នុងផែនទី ជួបសត្វដែលម្នាក់ៗដឹងបន្ទាត់មួយនៃចម្រៀង។",
    cast: ["Voices by CINEMA KH Studio"],
    subtitleLanguages: ["Khmer", "English"],
    featured: true,
    trendingRank: 6,
    popularity: 8020,
    addedAt: new Date(BASE - 1 * DAY).toISOString(),
    palette: ["#123c2b", "#9be564"],
    status: "published",
    rightsNote: "Original production — owner: CINEMA KH.",
    seasons: [
      season(1, "Season 1", eps("little-elephant-road", 1, [
        ["The Melody", "បទភ្លេង"],
        ["Gate of Reeds", "ទ្វារដើមរំដេង"],
        ["The Frog's Line", "បន្ទាត់របស់កង្កែប"],
        ["Long Road", "ផ្លូវវែង"],
      ], -1, 22)),
    ],
  },
  {
    slug: "silent-frequency",
    name: "Silent Frequency",
    nameKm: "រលកសំឡេងស្ងាត់",
    type: "drama",
    country: "Korean",
    year: 2025,
    categories: ["Thriller", "Crime", "Drama"],
    ageRating: "18+",
    tagline: "A radio host takes a call from a man who has been dead for a year.",
    taglineKm: "ពិធីករវិទ្យុទទួលការហៅពីបុរសម្នាក់ដែលស្លាប់អស់មួយឆ្នាំ។",
    synopsis:
      "Late-night talk radio is supposed to be harmless. Then a caller recites a confession in the host's own voice, and the station's archive starts losing tapes.",
    synopsisKm:
      "វិទ្យុពេលយប់មិនគួរមានបញ្ហាទេ។ បន្ទាប់មកអ្នកហៅចូលម្នាក់សូត្រការសារភាពដោយសំឡេងរបស់ពិធីករខ្លួនឯង។",
    cast: ["Jung Ho", "Sena Park", "Min Gi"],
    subtitleLanguages: ["Khmer", "English", "Korean"],
    featured: false,
    popularity: 6740,
    addedAt: new Date(BASE - 45 * DAY).toISOString(),
    palette: ["#0d0d14", "#9b5de5"],
    status: "published",
    rightsNote: "Licensed for streaming — sample record only.",
    seasons: [
      season(1, "Season 1", eps("silent-frequency", 1, [
        ["Caller One", "អ្នកហៅទីមួយ"],
        ["Dead Air", "ខ្យល់ស្លាប់"],
        ["Archive", "បណ្ណសារ"],
        ["Live", "ផ្សាយផ្ទាល់"],
        ["Sign-Off", "បញ្ចប់ការផ្សាយ"],
      ], -45, 58)),
    ],
  },
];

export const CATEGORIES = [
  "Comedy", "Horror", "Action", "Romance", "Drama", "Thriller", "Fantasy",
  "Adventure", "Science Fiction", "Mystery", "Crime", "Family", "Animation",
  "Historical", "Documentary", "War", "Martial Arts",
] as const;

export const COUNTRIES = ["Khmer", "Chinese", "Korean", "Thai", "Japanese", "Other"] as const;

export const CATEGORIES_KM: Record<string, string> = {
  Comedy: "កំប្លែង", Horror: "ភ័យរន្ធត់", Action: "សកម្មភាព", Romance: "មនោសញ្ចេតនា",
  Drama: "ដ្រាម៉ា", Thriller: "រន្ធត់ចិត្ត", Fantasy: "រឿងប្រឌិត", Adventure: "ផ្សងព្រេង",
  "Science Fiction": "វិទ្យាសាស្ត្រប្រឌិត", Mystery: "អាថ៌កំបាំង", Crime: "ឧក្រិដ្ឋកម្ម",
  Family: "គ្រួសារ", Animation: "គំនូរជីវចល", Historical: "ប្រវត្តិសាស្ត្រ",
  Documentary: "ឯកសារ", War: "សង្គ្រាម", "Martial Arts": "ក្បាច់គុន",
};

export const COUNTRIES_KM: Record<string, string> = {
  Khmer: "ខ្មែរ", Chinese: "ចិន", Korean: "កូរ៉េ", Thai: "ថៃ", Japanese: "ជប៉ុន", Other: "ផ្សេងៗ",
};
