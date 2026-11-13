"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, CATEGORIES_KM, COUNTRIES, COUNTRIES_KM } from "@/lib/catalogue";

export default function FilterBar({ years }: { years: number[] }) {
  const router = useRouter();
  const params = useSearchParams();

  function set(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    router.push(`/browse?${next.toString()}`);
  }

  const val = (k: string) => params.get(k) ?? "all";
  const active =
    !!params.get("type") || !!params.get("category") || !!params.get("country") || !!params.get("year");

  const selectCls =
    "rounded-full border border-line bg-ink-2 px-4 py-2 text-sm text-white outline-none transition hover:border-gold/50";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="sr-only" htmlFor="f-type">ប្រភេទ</label>
      <select id="f-type" className={selectCls} value={val("type")} onChange={(e) => set("type", e.target.value)}>
        <option value="all">ប្រភេទទាំងអស់</option>
        <option value="movie">ភាពយន្ត</option>
        <option value="drama">រឿងភាគ</option>
      </select>

      <label className="sr-only" htmlFor="f-cat">ប្រភេទរឿង</label>
      <select id="f-cat" className={selectCls} value={val("category")} onChange={(e) => set("category", e.target.value)}>
        <option value="all">ប្រភេទរឿងទាំងអស់</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{CATEGORIES_KM[c] ?? c}</option>
        ))}
      </select>

      <label className="sr-only" htmlFor="f-country">ប្រទេស</label>
      <select id="f-country" className={selectCls} value={val("country")} onChange={(e) => set("country", e.target.value)}>
        <option value="all">ប្រទេសទាំងអស់</option>
        {COUNTRIES.map((c) => (
          <option key={c} value={c}>{COUNTRIES_KM[c] ?? c}</option>
        ))}
      </select>

      <label className="sr-only" htmlFor="f-year">ឆ្នាំ</label>
      <select id="f-year" className={selectCls} value={val("year")} onChange={(e) => set("year", e.target.value)}>
        <option value="all">ឆ្នាំទាំងអស់</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      <label className="sr-only" htmlFor="f-sort">តម្រៀប</label>
      <select id="f-sort" className={selectCls} value={params.get("sort") ?? "popular"} onChange={(e) => set("sort", e.target.value)}>
        <option value="popular">ពេញនិយមបំផុត</option>
        <option value="newest">ថ្មីបំផុត</option>
        <option value="year">ឆ្នាំថ្មី</option>
        <option value="az">A–Z</option>
      </select>

      {active && (
        <button
          onClick={() => router.push("/browse")}
          className="rounded-full border border-gold/40 px-4 py-2 text-sm text-gold transition hover:bg-gold/10"
        >
          សម្អាតតម្រង
        </button>
      )}
    </div>
  );
}
