"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "@/components/session-provider";
import type { Episode, Title } from "@/lib/types";

/**
 * Demo player.
 *
 * There is no video source here on purpose: no rights-cleared asset exists yet
 * and the video provider has not been chosen (Cloudflare Stream is the candidate).
 * The timeline is simulated so progress, resume, auto-next and the "Report broken
 * video" flow can be reviewed. Replace `durationSeconds` / the timer with a real
 * <video> element or Cloudflare Stream iframe, and keep progress saving server-side.
 */

function fmt(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return h > 0
    ? `${h}:${String(m % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
    : `${m}:${String(s % 60).padStart(2, "0")}`;
}

export default function Player({
  title,
  episode,
  next,
  resumeFrom,
}: {
  title: Title;
  episode: Episode;
  next?: Episode & { href: string };
  resumeFrom: number;
}) {
  const duration = episode.durationMinutes * 60;
  const { saveProgress, clearProgress, autoNext, setAutoNext } = useSession();

  const [pos, setPos] = useState(() => (resumeFrom > 0 && resumeFrom < duration * 0.95 ? resumeFrom : 0));
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showNextPrompt, setShowNextPrompt] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [reported, setReported] = useState(false);
  const [error, setError] = useState(false);
  const [subLang, setSubLang] = useState("ខ្មែរ");
  const lastSaved = useRef(0);
  const shellRef = useRef<HTMLDivElement | null>(null);

  // Reset when the episode changes.
  useEffect(() => {
    setPos(resumeFrom > 0 && resumeFrom < duration * 0.95 ? resumeFrom : 0);
    setPlaying(false);
    setShowNextPrompt(false);
    setCountdown(10);
    setReported(false);
    setError(false);
  }, [episode.id, duration, resumeFrom]);

  // Simulated playback clock.
  useEffect(() => {
    if (!playing || error) return;
    const id = setInterval(() => {
      setPos((p) => Math.min(duration, p + 1 * speed));
    }, 1000);
    return () => clearInterval(id);
  }, [playing, speed, duration, error]);

  // Persist progress periodically, and when paused/unmounted.
  const persist = useCallback(
    (p: number) => {
      if (p <= 0) return;
      saveProgress({ slug: title.slug, episodeId: episode.id, position: Math.round(p), duration });
    },
    [saveProgress, title.slug, episode.id, duration],
  );

  useEffect(() => {
    if (!playing) return;
    if (Math.abs(pos - lastSaved.current) < 10) return;
    lastSaved.current = pos;
    persist(pos);
  }, [pos, playing, persist]);

  useEffect(() => {
    return () => {
      setPos((p) => {
        if (p > 0) persist(p);
        return p;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode.id]);

  // End of playback → auto-next prompt.
  useEffect(() => {
    if (pos >= duration && duration > 0) {
      setPlaying(false);
      if (next && autoNext) {
        setShowNextPrompt(true);
      } else if (pos > 0) {
        // Finished: remove from Continue Watching instead of leaving it unfinished.
        clearProgress(title.slug);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, duration]);

  useEffect(() => {
    if (!showNextPrompt) return;
    if (countdown <= 0) {
      window.location.href = next!.href;
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [showNextPrompt, countdown, next]);

  const pct = useMemo(() => Math.min(100, (pos / Math.max(duration, 1)) * 100), [pos, duration]);

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    setPos(v);
    persist(v);
  }

  if (error) {
    return (
      <div className="relative grid aspect-video w-full place-items-center overflow-hidden rounded-xl border border-line bg-ink-2">
        <div className="max-w-sm px-6 text-center">
          <p className="text-base font-semibold">មិនអាចចាក់វីដេអូបានទេ</p>
          <p className="mt-2 text-sm text-mist">
            សូមព្យាយាមម្តងទៀត។ ប្រសិនបើបញ្ហានៅតែកើតឡើង សូមរាយការណ៍វីដេអូខូច។
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setError(false)}
              className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink"
            >
              ព្យាយាមម្តងទៀត
            </button>
            <a
              href="#report"
              className="rounded-full border border-line px-4 py-2 text-sm text-mist hover:text-white"
            >
              រាយការណ៍
            </a>
          </div>
        </div>
      </div>
    );
  }

  function toggleFullscreen() {
    const el = shellRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.().catch(() => setError(true));
  }

  return (
    <div ref={shellRef} className="overflow-hidden rounded-xl border border-line bg-black">
      <div className="relative grid aspect-video w-full place-items-center bg-[radial-gradient(circle_at_50%_40%,#171727,#05050a_70%)]">
        <div className="px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-mist/50">
            {title.type === "drama" ? `រដូវ ${episode.season} · ភាគ ${episode.number}` : "ភាពយន្ត"}
          </p>
          <p className="mt-2 text-xl font-bold sm:text-2xl">{episode.titleKm || episode.title}</p>
          <p className="mt-1 text-sm text-mist/70">{title.nameKm}</p>
          <p className="mt-4 inline-block rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] text-gold/90">
            អ្នកលេងសាកល្បង — មិនទាន់ភ្ជាប់វីដេអូពិត (រង់ចាំអ្នកផ្តល់សេវាវីដេអូ)
          </p>
        </div>

        {showNextPrompt && next && (
          <div className="absolute inset-0 grid place-items-center bg-black/85 backdrop-blur-sm">
            <div className="max-w-sm px-6 text-center">
              <p className="text-sm text-mist">ភាគបន្ទាប់នឹងចាប់ផ្តើមក្នុង</p>
              <p className="my-2 text-5xl font-black text-gold">{countdown}</p>
              <p className="text-base font-semibold">
                ភាគ {next.number} — {next.titleKm || next.title}
              </p>
              <div className="mt-5 flex justify-center gap-2">
                <a href={next.href} className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-ink">
                  លេងឥឡូវ
                </a>
                <button
                  onClick={() => setShowNextPrompt(false)}
                  className="rounded-full border border-line px-5 py-2.5 text-sm text-mist hover:text-white"
                >
                  បោះបង់
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="border-t border-line/60 bg-ink-2 p-3">
        <input
          type="range"
          min={0}
          max={duration}
          step={1}
          value={pos}
          onChange={seek}
          aria-label="របារពេលវេលាវីដេអូ"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-gold"
          style={{ backgroundImage: `linear-gradient(#f0b429,#f0b429)`, backgroundSize: `${pct}% 100%`, backgroundRepeat: "no-repeat" }}
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (pos >= duration) setPos(0);
              setPlaying((v) => !v);
            }}
            aria-label={playing ? "ផ្អាក" : "លេង"}
            className="grid h-10 w-10 place-items-center rounded-full bg-gold text-ink"
          >
            {playing ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <span className="font-mono text-xs text-mist">
            {fmt(pos)} / {fmt(duration)}
          </span>

          <div className="ml-auto flex flex-wrap items-center gap-2 text-xs">
            <label className="sr-only" htmlFor="speed">ល្បឿន</label>
            <select
              id="speed"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="rounded-md border border-line bg-ink px-2 py-1.5 text-xs"
            >
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                <option key={s} value={s}>{s}×</option>
              ))}
            </select>

            <label className="sr-only" htmlFor="subs">អក្សររត់</label>
            <select
              id="subs"
              value={subLang}
              onChange={(e) => setSubLang(e.target.value)}
              className="rounded-md border border-line bg-ink px-2 py-1.5 text-xs"
            >
              <option value="off">បិទអក្សររត់</option>
              {title.subtitleLanguages.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

            <button
              onClick={toggleFullscreen}
              className="rounded-md border border-line px-2 py-1.5 hover:text-gold"
            >
              ពេញអេក្រង់
            </button>

            <label className="flex cursor-pointer items-center gap-1.5 text-mist">
              <input
                type="checkbox"
                checked={autoNext}
                onChange={(e) => setAutoNext(e.target.checked)}
                className="accent-gold"
              />
              លេងភាគបន្ទាប់ស្វ័យប្រវត្តិ
            </label>

            <button
              onClick={() => setError(true)}
              className="rounded-md border border-line px-2 py-1.5 text-mist hover:text-white"
            >
              សាកល្បងកំហុស
            </button>
          </div>
        </div>

        <div id="report" className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line/50 pt-3 text-xs text-mist">
          <span>
            កំពុងចាក់ដោយ {subLang === "off" ? "គ្មានអក្សររត់" : `អក្សររត់ ${subLang}`}
          </span>
          {reported ? (
            <span className="text-gold">បានផ្ញើរបាយការណ៍ — អរគុណ។</span>
          ) : (
            <button
              onClick={() => setReported(true)}
              className="rounded-md border border-line px-2.5 py-1.5 hover:border-gold/50 hover:text-gold"
            >
              រាយការណ៍វីដេអូខូច
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
