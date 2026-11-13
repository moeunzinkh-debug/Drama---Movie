"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Episode, Title } from "@/lib/types";
import { saveProgress, reportBrokenVideo } from "@/actions/viewer";

/**
 * Real video player.
 *
 * Playback URL flow:
 *   1. The player asks the server for a token via POST /api/playback.
 *   2. The server verifies session, suspension, release date and parental
 *      ceiling, then returns either a signed Cloudflare Stream token or an
 *      authorised HLS URL.
 *   3. The player streams it. A 401/403 triggers a fresh token fetch once.
 *
 * Progress is persisted to Postgres via a server action (debounced), not to
 * localStorage, so it syncs across devices.
 */

function fmt(sec: number): string {
  const s = Math.max(0, Math.floor(sec || 0));
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return h > 0
    ? `${h}:${String(m % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
    : `${m}:${String(s % 60).padStart(2, "0")}`;
}

type PlaybackResponse =
  | { kind: "hls"; src: string }
  | { kind: "cloudflare_stream"; token?: string; customerCode: string; assetId: string };

export default function Player({
  title,
  episode,
  profileId,
  next,
  resumeFrom,
  autoNextDefault = true,
}: {
  title: Title;
  episode: Episode;
  profileId: string | null;
  next?: { id: string; number: number; titleKm: string; href: string };
  resumeFrom: number;
  autoNextDefault?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const lastSaved = useRef(0);
  const tokenRefreshTried = useRef(false);

  const [src, setSrc] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [duration, setDuration] = useState(episode.durationMinutes * 60 || 0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [autoNext, setAutoNext] = useState(autoNextDefault);
  const [showNextPrompt, setShowNextPrompt] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [reported, setReported] = useState(false);
  const [reporting, setReporting] = useState(false);

  // ---- resolve a playback source from the server -----------------------------
  const loadSource = useCallback(
    async (isRetry = false) => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch("/api/playback", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ episodeId: episode.id }),
        });

        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
          setLoadError(body.message ?? "មិនអាចចាក់វីដេអូបានទេ។");
          setLoading(false);
          return;
        }

        const data = (await res.json()) as PlaybackResponse;
        if (data.kind === "hls") {
          setSrc(data.src);
        } else {
          const code = data.customerCode;
          const tokenPart = data.token ? `/token/${data.token}` : "";
          // Cloudflare Stream manifest endpoint.
          setSrc(`https://customer-${code}.cloudflarestream.com/${data.assetId}/manifest/video.m3u8${tokenPart}`);
        }
        setLoading(false);
      } catch {
        if (!isRetry) {
          tokenRefreshTried.current = true;
          void loadSource(true);
        } else {
          setLoadError("បណ្តាញមានបញ្ហា។ សូមព្យាយាមម្តងទៀត។");
          setLoading(false);
        }
      }
    },
    [episode.id],
  );

  useEffect(() => {
    setPos(0);
    setShowNextPrompt(false);
    setCountdown(10);
    setReported(false);
    tokenRefreshTried.current = false;
    setSrc(null);
    void loadSource();
  }, [episode.id, loadSource]);

  // ---- progress persistence --------------------------------------------------
  const persist = useCallback(
    (positionSeconds: number, durationSeconds: number) => {
      if (!profileId || positionSeconds <= 0 || durationSeconds <= 0) return;
      void saveProgress({
        profileId,
        episodeId: episode.id,
        titleId: title.id,
        positionSeconds,
        durationSeconds,
      });
    },
    [profileId, episode.id, title.id],
  );

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (Math.abs(v.currentTime - lastSaved.current) < 10) return;
    lastSaved.current = v.currentTime;
    persist(v.currentTime, v.duration || duration);
  }, [pos, persist, duration]);

  // Save on unmount / episode change and on page hide (mobile backgrounding).
  useEffect(() => {
    const save = () => {
      const v = videoRef.current;
      if (v && v.currentTime > 0) persist(v.currentTime, v.duration || duration);
    };
    window.addEventListener("pagehide", save);
    return () => {
      window.removeEventListener("pagehide", save);
      save();
    };
  }, [persist, duration]);

  // ---- auto next -------------------------------------------------------------
  const handleEnded = useCallback(() => {
    setPlaying(false);
    persist(duration, duration); // marks completed so it leaves Continue Watching
    if (next && autoNext) setShowNextPrompt(true);
  }, [next, autoNext, persist, duration]);

  useEffect(() => {
    if (!showNextPrompt || !next) return;
    if (countdown <= 0) {
      window.location.href = next.href;
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [showNextPrompt, countdown, next]);

  // ---- controls --------------------------------------------------------------
  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  }

  function seekTo(seconds: number) {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(seconds, v.duration || duration));
    setPos(v.currentTime);
  }

  function toggleFullscreen() {
    const el = shellRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.().catch(() => undefined);
  }

  // Keyboard shortcuts (space, arrows, f, m).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      const v = videoRef.current;
      if (!v) return;
      if (e.code === "Space") { e.preventDefault(); togglePlay(); }
      else if (e.code === "ArrowRight") { e.preventDefault(); seekTo(v.currentTime + 10); }
      else if (e.code === "ArrowLeft") { e.preventDefault(); seekTo(v.currentTime - 10); }
      else if (e.key === "f") toggleFullscreen();
      else if (e.key === "m") { v.muted = !v.muted; setMuted(v.muted); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const pct = duration > 0 ? Math.min(100, (pos / duration) * 100) : 0;

  if (loadError) {
    return (
      <div className="grid aspect-video w-full place-items-center rounded-xl border border-line bg-ink-2">
        <div className="max-w-sm px-6 text-center">
          <p className="text-base font-semibold">មិនអាចចាក់វីដេអូបានទេ</p>
          <p className="mt-2 text-sm text-mist">{loadError}</p>
          <div className="mt-4 flex justify-center gap-2">
            <button onClick={() => void loadSource()} className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink">
              ព្យាយាមម្តងទៀត
            </button>
            <button
              onClick={async () => {
                setReporting(true);
                await reportBrokenVideo({
                  episodeId: episode.id,
                  titleId: title.id,
                  reason: `Player error: ${loadError}`,
                });
                setReporting(false);
                setReported(true);
              }}
              disabled={reporting}
              className="rounded-full border border-line px-4 py-2 text-sm text-mist hover:text-white"
            >
              {reported ? "បានរាយការណ៍" : "រាយការណ៍វីដេអូខូច"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={shellRef} className="overflow-hidden rounded-xl border border-line bg-black">
      <div className="relative aspect-video w-full bg-black">
        {src ? (
          <video
            ref={videoRef}
            src={src}
            className="h-full w-full"
            playsInline
            preload="metadata"
            poster={`/api/poster/${title.slug}`}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              setDuration(v.duration || duration);
              if (resumeFrom > 0 && resumeFrom < (v.duration || duration) * 0.95) {
                v.currentTime = resumeFrom;
                setPos(resumeFrom);
              }
            }}
            onTimeUpdate={(e) => setPos(e.currentTarget.currentTime)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={handleEnded}
            onError={() => {
              if (!tokenRefreshTried.current) {
                tokenRefreshTried.current = true;
                void loadSource(true);
              } else {
                setLoadError("វីដេអូមានបញ្ហាក្នុងការផ្ទុក។");
              }
            }}
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <p className="text-sm text-mist">{loading ? "កំពុងផ្ទុកវីដេអូ…" : ""}</p>
          </div>
        )}

        {!playing && src && !loading && (
          <button
            onClick={togglePlay}
            aria-label="លេង"
            className="absolute inset-0 grid place-items-center bg-black/20 transition hover:bg-black/30"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-gold text-ink shadow-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}

        {showNextPrompt && next && (
          <div className="absolute inset-0 grid place-items-center bg-black/85 backdrop-blur-sm">
            <div className="max-w-sm px-6 text-center">
              <p className="text-sm text-mist">ភាគបន្ទាប់នឹងចាប់ផ្តើមក្នុង</p>
              <p className="my-2 text-5xl font-black text-gold">{countdown}</p>
              <p className="text-base font-semibold">ភាគ {next.number} — {next.titleKm}</p>
              <div className="mt-5 flex justify-center gap-2">
                <a href={next.href} className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-ink">លេងឥឡូវ</a>
                <button onClick={() => setShowNextPrompt(false)} className="rounded-full border border-line px-5 py-2.5 text-sm text-mist hover:text-white">
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
          max={duration || 0}
          step={0.1}
          value={pos}
          onChange={(e) => seekTo(Number(e.target.value))}
          aria-label="របារពេលវេលាវីដេអូ"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-gold"
          style={{
            backgroundImage: "linear-gradient(#f0b429,#f0b429)",
            backgroundSize: `${pct}% 100%`,
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button onClick={togglePlay} aria-label={playing ? "ផ្អាក" : "លេង"} className="grid h-10 w-10 place-items-center rounded-full bg-gold text-ink">
            {playing ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>

          <span className="font-mono text-xs text-mist">{fmt(pos)} / {fmt(duration)}</span>

          <div className="ml-auto flex flex-wrap items-center gap-2 text-xs">
            <label className="sr-only" htmlFor="speed">ល្បឿន</label>
            <select
              id="speed"
              value={speed}
              onChange={(e) => {
                const v = Number(e.target.value);
                setSpeed(v);
                if (videoRef.current) videoRef.current.playbackRate = v;
              }}
              className="rounded-md border border-line bg-ink px-2 py-1.5 text-xs"
            >
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                <option key={s} value={s}>{s}×</option>
              ))}
            </select>

            <button
              onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                v.muted = !v.muted;
                setMuted(v.muted);
              }}
              className="rounded-md border border-line px-2 py-1.5 hover:text-gold"
              aria-pressed={muted}
            >
              {muted ? "សំឡេងបិទ" : "សំឡេងបើក"}
            </button>

            <label className="sr-only" htmlFor="volume">កម្រិតសំឡេង</label>
            <input
              id="volume"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => {
                const v = Number(e.target.value);
                setVolume(v);
                if (videoRef.current) videoRef.current.volume = v;
              }}
              className="w-20 accent-gold"
            />

            <button onClick={toggleFullscreen} className="rounded-md border border-line px-2 py-1.5 hover:text-gold">
              ពេញអេក្រង់
            </button>

            <label className="flex cursor-pointer items-center gap-1.5 text-mist">
              <input type="checkbox" checked={autoNext} onChange={(e) => setAutoNext(e.target.checked)} className="accent-gold" />
              លេងភាគបន្ទាប់ស្វ័យប្រវត្តិ
            </label>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line/50 pt-3 text-xs text-mist">
          <span>
            {!profileId
              ? "គ្មានប្រវត្តិរូប — ការមើលបន្តមិនត្រូវបានរក្សាទុកទេ"
              : "ការមើលបន្តរក្សាទុកក្នុងគណនីរបស់អ្នក"}
          </span>
          {reported ? (
            <span className="text-gold">បានផ្ញើរបាយការណ៍ — អរគុណ។</span>
          ) : (
            <button
              onClick={async () => {
                setReporting(true);
                await reportBrokenVideo({
                  episodeId: episode.id,
                  titleId: title.id,
                  reason: "Viewer reported broken video from the player.",
                });
                setReporting(false);
                setReported(true);
              }}
              disabled={reporting}
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
