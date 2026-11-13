"use client";

import { useSession } from "@/components/session-provider";

export default function RatingStars({ slug }: { slug: string }) {
  const { ratings, rate, user } = useSession();
  const mine = ratings[slug] ?? 0;

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-2" role="group" aria-label="ផ្តល់ពិន្ទុ">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => rate(slug, n)}
          aria-label={`${n} ផ្កាយ`}
          aria-pressed={mine === n}
          className={`text-lg leading-none transition ${
            n <= mine ? "text-gold" : "text-white/25 hover:text-gold/60"
          }`}
        >
          ★
        </button>
      ))}
      <span className="ml-1 text-[11px] text-mist/60">{user ? (mine ? `របស់អ្នក ${mine}/5` : "ដាក់ពិន្ទុ") : "ចូលដើម្បីដាក់ពិន្ទុ"}</span>
    </div>
  );
}
