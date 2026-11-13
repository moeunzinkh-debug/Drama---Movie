"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { submitMovieRequest } from "@/actions/requests";

export default function RequestForm({
  countries,
}: {
  countries: { slug: string; label: string }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(false);
    startTransition(async () => {
      const res = await submitMovieRequest({ title, country, year, notes });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setTitle(""); setCountry(""); setYear(""); setNotes("");
      setDone(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border border-line bg-ink-2 p-5">
      <div>
        <label htmlFor="r-title" className="mb-1 block text-xs uppercase tracking-wider text-mist/70">
          ឈ្មោះរឿង <span className="text-gold">*</span>
        </label>
        <input id="r-title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200}
          className="w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm outline-none focus:border-gold/60" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="r-country" className="mb-1 block text-xs uppercase tracking-wider text-mist/70">ប្រទេស (ស្រេចចិត្ត)</label>
          <select id="r-country" value={country} onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm">
            <option value="">—</option>
            {countries.map((c) => <option key={c.slug} value={c.label}>{c.label}</option>)}
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
      {done && <p role="status" className="text-sm text-emerald-400">បានផ្ញើសំណើ — អរគុណ។</p>}

      <button type="submit" disabled={pending}
        className="rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink transition hover:bg-gold-dim disabled:opacity-60">
        {pending ? "កំពុងផ្ញើ…" : "ផ្ញើសំណើ"}
      </button>
    </form>
  );
}
