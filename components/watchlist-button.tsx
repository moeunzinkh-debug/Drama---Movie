"use client";

import { useSession } from "@/components/session-provider";

export default function WatchlistButton({ slug }: { slug: string }) {
  const { user, watchlist, toggleWatchlist } = useSession();
  const inList = watchlist.includes(slug);

  return (
    <button
      onClick={() => toggleWatchlist(slug)}
      aria-pressed={inList}
      title={user ? undefined : "ត្រូវចូលដោយ Google ដើម្បីរក្សាទុក"}
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition ${
        inList
          ? "border-gold/60 bg-gold/10 text-gold"
          : "border-white/20 text-white hover:border-gold/60 hover:text-gold"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={inList ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 5v14M5 12h14" />
      </svg>
      {inList ? "នៅក្នុងបញ្ជី" : "បន្ថែមទៅបញ្ជី"}
    </button>
  );
}
