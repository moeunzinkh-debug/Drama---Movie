import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "ផ្ទាំងគ្រប់គ្រង",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const TABS = [
  { href: "/admin", label: "ទូទៅ" },
  { href: "/admin/titles", label: "មាតិកា" },
  { href: "/admin/episodes", label: "ភាគ" },
  { href: "/admin/requests", label: "សំណើ" },
  { href: "/admin/ads", label: "ពាណិជ្ជកម្ម" },
];

/**
 * Authorisation for the whole admin area.
 *
 * Middleware already redirects anonymous users, but this check runs again here
 * because middleware can be misconfigured and must never be the only gate. Any
 * child page or server action additionally calls requireAdmin() itself.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-xl font-bold">មិនទាន់កំណត់ Supabase</h1>
        <p className="mt-2 text-sm text-mist">
          ផ្ទាំងគ្រប់គ្រងត្រូវការមូលដ្ឋានទិន្នន័យ។ សូមកំណត់ <code>NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          និង <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> ជាមុន។
        </p>
      </div>
    );
  }

  // requireAdmin() redirects on failure; redirect() must not be caught here.
  await requireAdmin();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">ផ្ទាំងគ្រប់គ្រង</h1>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300">
          អ្នកមានសិទ្ធិអ្នកគ្រប់គ្រង
        </span>
      </div>

      <nav className="mt-4 flex flex-wrap gap-1 border-b border-line pb-2" aria-label="ផ្នែកគ្រប់គ្រង">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-md px-3 py-2 text-sm text-mist transition hover:bg-white/5 hover:text-white"
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6">{children}</div>
    </div>
  );
}
