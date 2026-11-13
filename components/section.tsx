import Link from "next/link";
import type { Title } from "@/lib/types";
import TitleCard from "@/components/title-card";

export default function Section({
  heading,
  headingEn,
  href,
  titles,
  ranked = false,
}: {
  heading: string;
  headingEn?: string;
  href?: string;
  titles: Title[];
  ranked?: boolean;
}) {
  if (!titles.length) return null;
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{heading}</h2>
          {headingEn && <p className="text-xs uppercase tracking-[0.18em] text-mist/60">{headingEn}</p>}
        </div>
        {href && (
          <Link href={href} className="shrink-0 text-sm text-mist transition hover:text-gold">
            មើលទាំងអស់ →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {titles.map((t, i) => (
          <TitleCard key={t.slug} title={t} rank={ranked ? i + 1 : undefined} />
        ))}
      </div>
    </section>
  );
}
