import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface Account {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  suspended_at: string | null;
}

export interface CurrentUser {
  account: Account;
  isAdmin: boolean;
  session: { user: { id: string } };
}

/**
 * Resolves the signed-in account from the server session.
 *
 * The admin flag is read from `user_roles` through the caller's RLS-scoped
 * client, so a tampered cookie or client payload cannot grant admin. Any code
 * that needs elevated privileges must pass through here first.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  // Unconfigured deployments render signed-out instead of crashing every page.
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: account }, { data: roles }] = await Promise.all([
    supabase
      .from("accounts")
      .select("id, email, display_name, avatar_url, suspended_at")
      .eq("id", user.id)
      .maybeSingle<Account>(),
    supabase.from("user_roles").select("role").eq("account_id", user.id),
  ]);

  return {
    account:
      account ?? {
        id: user.id,
        email: user.email ?? null,
        display_name: null,
        avatar_url: null,
        suspended_at: null,
      },
    isAdmin: (roles ?? []).some((r: { role: string }) =>
      ["admin", "moderator"].includes(r.role),
    ),
    session: { user: { id: user.id } },
  };
});

/**
 * Returns the signed-in account or redirects to /login.
 *
 * Used by server actions (where throwing is also acceptable) and by protected
 * pages. `redirect()` throws a control-flow signal that must not be swallowed by
 * a try/catch — see app/admin/layout.tsx.
 */
export async function requireUser(nextPath = "/"): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  if (user.account.suspended_at) redirect("/?error=suspended");
  return user;
}

/** Returns the account or redirects. Never returns a non-admin. */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (!user.isAdmin) redirect("/?error=forbidden");
  if (user.account.suspended_at) redirect("/?error=suspended");
  return user;
}

/** The active profile for this request, chosen by cookie and verified server-side. */
export const getActiveProfile = cache(
  async (): Promise<{ id: string; name: string; is_kids: boolean } | null> => {
    if (!isSupabaseConfigured()) return null;

    const user = await getCurrentUser();
    if (!user) return null;

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const wanted = cookieStore.get("cinemakh.profile")?.value;

    const supabase = await createClient();
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name, is_kids")
      .eq("account_id", user.account.id)
      .order("created_at", { ascending: true });

    if (!profiles?.length) return null;

    // The cookie only *selects* among profiles the account actually owns.
    return profiles.find((p) => p.id === wanted) ?? profiles[0];
  },
);

export type { SupabaseClient };
