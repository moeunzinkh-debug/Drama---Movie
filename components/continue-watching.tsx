"use client";

import Link from "next/link";
import { useSession } from "@/components/session-provider";
import { getTitle, findEpisode } from "@/lib/data";

const COMPLETION_THRESHOLD = 0.95;

export default function ContinueWatching() {
  const { user, progress, clearProgress, ready } = useSession();
  if (!ready || !user) return null;

  const items = progress
    .map((p) => {
      const title = getTitle(p.slug);
      const ep = title ? findEpisode(title, p.episodeId) : undefined;
      return title && ep ? { p, title, ep } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .filter((x) => x.p.position / Math.max(x.p.duration, 1) < COMPLETION_THRESHOLD)
    .slice(0, 8);

  if (!items.length) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-bold sm:text-xl">មើលបន្ត</h2>
          <p className="text-xs uppercase tracking-[0.18em] text-mist/60">Continue Watching</p>
        </div>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ p, title, ep }) => {
          const pct = Math.min(100, Math.round((p.position / Math.max(p.duration, 1)) * 100));
          return (
            <li
              key={`${p.slug}-${p.episodeId}`}
              className="group relative overflow-hidden rounded-xl border border-line bg-ink-2 p-3"
            >
              <Link href={`/watch/${title.slug}?ep=${ep.id}`} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/poster/${title.slug}`}
                  alt=""
                  width={56}
                  height={84}
                  className="h-[84px] w-[56px] shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{title.nameKm}</p>
                  <p className="truncate text-xs text-mist">
                    រដូវ {ep.season} ភាគ {ep.number} · {ep.titleKm}
                  </p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-[11px] text-mist/60">មើលរួច {pct}%</p>
                </div>
              </Link>
              <button
                onClick={() => clearProgress(title.slug)}
                aria-label={`លុប ${title.nameKm} ចេញពីមើលបន្ត`}
                className="absolute right-2 top-2 rounded-md p-1 text-mist/50 opacity-0 transition hover:bg-white/10 hover:text-white focus-visible:opacity-100 group-hover:opacity-100"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
