"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addProfile, deleteProfile } from "@/actions/viewer";
import type { ProfileSummary } from "@/components/session-provider";

/**
 * Profile switching.
 *
 * The selection is stored in a cookie and re-validated on the server
 * (lib/auth.ts getActiveProfile): a cookie can only *choose* among profiles the
 * account actually owns, it cannot grant access to another account's profile.
 */
export default function ProfileManager({
  profiles,
  activeId,
}: {
  profiles: ProfileSummary[];
  activeId: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function select(id: string) {
    document.cookie = `cinemakh.profile=${id}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    router.refresh();
  }

  function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await addProfile(name);
      if (!res.ok) {
        setError(
          res.error.includes("profile limit")
            ? "អតិបរមា ៥ ប្រវត្តិរូបក្នុងមួយគណនី។"
            : res.error.includes("duplicate")
              ? "ឈ្មោះនេះមានរួចហើយ។"
              : "មិនអាចបន្ថែមប្រវត្តិរូបបានទេ។",
        );
        return;
      }
      setName("");
      router.refresh();
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      await deleteProfile(id);
      router.refresh();
    });
  }

  return (
    <section className="mt-5 rounded-xl border border-line bg-ink-2 p-4">
      <h2 className="text-sm font-semibold">ប្រវត្តិរូប</h2>
      <p className="mt-1 text-xs text-mist">
        មួយគណនីអាចមានប្រវត្តិរូបរហូតដល់ ៥ ដោយបញ្ជីរក្សាទុក និងប្រវត្តិមើលដាច់ដោយឡែក។
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {profiles.map((p) => (
          <span key={p.id} className="group inline-flex items-center">
            <button
              onClick={() => select(p.id)}
              aria-pressed={p.id === activeId}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                p.id === activeId ? "bg-gold font-semibold text-ink" : "border border-line text-mist hover:text-white"
              }`}
            >
              {p.name}
              {p.isKids && <span className="ml-1.5 text-[10px] opacity-70">កុមារ</span>}
            </button>
            {profiles.length > 1 && (
              <button
                onClick={() => remove(p.id)}
                disabled={pending}
                aria-label={`លុបប្រវត្តិរូប ${p.name}`}
                className="ml-1 rounded p-1 text-mist/40 transition hover:text-red-400"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            )}
          </span>
        ))}

        {profiles.length < 5 && (
          <form onSubmit={add} className="flex items-center gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ប្រវត្តិរូបថ្មី"
              aria-label="ឈ្មោះប្រវត្តិរូបថ្មី"
              maxLength={24}
              className="w-36 rounded-full border border-line bg-ink px-3 py-1.5 text-sm"
            />
            <button type="submit" disabled={pending} className="rounded-full border border-gold/40 px-3 py-1.5 text-sm text-gold disabled:opacity-50">
              + បន្ថែម
            </button>
          </form>
        )}
      </div>

      {error && <p role="alert" className="mt-2 text-xs text-red-400">{error}</p>}
    </section>
  );
}
