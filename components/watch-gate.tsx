"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/components/session-provider";
import Player from "@/components/player";
import type { Episode, Title } from "@/lib/types";

/**
 * Renders the player only when the server has already established a session.
 *
 * The gate is a UX affordance, not the security boundary: /api/playback refuses
 * to mint a token without a valid Supabase session, so bypassing this component
 * yields a player with no source.
 */
export default function WatchGate({
  title,
  episode,
  profileId,
  next,
  resumeFrom,
}: {
  title: Title;
  episode: Episode;
  profileId: string | null;
  next?: { id: string; number: number; titleKm: string; href: string };
  resumeFrom: number;
}) {
  const { user } = useSession();
  const pathname = usePathname();

  if (!user) {
    return (
      <div className="grid aspect-video w-full place-items-center overflow-hidden rounded-xl border border-line bg-[radial-gradient(circle_at_50%_30%,#1a1a2b,#07070c_70%)]">
        <div className="max-w-md px-6 text-center">
          <h2 className="text-lg font-bold sm:text-xl">ចូលដើម្បីមើល</h2>
          <p className="mt-2 text-sm leading-relaxed text-mist">
            ការរកមើលគឺឥតគិតថ្លៃ និងមិនត្រូវការគណនី។ ប៉ុន្តែអ្នកត្រូវចូលដោយ Google
            ដើម្បីចាក់វីដេអូ និងរក្សាទុកការមើលបន្ត។
          </p>
          <Link
            href={`/login?next=${encodeURIComponent(pathname)}`}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink transition hover:bg-gold-dim"
          >
            ចូលដោយ Google
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Player
      title={title}
      episode={episode}
      profileId={profileId}
      next={next}
      resumeFrom={resumeFrom}
    />
  );
}
