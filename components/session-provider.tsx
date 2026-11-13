"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Client-side demo session.
 *
 * IMPORTANT: this is a UI prototype session stored in localStorage. It is NOT
 * authentication. It exists so the product flows (login gate, profiles,
 * watchlist, continue watching) can be designed and reviewed. Real sign-in must
 * be Supabase Auth + Google OAuth with server-side session cookies — see
 * docs/DEPLOY_CLOUDFLARE.md and docs/SECURITY.md before launch.
 */

export interface DemoUser {
  name: string;
  email: string;
}

export interface ProgressRecord {
  slug: string;
  episodeId: string;
  /** seconds watched */
  position: number;
  /** total length in seconds */
  duration: number;
  updatedAt: number;
}

export interface RatingRecord {
  [slug: string]: number;
}

interface SessionState {
  user: DemoUser | null;
  profile: string | null;
  profiles: string[];
  ready: boolean;
  signIn: (name: string, email?: string) => void;
  signOut: () => void;
  setProfile: (name: string) => void;
  addProfile: (name: string) => void;
  watchlist: string[];
  toggleWatchlist: (slug: string) => void;
  progress: ProgressRecord[];
  saveProgress: (rec: Omit<ProgressRecord, "updatedAt">) => void;
  clearProgress: (slug: string) => void;
  ratings: RatingRecord;
  rate: (slug: string, stars: number) => void;
  autoNext: boolean;
  setAutoNext: (v: boolean) => void;
}

const Ctx = createContext<SessionState | null>(null);

const KEY = "cinemakh.demo.v1";

interface Persisted {
  user: DemoUser | null;
  profile: string | null;
  profiles: string[];
  /** profile name -> data */
  perProfile: Record<
    string,
    {
      watchlist: string[];
      progress: ProgressRecord[];
      ratings: RatingRecord;
      autoNext: boolean;
    }
  >;
}

const EMPTY: Persisted = { user: null, profile: null, profiles: [], perProfile: {} };

function read(): Persisted {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Persisted;
    return { ...EMPTY, ...parsed, perProfile: parsed.perProfile ?? {} };
  } catch {
    return EMPTY;
  }
}

function write(state: Persisted) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked — non-fatal for a demo session */
  }
}

const blankProfile = () => ({
  watchlist: [] as string[],
  progress: [] as ProgressRecord[],
  ratings: {} as RatingRecord,
  autoNext: true,
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Persisted>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(read());
    setReady(true);
  }, []);

  const update = useCallback((fn: (s: Persisted) => Persisted) => {
    setState((prev) => {
      const next = fn(prev);
      write(next);
      return next;
    });
  }, []);

  const active = state.profile ? state.perProfile[state.profile] ?? blankProfile() : blankProfile();

  const signIn = useCallback(
    (name: string, email = "viewer@example.com") => {
      update((s) => {
        const profiles = s.profiles.length ? s.profiles : ["ខ្ញុំ"];
        const perProfile = { ...s.perProfile };
        for (const p of profiles) perProfile[p] = perProfile[p] ?? blankProfile();
        return { ...s, user: { name, email }, profiles, profile: profiles[0], perProfile };
      });
    },
    [update],
  );

  const signOut = useCallback(() => {
    setState((s) => {
      const next = { ...s, user: null, profile: null };
      write(next);
      return next;
    });
  }, []);

  const setProfile = useCallback(
    (name: string) => {
      update((s) => {
        if (!s.profiles.includes(name)) return s;
        return {
          ...s,
          profile: name,
          perProfile: { ...s.perProfile, [name]: s.perProfile[name] ?? blankProfile() },
        };
      });
    },
    [update],
  );

  const addProfile = useCallback(
    (name: string) => {
      const clean = name.trim().slice(0, 24);
      if (!clean) return;
      update((s) => {
        if (s.profiles.length >= 5 || s.profiles.includes(clean)) return s;
        return {
          ...s,
          profiles: [...s.profiles, clean],
          perProfile: { ...s.perProfile, [clean]: blankProfile() },
        };
      });
    },
    [update],
  );

  const toggleWatchlist = useCallback(
    (slug: string) => {
      update((s) => {
        if (!s.profile) return s;
        const p = s.perProfile[s.profile] ?? blankProfile();
        const has = p.watchlist.includes(slug);
        return {
          ...s,
          perProfile: {
            ...s.perProfile,
            [s.profile]: {
              ...p,
              watchlist: has ? p.watchlist.filter((x) => x !== slug) : [slug, ...p.watchlist],
            },
          },
        };
      });
    },
    [update],
  );

  const saveProgress = useCallback(
    (rec: Omit<ProgressRecord, "updatedAt">) => {
      update((s) => {
        if (!s.profile) return s;
        const p = s.perProfile[s.profile] ?? blankProfile();
        const others = p.progress.filter((x) => !(x.slug === rec.slug && x.episodeId === rec.episodeId));
        return {
          ...s,
          perProfile: {
            ...s.perProfile,
            [s.profile]: {
              ...p,
              progress: [{ ...rec, updatedAt: Date.now() }, ...others].slice(0, 40),
            },
          },
        };
      });
    },
    [update],
  );

  const clearProgress = useCallback(
    (slug: string) => {
      update((s) => {
        if (!s.profile) return s;
        const p = s.perProfile[s.profile] ?? blankProfile();
        return {
          ...s,
          perProfile: {
            ...s.perProfile,
            [s.profile]: { ...p, progress: p.progress.filter((x) => x.slug !== slug) },
          },
        };
      });
    },
    [update],
  );

  const rate = useCallback(
    (slug: string, stars: number) => {
      update((s) => {
        if (!s.profile) return s;
        const p = s.perProfile[s.profile] ?? blankProfile();
        return {
          ...s,
          perProfile: {
            ...s.perProfile,
            [s.profile]: { ...p, ratings: { ...p.ratings, [slug]: stars } },
          },
        };
      });
    },
    [update],
  );

  const setAutoNext = useCallback(
    (v: boolean) => {
      update((s) => {
        if (!s.profile) return s;
        const p = s.perProfile[s.profile] ?? blankProfile();
        return { ...s, perProfile: { ...s.perProfile, [s.profile]: { ...p, autoNext: v } } };
      });
    },
    [update],
  );

  const value = useMemo<SessionState>(
    () => ({
      user: state.user,
      profile: state.profile,
      profiles: state.profiles,
      ready,
      signIn,
      signOut,
      setProfile,
      addProfile,
      watchlist: active.watchlist,
      toggleWatchlist,
      progress: active.progress,
      saveProgress,
      clearProgress,
      ratings: active.ratings,
      rate,
      autoNext: active.autoNext,
      setAutoNext,
    }),
    [state, ready, active, signIn, signOut, setProfile, addProfile, toggleWatchlist, saveProgress, clearProgress, rate, setAutoNext],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession(): SessionState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}
