"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useSession } from "@/components/session-provider";

const NAV = [
  { href: "/", label: "ទំព័រដើម" },
  { href: "/browse?type=movie", label: "ភាពយន្ត" },
  { href: "/browse?type=drama", label: "រឿងភាគ" },
  { href: "/calendar", label: "កាលវិភាគ" },
  { href: "/my-list", label: "បញ្ជីរបស់ខ្ញុំ" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAdmin } = useSession();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => setOpen(false), [pathname]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  function signOut() {
    startTransition(async () => {
      // Real sign-out: clears the Supabase session cookie server-side.
      await fetch("/auth/signout", { method: "POST" });
      router.push("/");
      router.refresh();
    });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-ink/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="CINEMA KH — ទំព័រដើម">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold font-bold text-ink">C</span>
          <span className="hidden text-lg font-bold tracking-tight sm:block">
            CINEMA<span className="text-gold">KH</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="ម៉ឺនុយមេ">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-mist transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-md px-3 py-2 text-sm font-semibold text-gold transition hover:bg-gold/10"
            >
              គ្រប់គ្រង
            </Link>
          )}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden md:block" role="search">
          <label className="sr-only" htmlFor="site-search">ស្វែងរករឿង</label>
          <input
            id="site-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ស្វែងរករឿង…"
            className="w-48 rounded-full border border-line bg-ink-2 px-4 py-2 text-sm outline-none transition placeholder:text-mist/70 focus:w-64 focus:border-gold/60"
          />
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/my-list"
                className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-mist transition hover:border-gold/50 hover:text-white sm:flex"
              >
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt="" width={20} height={20} className="h-5 w-5 rounded-full" />
                ) : (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-gold/20 text-[11px] font-bold text-gold">
                    {(profile?.name ?? user.displayName ?? "U").slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span className="max-w-[8rem] truncate">{profile?.name ?? user.displayName ?? "គណនី"}</span>
              </Link>
              <button
                onClick={signOut}
                disabled={pending}
                className="rounded-full border border-line px-3 py-1.5 text-sm text-mist transition hover:border-white/30 hover:text-white disabled:opacity-50"
              >
                {pending ? "…" : "ចាកចេញ"}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink transition hover:bg-gold-dim"
            >
              ចូលដោយ Google
            </Link>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="បើកម៉ឺនុយ"
            className="grid h-9 w-9 place-items-center rounded-md border border-line text-mist lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-line bg-ink-2 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3" aria-label="ម៉ឺនុយទូរស័ព្ទ">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-md px-2 py-3 text-sm text-mist hover:bg-white/5 hover:text-white">
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="rounded-md px-2 py-3 text-sm font-semibold text-gold hover:bg-gold/10">
                គ្រប់គ្រង
              </Link>
            )}
            <form onSubmit={submitSearch} className="mt-2 px-2 pb-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ស្វែងរករឿង…"
                aria-label="ស្វែងរករឿង"
                className="w-full rounded-full border border-line bg-ink px-4 py-2 text-sm"
              />
            </form>
          </nav>
        </div>
      )}
    </header>
  );
}
