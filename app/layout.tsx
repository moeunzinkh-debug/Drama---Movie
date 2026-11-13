import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { SessionProvider, type SessionValue } from "@/components/session-provider";
import { getCurrentUser, getActiveProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, siteUrl } from "@/lib/supabase/env";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "CINEMA KH — មើលភាពយន្ត និងរឿងភាគខ្មែរ",
    template: "%s · CINEMA KH",
  },
  description:
    "CINEMA KH — វេទិកាមើលភាពយន្ត និងរឿងភាគឥតគិតថ្លៃសម្រាប់ទស្សនិកជនខ្មែរ។",
  applicationName: "CINEMA KH",
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "CINEMA KH",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "CINEMA KH",
    description: "ភាពយន្ត និងរឿងភាគខ្មែរ — មើលបានឥតគិតថ្លៃ",
    type: "website",
    locale: "km_KH",
    siteName: "CINEMA KH",
    url: "/",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "CINEMA KH" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CINEMA KH",
    description: "ភាពយន្ត និងរឿងភាគខ្មែរ — មើលបានឥតគិតថ្លៃ",
    images: ["/og-default.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#07070c",
  width: "device-width",
  initialScale: 1,
};

/**
 * Loads the real session for this request.
 *
 * Everything the client sees about identity comes from here — resolved from
 * Supabase cookies on the server. Failures degrade to "signed out" rather than
 * crashing the whole layout.
 */
async function loadSession(): Promise<SessionValue> {
  const empty: SessionValue = {
    user: null,
    isAdmin: false,
    profiles: [],
    profile: null,
    watchlist: [],
    progress: [],
    ratings: {},
  };

  if (!isSupabaseConfigured()) return empty;

  try {
    const [user, activeProfile] = await Promise.all([
      getCurrentUser(),
      getActiveProfile(),
    ]);

    if (!user) return empty;

    const supabase = await createClient();

    const [profilesRes, watchlistRes, ratingsRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, name, is_kids")
        .eq("account_id", user.account.id)
        .order("created_at"),
      activeProfile
        ? supabase
            .from("watchlists")
            .select("title_id, titles!inner(slug)")
            .eq("profile_id", activeProfile.id)
        : Promise.resolve({ data: [] as never[] }),
      activeProfile
        ? supabase.from("ratings").select("title_id, stars").eq("profile_id", activeProfile.id)
        : Promise.resolve({ data: [] as never[] }),
    ]);

    const profiles = (profilesRes.data ?? []).map((p) => ({
      id: p.id as string,
      name: p.name as string,
      isKids: Boolean(p.is_kids),
    }));

    const watchlist = ((watchlistRes.data ?? []) as unknown as {
      title_id: string;
      titles: { slug: string };
    }[]).map((w) => ({ titleId: w.title_id, slug: w.titles.slug }));

    const ratings = Object.fromEntries(
      ((ratingsRes.data ?? []) as { title_id: string; stars: number }[]).map((r) => [
        r.title_id,
        r.stars,
      ]),
    );

    return {
      user: {
        id: user.account.id,
        email: user.account.email,
        displayName: user.account.display_name,
        avatarUrl: user.account.avatar_url,
      },
      isAdmin: user.isAdmin,
      profiles,
      profile: activeProfile
        ? { id: activeProfile.id, name: activeProfile.name, isKids: activeProfile.is_kids }
        : null,
      watchlist,
      progress: [],
      ratings,
    };
  } catch {
    return empty;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await loadSession();

  return (
    <html lang="km">
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-ink"
        >
          រំលងទៅមាតិកាសំខាន់
        </a>
        <SessionProvider value={session}>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </SessionProvider>
      </body>
    </html>
  );
}
