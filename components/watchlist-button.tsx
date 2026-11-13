"use client";

import { useState, useTransition } from "react";
import { useSession } from "@/components/session-provider";
import { toggleWatchlist } from "@/actions/viewer";
import { useRouter } from "next/navigation";

export default function WatchlistButton({ titleId }: { titleId: string }) {
  const { user, profile, watchlist } = useSession();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState<boolean | null>(null);

  const inList = optimistic ?? watchlist.some((w) => w.titleId === titleId);

  function onClick() {
    if (!profile) {
      router.push(`/login?next=${encodeURIComponent(location.pathname)}`);
      return;
    }
    setOptimistic(!inList);
    startTransition(async () => {
      const res = await toggleWatchlist(profile.id, titleId);
      if (!res.ok) setOptimistic(inList); // revert on failure
      else setOptimistic(res.inList ?? !inList);
      router.refresh();
    });
  }

  return (
    <button
      onClick={onClick}
      disabled={pending}
      aria-pressed={inList}
      title={user ? undefined : "ត្រូវចូលដើម្បីរក្សាទុក"}
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition disabled:opacity-60 ${
        inList
          ? "border-gold/60 bg-gold/10 text-gold"
          : "border-white/20 text-white hover:border-gold/60 hover:text-gold"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={inList ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
        {inList ? <path d="M20 6L9 17l-5-5" /> : <path d="M12 5v14M5 12h14" />}
      </svg>
      {inList ? "នៅក្នុងបញ្ជី" : "បន្ថែមទៅបញ្ជី"}
    </button>
  );
}
