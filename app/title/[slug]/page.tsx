import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTitleBySlug, getRelated } from "@/lib/queries";

import EpisodeList from "@/components/episode-list";
import RatingStars from "@/components/rating-stars";
import WatchlistButton from "@/components/watchlist-button";
import AdSlot from "@/components/ad-slot";
import Section from "@/components/section";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTitleBySlug(slug);
  if (!t) return { title: "រកមិនឃើញ" };
  return {
    title: `${t.nameKm} (${t.name})`,
    description: t.taglineKm || t.tagline,
    openGraph: { title: t.nameKm, description: t.taglineKm, images: [`/api/poster/${t.slug}`] },
  };
}

export default async function TitlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = await getTitleBySlug(slug);
  if (!title) notFound();

  const rel = await getRelated(title, 6);
  const episodes = title.seasons.flatMap((s) => s.episodes);
  const isReleased = (e: { releaseAt: string }) => new Date(e.releaseAt).getTime() <= Date.now();
  const ep = episodes.find(isReleased);
  const released = episodes.filter((e) => isReleased(e)).length;

  return (
    <article>
      <div className="relative overflow-hidden border-b border-line/60">
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(90% 120% at 20% 0%, ${title.palette[1]}44, transparent 60%), linear-gradient(180deg, ${title.palette[0]}, #07070c 85%)`,
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] lg:py-12">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/poster/${title.slug}`}
              alt={`ផ្ទាំងរូបភាព ${title.nameKm}`}
              width={600}
              height={900}
              className="w-full rounded-xl border border-white/10 shadow-2xl shadow-black/50 md:sticky md:top-24"
            />
          </div>

          <div>
            <nav aria-label="breadcrumb" className="mb-3 text-xs text-mist/60">
              <Link href="/" className="hover:text-gold">ទំព័រដើម</Link>
              <span className="px-1.5">/</span>
              <Link href={`/browse?type=${title.type}`} className="hover:text-gold">
                {title.type === "movie" ? "ភាពយន្ត" : "រឿងភាគ"}
              </Link>
              <span className="px-1.5">/</span>
              <span className="text-white/70">{title.nameKm}</span>
            </nav>

            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">{title.nameKm}</h1>
            <p className="mt-1 text-sm uppercase tracking-[0.2em] text-gold/80">{title.name}</p>
            {title.altTitle && <p className="mt-1 text-xs text-mist/60">Also known as: {title.altTitle}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-white/15 px-2.5 py-1 text-white/70">{title.year}</span>
              <span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-gold">អាយុ {title.ageRating}</span>
              <span className="rounded-full border border-white/15 px-2.5 py-1 text-white/70">
                {episodes.length > 1 ? `${released}/${episodes.length} ភាគ` : `${ep?.durationMinutes ?? 0} នាទី`}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {title.categories.map((c) => (
                <Link
                  key={c}
                  href={`/browse?category=${encodeURIComponent(c)}`}
                  className="rounded-md bg-white/5 px-2.5 py-1 text-xs capitalize text-mist transition hover:bg-white/10 hover:text-white"
                >
                  {c.replace(/-/g, " ")}
                </Link>
              ))}
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/85">{title.synopsisKm || title.synopsis}</p>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-mist/60">{title.synopsis}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {ep ? (
                <Link
                  href={ep ? `/watch/${title.slug}?ep=${ep.id}` : `/title/${title.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink transition hover:bg-gold-dim"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
                  មើលឥឡូវ
                </Link>
              ) : (
                <span className="rounded-full border border-line px-6 py-3 text-sm text-mist">មិនទាន់មានភាគចេញផ្សាយ</span>
              )}
              <WatchlistButton titleId={title.id} />
              <RatingStars titleId={title.id} />
            </div>

            <dl className="mt-8 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              {title.cast.length > 0 && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-mist/50">តារាសម្តែង</dt>
                  <dd className="mt-0.5 text-white/85">{title.cast.join(", ")}</dd>
                </div>
              )}
              {title.subtitleLanguages.length > 0 && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-mist/50">អក្សររត់</dt>
                  <dd className="mt-0.5 text-white/85">{title.subtitleLanguages.join(" · ")}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs uppercase tracking-wider text-mist/50">បន្ថែមនៅ</dt>
                <dd className="mt-0.5 text-white/85">
                  {new Date(title.addedAt).toLocaleDateString("en-GB")}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <EpisodeList title={title} />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-2 sm:px-6">
        <AdSlot placement="detail-bottom" format="leaderboard" />
      </div>

      {rel.length > 0 && <Section heading="រឿងស្រដៀងគ្នា" headingEn="You may also like" titles={rel} />}
    </article>
  );
}
