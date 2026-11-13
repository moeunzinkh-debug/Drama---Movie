"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * Resolves the public origin used for the OAuth redirect.
 *
 * This deliberately prefers the *request* origin over NEXT_PUBLIC_SITE_URL.
 *
 * Next.js inlines `NEXT_PUBLIC_*` at build time, so a production build made
 * without the variable freezes `http://localhost:3000` into the bundle — which
 * sends Google a redirect_to that Supabase rejects and the visitor lands back on
 * /login with no explanation. Reading the request headers instead always yields
 * the host the visitor is actually using, and it keeps working on the
 * `*.workers.dev` URL, a custom domain, and preview deployments alike.
 *
 * NEXT_PUBLIC_SITE_URL remains the fallback for environments that cannot supply
 * forwarded headers.
 */
async function resolveOrigin(): Promise<string> {
  const h = await headers();

  const forwardedHost = h.get("x-forwarded-host") ?? h.get("host");
  if (forwardedHost) {
    const proto =
      h.get("x-forwarded-proto") ??
      (forwardedHost.startsWith("localhost") || forwardedHost.startsWith("127.0.0.1")
        ? "http"
        : "https");
    return `${proto}://${forwardedHost}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

/**
 * Starts the real Google OAuth flow through Supabase Auth.
 *
 * The user is redirected to Google, returns to /auth/callback, and the session
 * is written as cookies by lib/supabase/server.ts. No demo/localStorage path.
 */
export async function signInWithGoogle(formData: FormData) {
  const supabase = await createClient();
  const next = (formData.get("next") as string) || "/";

  const origin = await resolveOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      queryParams: { access_type: "offline", prompt: "select_account" },
    },
  });

  if (error || !data.url) {
    redirect(`/login?error=${encodeURIComponent(error?.message ?? "oauth_failed")}`);
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
