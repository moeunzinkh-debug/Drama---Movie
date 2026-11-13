import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { SessionProvider } from "@/components/session-provider";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CINEMA KH — មើលភាពយន្ត និងរឿងភាគខ្មែរ",
    template: "%s · CINEMA KH",
  },
  description:
    "CINEMA KH — វេទិកាមើលភាពយន្ត និងរឿងភាគឥតគិតថ្លៃសម្រាប់ទស្សនិកជនខ្មែរ។ មិនទាន់ដាក់ផ្សាយពាណិជ្ជកម្មទេ។",
  applicationName: "CINEMA KH",
  robots: { index: true, follow: true },
  openGraph: {
    title: "CINEMA KH",
    description: "ភាពយន្ត និងរឿងភាគខ្មែរ — មើលបានឥតគិតថ្លៃ",
    type: "website",
    locale: "km_KH",
  },
};

export const viewport: Viewport = {
  themeColor: "#07070c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="km">
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-ink"
        >
          រំលងទៅមាតិកាសំខាន់
        </a>
        <SessionProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </SessionProvider>
      </body>
    </html>
  );
}
