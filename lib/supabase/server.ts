import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
import { supabaseAnonKey, supabaseUrl } from "./env";

/**
 * Server client bound to the request's cookies.
 *
 * Uses the anon key with the user's session — RLS still applies. `cache()` makes
 * the client request-scoped instead of module-scoped, which matters on
 * Cloudflare Workers where module scope can be reused across requests.
 */
export const createClient = cache(async () => {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component that cannot mutate cookies.
          // middleware.ts refreshes the session instead, so this is safe to ignore.
        }
      },
    },
  });
});
