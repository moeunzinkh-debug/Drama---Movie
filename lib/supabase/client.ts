"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./env";

/**
 * Browser client. Safe to expose: it carries only the anon key, and every
 * query is constrained by Row Level Security.
 *
 * Auth state lives in cookies written by the server (see lib/supabase/server.ts)
 * so that server components see the same session.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl(), supabaseAnonKey());
}
