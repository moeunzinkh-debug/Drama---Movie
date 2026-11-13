import type { Metadata } from "next";
import Link from "next/link";
import { publishedTitles, totalEpisodes, allEpisodes } from "@/lib/data";
import { isReleased } from "@/lib/data";

export const metadata: Metadata = { title: "ផ្ទាំងគ្រប់គ្រង", robots: { index: false, follow: false } };

/**
 * Admin dashboard — READ-ONLY MOCKUP.
 *
 * There is no authentication here and no write operations. Every number except
 * the catalogue counts is a placeholder. Production requirements:
 *  - admin role checked server-side on every request (never trust a client flag);
 *  - Supabase RLS on all tables + service-role access only inside server actions;
 *  - ad metrics imported from the provider's official reports, never fabricated;
 *  - every admin mutation written to admin_audit_logs.
 * See docs/SECURITY.md.
 */

const KPIS = [
  { label: "គណនីចុះឈ្មោះ", value: "—", note: "ត្រូវការ Supabase" },
  { label: "ប្រវត្តិរូប", value: "—", note: "ត្រូវការ Supabase" },
  { label: "អ្នកមើលសកម្ម (7ថ្ងៃ)", value: "—", note: "ត្រូវការការវិភាគ" },
  { label: "ចំណូលប៉ាន់ស្មាន", value: "—", note: "មិនទាន់មាន AdSense" },
];

const PENDING = [
  { label: "សំណើរឿងរង់ចាំ", value: "—" },
  { label: "មតិយោបល់រង់ចាំពិនិត្យ", value: "—" },
  { label: "របាយការណ៍វីដេអូខូច", value: "—" },
  { label: "ការរាយការណ៍អ្នកប្រើ", value: "—" },
];

const SECTIONS = [
  { title: "គ្រប់គ្រងមាតិកា", desc: "ភាពយន្ត រឿងភាគ រដូវ ភាគ ផ្ទាំងរូប ប្រភេទ ប្រទេស" },
  { title: "ភាគនិងកាលវិភាគ", desc: "បញ្ចូលភាគជាក្រុម កំណត់ពេលចេញផ្សាយ" },
  { title: "ពិនិត្យវីដេអូ", desc: "ត្រួតពិនិត្យស្ថានភាពប្រភពវីដេអូ និងរាយការណ៍" },
  { title: "អ្នកប្រើ និងការត្រួតពិនិត្យ", desc: "ផ្អាកគណនី មតិយោបល់ ការរាយការណ៍" },
  { title: "ការផ្សាយពាណិជ្ជកម្ម", desc: "បើក/បិទកន្លែង កំណត់ប្រេកង់ ads.txt" },
  { title: "ការវិភាគ និងប្រតិបត្តិការ", desc: "ស្ថិតិ កំហុស បម្រុងទុក កំណត់ហេតុ" },
];

export default function AdminPage() {
  const titles = publishedTitles();
  const eps = totalEpisodes();
  const released = titles.reduce((n, t) => n + allEpisodes(t).filter((e) => isReleased(e)).length, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">ផ្ទាំងគ្រប់គ្រង</h1>
          <p className="mt-1 text-sm text-mist">ទិដ្ឋភាពទូទៅ — គំរូអានបានតែប៉ុណ្ណោះ</p>
        </div>
        <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs text-gold">
          មិនទាន់មានការផ្ទៀងផ្ទាត់សិទ្ធិ — មិនត្រូវដាក់ផ្សាយ
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-xs leading-relaxed text-red-200/90">
        <strong className="block text-sm text-red-200">សំខាន់សម្រាប់សុវត្ថិភាព</strong>
        ផ្ទាំងនេះជា <em>គំរូរចនា</em> តែប៉ុណ្ណោះ។ ក្នុងការផលិត គ្រប់ route ក្រោម <code>/admin</code> ត្រូវការការត្រួតពិនិត្យ
        តួនាទីនៅខាងម៉ាស៊ីនមេ (server-side) និង Supabase RLS។ មិនត្រូវទុកផ្ទាំងនេះឲ្យចូលបានជាសាធារណៈទេ។
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-xl border border-line bg-ink-2 p-4">
            <p className="text-xs uppercase tracking-wider text-mist/60">{k.label}</p>
            <p className="mt-1 text-2xl font-black text-white/70">{k.value}</p>
            <p className="mt-1 text-[11px] text-mist/50">{k.note}</p>
          </div>
        ))}
      </section>

      <section className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-line bg-ink-2 p-4">
          <p className="text-xs uppercase tracking-wider text-mist/60">ចំណងជើងដាក់ផ្សាយ</p>
          <p className="mt-1 text-2xl font-black text-gold">{titles.length}</p>
        </div>
        <div className="rounded-xl border border-line bg-ink-2 p-4">
          <p className="text-xs uppercase tracking-wider text-mist/60">ភាគសរុប</p>
          <p className="mt-1 text-2xl font-black text-gold">{eps}</p>
        </div>
        <div className="rounded-xl border border-line bg-ink-2 p-4">
          <p className="text-xs uppercase tracking-wider text-mist/60">ភាគចេញផ្សាយហើយ</p>
          <p className="mt-1 text-2xl font-black text-gold">{released}</p>
        </div>
        <div className="rounded-xl border border-line bg-ink-2 p-4">
          <p className="text-xs uppercase tracking-wider text-mist/60">ភាគកំណត់ទុក</p>
          <p className="mt-1 text-2xl font-black text-white/70">{eps - released}</p>
        </div>
      </section>

      <section className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PENDING.map((p) => (
          <div key={p.label} className="rounded-xl border border-line bg-ink-2 p-4">
            <p className="text-xs text-mist/70">{p.label}</p>
            <p className="mt-1 text-xl font-bold text-white/50">{p.value}</p>
            <p className="mt-1 text-[11px] text-mist/40">ត្រូវការមូលដ្ឋានទិន្នន័យ</p>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold">មុខងារគ្រប់គ្រង</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <div key={s.title} className="rounded-xl border border-line bg-ink-2 p-4">
              <p className="font-semibold">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-mist">{s.desc}</p>
              <p className="mt-3 text-[11px] text-mist/40">មិនទាន់អនុវត្ត</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-line bg-ink-2 p-4">
        <h2 className="text-lg font-bold">មាតិកាក្នុងបញ្ជី</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wider text-mist/60">
                <th className="py-2 pr-4 font-medium">ចំណងជើង</th>
                <th className="py-2 pr-4 font-medium">ប្រភេទ</th>
                <th className="py-2 pr-4 font-medium">ប្រទេស</th>
                <th className="py-2 pr-4 font-medium">ភាគ</th>
                <th className="py-2 font-medium">ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody>
              {titles.map((t) => (
                <tr key={t.slug} className="border-b border-line/50 last:border-0">
                  <td className="py-2 pr-4">
                    <Link href={`/title/${t.slug}`} className="hover:text-gold">{t.nameKm}</Link>
                    <span className="ml-2 text-[11px] text-mist/40">{t.name}</span>
                  </td>
                  <td className="py-2 pr-4 text-mist">{t.type === "movie" ? "ភាពយន្ត" : "រឿងភាគ"}</td>
                  <td className="py-2 pr-4 text-mist">{t.country}</td>
                  <td className="py-2 pr-4 text-mist">{allEpisodes(t).length}</td>
                  <td className="py-2">
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300">
                      បានផ្សាយ
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
