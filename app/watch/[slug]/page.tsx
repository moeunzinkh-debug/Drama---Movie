import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getTitleBySlug, getPlayableEpisode, getRelated } from "@/lib/queries";
import { getActiveProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import WatchGate from "@/components/watch-gate";
import AdSlot from "@/components/ad-slot";
import TitleCard from "@/components/title-card";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTitleBySlug(slug);
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

  const title = await getTitleBySlug(slug);
  if (!title) notFound();

  const profile = await getActiveProfile();
  const playable = await getPlayableEpisode(slug, ep, profile?.id);

  // Nothing released yet for this title.
  if (!playable) redirect(`/title/${title.slug}`);

  // Server-side release gate: never render a player for an unreleased episode.
  if (!playable.released) redirect(`/title/${title.slug}`);

  // Resume position for the active profile (server read, not client cache).
  let resumeFrom = 0;
  if (profile) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("watch_progress")
      .select("position_seconds, completed")
      .eq("profile_id", profile.id)
      .eq("episode_id", playable.id)
      .maybeSingle();
    if (data && !data.completed) resumeFrom = data.position_seconds;
  }

  const rel = await getRelated(title, 6);
  const episode = {
    id: playable.id,
    season: playable.season,
    number: playable.number,
    title: playable.title,
    titleKm: playable.titleKm,
    durationMinutes: Math.round(playable.durationSeconds / 60),
    releaseAt: playable.releaseAt,
    synopsis: undefined,
  };

  const next = playable.nextId
    ? {
        id: playable.nextId,
        number: playable.nextNumber ?? 0,
        titleKm: playable.nextTitleKm ?? "",
        href: `/watch/${title.slug}?ep=${playable.nextId}`,
      }
    : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <WatchGate
        title={title}
        episode={episode}
        profileId={profile?.id ?? null}
        next={next}
        resumeFrom={resumeFrom}
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
          {playable.previousId ? (
            <Link
              href={`/watch/${title.slug}?ep=${playable.previousId}`}
              className="rounded-full border border-line px-4 py-2 text-mist transition hover:border-gold/50 hover:text-gold"
            >
              ← ភាគមុន
            </Link>
          ) : (
            <span className="rounded-full border border-line/50 px-4 py-2 text-mist/40">← ភាគមុន</span>
          )}
          {next ? (
            <Link href={next.href} className="rounded-full bg-gold px-4 py-2 font-semibold text-ink transition hover:bg-gold-dim">
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

      <div className="mt-6">
        <AdSlot placement="watch-below-player" format="leaderboard" />
      </div>

      <section className="mt-6 rounded-xl border border-line bg-ink-2 p-4">
        <h2 className="text-sm font-semibold">អំពីភាគនេះ</h2>
        <p className="mt-2 text-sm leading-relaxed text-mist">
          {episode.synopsis ?? title.synopsisKm ?? title.synopsis}
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
