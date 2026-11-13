"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useSession, type ProgressRecord } from "@/components/session-provider";
import { clearProgress } from "@/actions/viewer";

export default function ContinueWatching({
  items,
}: {
  items: ProgressRecord[];
}) {
  const { user, profile } = useSession();
  const router = useRouter();
  const [, startTransition] = useTransition();

  if (!user || !profile || items.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-bold sm:text-xl">មើលបន្ត</h2>
          <p className="text-xs uppercase tracking-[0.18em] text-mist/60">Continue Watching</p>
        </div>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          const pct = Math.min(100, Math.round((p.positionSeconds / Math.max(p.durationSeconds, 1)) * 100));
          return (
            <li key={`${p.slug}-${p.episodeId}`} className="group relative overflow-hidden rounded-xl border border-line bg-ink-2 p-3">
              <Link href={`/watch/${p.slug}?ep=${p.episodeId}`} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/poster/${p.slug}`}
                  alt=""
                  width={56}
                  height={84}
                  className="h-[84px] w-[56px] shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.titleNameKm}</p>
                  <p className="truncate text-xs text-mist">
                    រដូវ {p.season} ភាគ {p.number} · {p.episodeNameKm}
                  </p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-[11px] text-mist/60">មើលរួច {pct}%</p>
                </div>
              </Link>
              <button
                onClick={() =>
                  startTransition(async () => {
                    // titleId is needed for the delete; resolve via the progress row.
                    await clearProgress(profile.id, p.titleId ?? "");
                    router.refresh();
                  })
                }
                aria-label={`លុប ${p.titleNameKm} ចេញពីមើលបន្ត`}
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
