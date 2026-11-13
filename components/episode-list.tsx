"use client";

import Link from "next/link";
import { useState } from "react";
import type { Title } from "@/lib/types";
import { isReleased } from "@/lib/data";
import { useSession } from "@/components/session-provider";

/** Deterministic date format so server and client render identical markup. */
function shortDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
}

export default function EpisodeList({ title }: { title: Title }) {
  const [active, setActive] = useState(title.seasons[0]?.number ?? 1);
  const { progress } = useSession();
  const season = title.seasons.find((s) => s.number === active) ?? title.seasons[0];

  if (!season) return null;

  return (
    <section aria-labelledby="episodes-heading">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="episodes-heading" className="text-xl font-bold">
          {title.type === "movie" ? "វីដេអូ" : "ភាគ"}
        </h2>
        {title.seasons.length > 1 && (
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="ជ្រើសរើសរដូវ">
            {title.seasons.map((s) => (
              <button
                key={s.number}
                role="tab"
                aria-selected={s.number === active}
                onClick={() => setActive(s.number)}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  s.number === active
                    ? "bg-gold font-semibold text-ink"
                    : "border border-line text-mist hover:border-gold/50 hover:text-white"
                }`}
              >
                រដូវ {s.number}
              </button>
            ))}
          </div>
        )}
      </div>

      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {season.episodes.map((e) => {
          const released = isReleased(e);
          const rec = progress.find((p) => p.slug === title.slug && p.episodeId === e.id);
          const pct = rec ? Math.min(100, Math.round((rec.position / Math.max(rec.duration, 1)) * 100)) : 0;
          const inner = (
            <>
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-sm font-bold ${
                  released ? "bg-white/10 text-white" : "bg-white/5 text-mist/50"
                }`}
              >
                {e.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className={`truncate text-sm font-medium ${released ? "text-white" : "text-mist/70"}`}>
                    {e.titleKm || e.title}
                  </span>
                  <span className="shrink-0 text-[11px] text-mist/60">{e.durationMinutes}′</span>
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-mist/50">
                  {released
                    ? e.title
                    : `កាលកំណត់ ${shortDate(e.releaseAt)}`}
                </span>
                {pct > 0 && (
                  <span className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <span className="block h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                  </span>
                )}
              </span>
            </>
          );

          return (
            <li key={e.id}>
              {released ? (
                <Link
                  href={`/watch/${title.slug}?ep=${e.id}`}
                  className="flex items-center gap-3 rounded-xl border border-line bg-ink-2 p-3 transition hover:border-gold/40 hover:bg-ink-3"
                >
                  {inner}
                </Link>
              ) : (
                <div className="flex cursor-not-allowed items-center gap-3 rounded-xl border border-line/50 bg-ink-2/40 p-3">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
