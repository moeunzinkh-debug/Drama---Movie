"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/components/session-provider";
import Player from "@/components/player";
import type { Episode, Title } from "@/lib/types";

/**
 * Sign-in gate for playback.
 *
 * The catalogue is public; playback requires an account. In this prototype the
 * gate is client-side only. In production the check MUST happen on the server
 * (Supabase session + RLS) and the video token must be issued per request — a
 * client-side gate alone is not access control.
 */
export default function WatchGate({
  title,
  episode,
  next,
}: {
  title: Title;
  episode: Episode;
  next?: Episode & { href: string };
}) {
  const { user, ready, progress } = useSession();

  if (!ready) {
    return (
      <div className="grid aspect-video w-full place-items-center rounded-xl border border-line bg-ink-2">
        <p className="text-sm text-mist">កំពុងផ្ទុក…</p>
      </div>
    );
  }

  if (!user) {
    const path = usePathname();
    return (
      <div className="grid aspect-video w-full place-items-center overflow-hidden rounded-xl border border-line bg-[radial-gradient(circle_at_50%_30%,#1a1a2b,#07070c_70%)]">
        <div className="max-w-md px-6 text-center">
          <h2 className="text-lg font-bold sm:text-xl">ចូលដើម្បីមើល</h2>
          <p className="mt-2 text-sm leading-relaxed text-mist">
            ការរកមើលគឺឥតគិតថ្លៃ និងមិនត្រូវការគណនី។ ប៉ុន្តែអ្នកត្រូវចូលដោយ Google
            ដើម្បីចាក់វីដេអូ និងរក្សាទុកការមើលបន្ត។
          </p>
          <Link
            href={`/login?next=${encodeURIComponent(path ?? "/")}`}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink transition hover:bg-gold-dim"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
              <path fill="#0a0a0f" d="M21.35 11.1H12v2.9h5.35c-.23 1.4-1.66 4.1-5.35 4.1A6.1 6.1 0 1 1 12 5.9c1.76 0 2.94.75 3.62 1.4l2.47-2.38A9.6 9.6 0 0 0 12 2.4a9.6 9.6 0 1 0 0 19.2c5.54 0 9.2-3.9 9.2-9.38 0-.63-.07-1.1-.15-1.62z" />
            </svg>
            ចូលដោយ Google
          </Link>
          <p className="mt-3 text-[11px] text-mist/50">
            (ការចូលក្នុងគំរូនេះជា <span className="text-gold/80">ការសាកល្បង</span> — មិនទាន់ភ្ជាប់ Google OAuth ពិតប្រាកដ)
          </p>
        </div>
      </div>
    );
  }

  const rec = progress.find((p) => p.slug === title.slug && p.episodeId === episode.id);

  return (
    <Player
      title={title}
      episode={episode}
      next={next}
      resumeFrom={rec?.position ?? 0}
    />
  );
}
