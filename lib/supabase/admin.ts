import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";

/**
 * Service-role client — bypasses RLS.
 *
 * NEVER import this from a Client Component or expose its output to the browser.
 * Use only for operations that legitimately need to cross ownership boundaries:
 * minting video tokens, health checks, seeding, and first-admin bootstrap.
 *
 * Every call site must perform its own authorisation check first.
 */
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. This key is server-only — add it as a " +
        "Cloudflare Secret (never as a NEXT_PUBLIC_ variable).",
    );
  }
  return createSupabaseClient(supabaseUrl(), serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
