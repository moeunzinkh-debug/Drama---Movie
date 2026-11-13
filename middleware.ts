import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes the Supabase session cookie on every request and blocks unauthenticated
 * access to /admin at the edge.
 *
 * This is a first gate only — every admin page, server action and query re-checks
 * the role server-side (lib/auth.ts). Middleware must never be the only control.
 */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let response = NextResponse.next({ request });

  // Without configuration there is no session to refresh; leave requests alone so
  // the app can render a clear "not configured" state.
  if (!url || !anon) return response;

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!user) {
      const login = request.nextUrl.clone();
      login.pathname = "/login";
      login.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(login);
    }

    // Role check here saves a render, but is repeated server-side downstream.
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("account_id", user.id);

    const isAdmin = (roles ?? []).some((r: { role: string }) =>
      ["admin", "moderator"].includes(r.role),
    );

    if (!isAdmin) {
      const denied = request.nextUrl.clone();
      denied.pathname = "/";
      denied.search = "?error=forbidden";
      return NextResponse.redirect(denied);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Skip static assets and image requests.
    "/((?!_next/static|_next/image|favicon.ico|api/poster|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)",
  ],
};
