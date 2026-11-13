"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Title } from "@/lib/types";
import { CATEGORIES_KM } from "@/lib/catalogue";
import { watchHref } from "@/lib/data";

export default function HeroCarousel({ titles }: { titles: Title[] }) {
  const [i, setI] = useState(0);
  const t = titles[i];

  useEffect(() => {
    if (titles.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % titles.length), 9000);
    return () => clearInterval(id);
  }, [titles.length]);

  if (!t) return null;

  return (
    <section
      className="relative overflow-hidden hero-vignette"
      aria-roledescription="carousel"
      aria-label="រឿងពិសេស"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-ink">
              ពិសេស
            </span>
            <span className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white/70">
              {t.type === "movie" ? "ភាពយន្ត" : "រឿងភាគ"} · {t.year}
            </span>
            <span className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white/70">
              {t.ageRating}
            </span>
          </div>
          <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            {t.nameKm}
          </h1>
          <p className="mt-1 text-sm uppercase tracking-[0.2em] text-gold/80">{t.name}</p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-mist sm:text-base">{t.taglineKm}</p>
          <p className="mt-1 max-w-xl text-xs text-mist/60">
            {t.categories.map((c) => CATEGORIES_KM[c] ?? c).join(" · ")} · {t.country} · {t.subtitleLanguages.join(" / ")}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={watchHref(t)}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink transition hover:bg-gold-dim"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
              មើលឥឡូវ
            </Link>
            <Link
              href={`/title/${t.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-gold/60 hover:text-gold"
            >
              ព័ត៌មានលម្អិត
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-2" role="tablist" aria-label="ជ្រើសរើសរឿងពិសេស">
            {titles.map((x, idx) => (
              <button
                key={x.slug}
                role="tab"
                aria-selected={idx === i}
                aria-label={x.nameKm}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? "w-8 bg-gold" : "w-4 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs lg:max-w-sm">
          <Link href={`/title/${t.slug}`} className="group block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/poster/${t.slug}`}
              alt={`ផ្ទាំងរូបភាព ${t.nameKm}`}
              width={600}
              height={900}
              className="w-full rounded-2xl border border-white/10 shadow-2xl shadow-black/60 transition group-hover:scale-[1.02]"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
