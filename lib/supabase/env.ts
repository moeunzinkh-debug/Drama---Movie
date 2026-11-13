/**
 * Supabase environment access.
 *
 * Only the URL and the *anon/publishable* key belong in the browser. The
 * service-role key is read exclusively by server code (lib/supabase/admin.ts)
 * and is never referenced through a NEXT_PUBLIC_ variable.
 *
 * ---------------------------------------------------------------------------
 * Why values are read through a computed key instead of `process.env.NAME`
 * ---------------------------------------------------------------------------
 * Next.js substitutes the literal expression `process.env.NEXT_PUBLIC_FOO` with
 * the value it knew at **build time**. On Cloudflare Workers the real values are
 * supplied by the Worker's runtime environment (dashboard Variables/Secrets), so
 * a literal reference bakes in whatever was present during `next build` —
 * normally `undefined`. The app then reports "Supabase is not configured" even
 * though the variables exist, because the compiled code can no longer see them.
 *
 * Reading through a computed key (`process.env[name]`) is not statically
 * analysable, so Next.js leaves it alone and the lookup happens at runtime,
 * where the Worker environment is available. This also keeps `next build`
 * working with no variables at all, which is what CI does.
 *
 * See lib/env.ts for the implementation.
 */
import { readEnv } from "@/lib/env";

function read(name: string): string | undefined {
  return readEnv(name);
}

function required(name: string, hint: string): string {
  const value = read(name);
  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to .env.local (see .env.example) and to the ` +
        `Cloudflare Worker's Variables and Secrets before deploying. ${hint}`,
    );
  }
  return value;
}

export function supabaseUrl(): string {
  return required(
    "NEXT_PUBLIC_SUPABASE_URL",
    "Find it in Supabase → Project Settings → API.",
  );
}

export function supabaseAnonKey(): string {
  return required(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "This is the anon/publishable key, not the service-role key.",
  );
}

export function siteUrl(): string {
  return read("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000";
}

export function adsEnabled(): boolean {
  return read("NEXT_PUBLIC_ADS_ENABLED") === "true";
}

/**
 * Names the configuration is missing, for a precise operator-facing message.
 * Empty when the app can talk to Supabase.
 */
export function missingSupabaseEnv(): string[] {
  return ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"].filter(
    (name) => !read(name),
  );
}

/** True when the app has enough configuration to talk to Supabase. */
export function isSupabaseConfigured(): boolean {
  return missingSupabaseEnv().length === 0;
}
