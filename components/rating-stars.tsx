"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { useSession } from "@/components/session-provider";
import { rateTitle } from "@/actions/viewer";

export default function RatingStars({ titleId }: { titleId: string }) {
  const { user, profile, ratings } = useSession();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const current = ratings[titleId] ?? 0;
  const [optimistic, setOptimistic] = useOptimistic(current, (_prev: number, next: number) => next);

  function rate(n: number) {
    if (!profile) {
      router.push(`/login?next=${encodeURIComponent(location.pathname)}`);
      return;
    }
    startTransition(async () => {
      setOptimistic(n);
      await rateTitle(profile.id, titleId, n);
      router.refresh();
    });
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-2" role="group" aria-label="ផ្តល់ពិន្ទុ">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => rate(n)}
          disabled={pending}
          aria-label={`${n} ផ្កាយ`}
          aria-pressed={optimistic === n}
          className={`text-lg leading-none transition ${n <= optimistic ? "text-gold" : "text-white/25 hover:text-gold/60"}`}
        >
          ★
        </button>
      ))}
      <span className="ml-1 text-[11px] text-mist/60">
        {user ? (optimistic ? `របស់អ្នក ${optimistic}/5` : "ដាក់ពិន្ទុ") : "ចូលដើម្បីដាក់ពិន្ទុ"}
      </span>
    </div>
  );
}
