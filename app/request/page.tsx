"use client";

import { useState } from "react";
import { useSession } from "@/components/session-provider";
import { COUNTRIES, COUNTRIES_KM } from "@/lib/catalogue";

interface Submitted {
  title: string;
  country: string;
  year: string;
  notes: string;
  at: number;
}

export default function RequestPage() {
  const { user, ready } = useSession();
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");
  const [notes, setNotes] = useState("");
  const [mine, setMine] = useState<Submitted[]>([]);
  const [error, setError] = useState("");

  if (!ready) return <div className="py-24 text-center text-sm text-mist">កំពុងផ្ទុក…</div>;

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-black">ស្នើសុំរឿង</h1>
        <p className="mt-2 text-sm text-mist">
          អ្នកត្រូវចូលដោយ Google ដើម្បីផ្ញើសំណើ។ សំណើត្រូវបានកំណត់អត្រា ដើម្បីការពារសារឥតបានការ។
        </p>
        <a href="/login?next=/request" className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink">
          ចូលដោយ Google
        </a>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (title.trim().length < 2) {
      setError("សូមបញ្ចូលឈ្មោះរឿងយ៉ាងតិច ២ តួអក្សរ។");
      return;
    }
    if (mine.length >= 10) {
      setError("អ្នកបានផ្ញើសំណើច្រើនពេកហើយ។ សូមរង់ចាំការពិនិត្យ។");
      return;
    }
    setMine((m) => [{ title: title.trim(), country, year, notes: notes.trim(), at: Date.now() }, ...m]);
    setTitle(""); setCountry(""); setYear(""); setNotes("");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight">ស្នើសុំរឿង</h1>
      <p className="mt-2 text-sm text-mist">
        មិនអាចធានាថាគ្រប់សំណើនឹងត្រូវបានបន្ថែមទេ — យើងអាចបន្ថែមបានតែមាតិកាដែលមានសិទ្ធិស្របច្បាប់។
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border border-line bg-ink-2 p-5">
        <div>
          <label htmlFor="r-title" className="mb-1 block text-xs uppercase tracking-wider text-mist/70">
            ឈ្មោះរឿង <span className="text-gold">*</span>
          </label>
          <input id="r-title" value={title} onChange={(e) => setTitle(e.target.value)} required
            className="w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm outline-none focus:border-gold/60" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="r-country" className="mb-1 block text-xs uppercase tracking-wider text-mist/70">ប្រទេស (ស្រេចចិត្ត)</label>
            <select id="r-country" value={country} onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm">
              <option value="">—</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{COUNTRIES_KM[c] ?? c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="r-year" className="mb-1 block text-xs uppercase tracking-wider text-mist/70">ឆ្នាំ (ស្រេចចិត្ត)</label>
            <input id="r-year" value={year} onChange={(e) => setYear(e.target.value)} inputMode="numeric" maxLength={4}
              className="w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm" />
          </div>
        </div>
        <div>
          <label htmlFor="r-notes" className="mb-1 block text-xs uppercase tracking-wider text-mist/70">កំណត់សម្គាល់ (ស្រេចចិត្ត)</label>
          <textarea id="r-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} maxLength={400}
            className="w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm" />
        </div>
        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
        <button type="submit" className="rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink hover:bg-gold-dim">
          ផ្ញើសំណើ
        </button>
        <p className="text-[11px] text-mist/50">
          សំណើក្នុងគំរូនេះរក្សាទុកក្នុងកម្មវិធីរុករកតែប៉ុណ្ណោះ។ ក្នុងការផលិតពិត វាត្រូវរក្សាទុកក្នុង Supabase
          ជាមួយការកំណត់អត្រានៅខាងម៉ាស៊ីនមេ។
        </p>
      </form>

      {mine.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-semibold">សំណើរបស់អ្នក</h2>
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line">
            {mine.map((m, i) => (
              <li key={i} className="flex items-center justify-between gap-3 bg-ink-2 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm">{m.title}</p>
                  <p className="text-xs text-mist">{[m.country && (COUNTRIES_KM[m.country] ?? m.country), m.year].filter(Boolean).join(" · ") || "—"}</p>
                </div>
                <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-[11px] text-mist">រង់ចាំពិនិត្យ</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
