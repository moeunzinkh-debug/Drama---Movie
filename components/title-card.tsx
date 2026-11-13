import Link from "next/link";
import type { Title } from "@/lib/types";

function prettyCategory(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function TitleCard({
  title,
  rank,
  className = "",
}: {
  title: Title;
  rank?: number;
  className?: string;
}) {
  return (
    <Link
      href={`/title/${title.slug}`}
      className={`group relative block overflow-hidden rounded-xl border border-line/70 bg-ink-2 transition hover:border-gold/40 ${className}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/poster/${title.slug}`}
          alt={`${title.name} (${title.nameKm}) — ផ្ទាំងរូបភាព`}
          loading="lazy"
          width={600}
          height={900}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 card-shine" />
        {rank !== undefined && (
          <span className="absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-lg bg-gold text-sm font-black text-ink">
            {rank}
          </span>
        )}
        <span className="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/80 backdrop-blur">
          {title.type === "movie" ? "ភាពយន្ត" : "រឿងភាគ"}
        </span>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3">
          <p className="line-clamp-1 text-sm font-semibold text-white">{title.nameKm}</p>
          <p className="line-clamp-1 text-[11px] text-white/60">
            {title.year} · {title.ageRating}
          </p>
        </div>
      </div>
      <div className="px-3 py-2.5">
        <p className="line-clamp-1 text-xs text-mist">
          {title.categories.slice(0, 2).map(prettyCategory).join(" · ")}
        </p>
      </div>
    </Link>
  );
}
