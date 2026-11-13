import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TITLES } from "@/lib/catalogue";
import {
  getTitle,
  findEpisode,
  firstPlayableEpisode,
  isReleased,
  nextEpisode,
  previousEpisode,
  related,
} from "@/lib/data";
import WatchGate from "@/components/watch-gate";
import AdSlot from "@/components/ad-slot";
import TitleCard from "@/components/title-card";

export function generateStaticParams() {
  return TITLES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getTitle(slug);
  return { title: t ? `មើល ${t.nameKm}` : "មើល" };
}

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ep?: string }>;
}) {
  const { slug } = await params;
  const { ep } = await searchParams;
  const title = getTitle(slug);
  if (!title) notFound();

  const fallback = firstPlayableEpisode(title);
  if (!fallback) redirect(`/title/${title.slug}`);

  const episode = ep ? findEpisode(title, ep) : fallback;
  if (!episode) notFound();
  if (!isReleased(episode)) redirect(`/title/${title.slug}`);

  const next = nextEpisode(title, episode.id);
  const prev = previousEpisode(title, episode.id);
  const rel = related(title, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Player first — no ads above or inside it. */}
      <WatchGate
        title={title}
        episode={episode}
        next={next ? { ...next, href: `/watch/${title.slug}?ep=${next.id}` } : undefined}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold sm:text-xl">
            {title.nameKm}
            {title.type === "drama" && (
              <span className="text-mist"> · រដូវ {episode.season} ភាគ {episode.number}</span>
            )}
          </h1>
          <p className="truncate text-sm text-mist">
            {episode.titleKm || episode.title} · {episode.durationMinutes} នាទី
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {prev ? (
            <Link
              href={`/watch/${title.slug}?ep=${prev.id}`}
              className="rounded-full border border-line px-4 py-2 text-mist transition hover:border-gold/50 hover:text-gold"
            >
              ← ភាគមុន
            </Link>
          ) : (
            <span className="rounded-full border border-line/50 px-4 py-2 text-mist/40">← ភាគមុន</span>
          )}
          {next ? (
            <Link
              href={`/watch/${title.slug}?ep=${next.id}`}
              className="rounded-full bg-gold px-4 py-2 font-semibold text-ink transition hover:bg-gold-dim"
            >
              ភាគបន្ទាប់ →
            </Link>
          ) : (
            <span className="rounded-full border border-line/50 px-4 py-2 text-mist/40">ភាគបន្ទាប់ →</span>
          )}
          <Link
            href={`/title/${title.slug}`}
            className="rounded-full border border-line px-4 py-2 text-mist transition hover:border-gold/50 hover:text-white"
          >
            ព័ត៌មានលម្អិត
          </Link>
        </div>
      </div>

      {!next && title.type === "drama" && (
        <p className="mt-3 rounded-lg border border-line bg-ink-2 px-3 py-2 text-xs text-mist">
          នេះជាភាគចុងក្រោយដែលបានចេញផ្សាយ។ ភាគបន្ទាប់មិនទាន់មាន ឬមិនទាន់ដល់កាលកំណត់។
        </p>
      )}

      {/* Ad placement: below the player, never alongside the playback controls. */}
      <div className="mt-6">
        <AdSlot placement="watch-below-player" format="leaderboard" />
      </div>

      <section className="mt-6 rounded-xl border border-line bg-ink-2 p-4">
        <h2 className="text-sm font-semibold">អំពីភាគនេះ</h2>
        <p className="mt-2 text-sm leading-relaxed text-mist">
          {episode.synopsis ?? title.synopsisKm}
        </p>
        <p className="mt-3 text-xs text-mist/50">
          សិទ្ធិមាតិកា៖ {title.rightsNote} — វីដេអូក្នុងគេហទំព័រនេះជាការសាកល្បង។
        </p>
      </section>

      {rel.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold">រឿងស្រដៀងគ្នា</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {rel.map((t) => (
              <TitleCard key={t.slug} title={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
