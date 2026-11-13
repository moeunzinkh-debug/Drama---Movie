"use client";

import { createContext, useContext } from "react";

/**
 * Session context.
 *
 * The session itself is resolved on the server (lib/auth.ts) from Supabase
 * cookies and passed down. There is no localStorage, no demo mode, and no
 * client-side "sign in" — signing in is a server action that starts Google
 * OAuth. This provider only distributes the server's answer to client
 * components so they can render optimistically, while every write still round
 * trips through a server action that re-checks ownership.
 */

export interface SessionUser {
  id: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface ProfileSummary {
  id: string;
  name: string;
  isKids: boolean;
}

export interface ProgressRecord {
  titleId: string;
  slug: string;
  titleNameKm: string;
  episodeId: string;
  season: number;
  number: number;
  episodeNameKm: string;
  positionSeconds: number;
  durationSeconds: number;
  updatedAt: string;
}

export interface SessionValue {
  user: SessionUser | null;
  isAdmin: boolean;
  profiles: ProfileSummary[];
  profile: ProfileSummary | null;
  watchlist: { titleId: string; slug: string }[];
  progress: ProgressRecord[];
  ratings: Record<string, number>;
}

const Ctx = createContext<SessionValue>({
  user: null,
  isAdmin: false,
  profiles: [],
  profile: null,
  watchlist: [],
  progress: [],
  ratings: {},
});

export function SessionProvider({
  value,
  children,
}: {
  value: SessionValue;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession(): SessionValue & { ready: boolean } {
  const value = useContext(Ctx);
  // `ready` is kept for compatibility with existing components; data is always
  // server-resolved now, so it is effectively always true once rendered.
  return { ...value, ready: true };
}
