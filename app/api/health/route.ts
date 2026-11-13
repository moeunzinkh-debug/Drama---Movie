import { NextResponse } from "next/server";
import { isSupabaseConfigured, missingSupabaseEnv, siteUrl } from "@/lib/supabase/env";

/**
 * GET /api/health
 *
 * Uptime probe for Cloudflare / external monitors.
 *
 * Reports only what a public monitor may know: process liveness, whether the
 * database is reachable, and the deployed commit. It never returns secrets,
 * counts, or error text from the database.
 *
 * 200 = serving;  503 = degraded (database unreachable).
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const started = Date.now();

  let database: "ok" | "unconfigured" | "unreachable" = "unconfigured";

  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      // Cheapest possible round trip that still proves Postgres answered.
      const { error } = await supabase
        .from("categories")
        .select("slug", { head: true, count: "exact" })
        .limit(1);
      database = error ? "unreachable" : "ok";
    } catch {
      database = "unreachable";
    }
  }

  const healthy = database === "ok";

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      database,
      // Named, never valued: a monitor is allowed to know which setting is
      // missing, not what it holds. Blank when configuration is complete.
      missing: missingSupabaseEnv(),
      siteUrl: siteUrl(),
      // Surfaces which commit is live; injected at build time by CI if present.
      commit: process.env.CF_PAGES_COMMIT_SHA ?? process.env.GITHUB_SHA ?? "unknown",
      latencyMs: Date.now() - started,
      timestamp: new Date().toISOString(),
    },
    {
      status: healthy ? 200 : 503,
      headers: { "cache-control": "no-store" },
    },
  );
}
