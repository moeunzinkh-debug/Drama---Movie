"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/components/session-provider";
import { getTitle, findEpisode } from "@/lib/data";
import TitleCard from "@/components/title-card";

export default function MyListPage() {
  const { ready, user, watchlist, progress, profiles, profile, setProfile, addProfile, signIn } = useSession();
  const [newProfile, setNewProfile] = useState("");

  if (!ready) return <div className="py-24 text-center text-sm text-mist">កំពុងផ្ទុក…</div>;

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-black">បញ្ជីរបស់ខ្ញុំ</h1>
        <p className="mt-2 text-sm text-mist">ចូលដើម្បីមើលបញ្ជីរក្សាទុក និងប្រវត្តិមើលរបស់អ្នក។</p>
        <button onClick={() => signIn("អ្នកមើល")} className="mt-6 rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink">
          ចូលដោយ Google
        </button>
        <p className="mt-2 text-[11px] text-mist/50">(ការចូលសាកល្បង)</p>
      </div>
    );
  }

  const list = watchlist.map(getTitle).filter((t): t is NonNullable<typeof t> => !!t);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">បញ្ជីរបស់ខ្ញុំ</h1>

      {/* Profiles */}
      <section className="mt-5 rounded-xl border border-line bg-ink-2 p-4">
        <h2 className="text-sm font-semibold">ប្រវត្តិរូប</h2>
        <p className="mt-1 text-xs text-mist">
          មួយគណនីអាចមានប្រវត្តិរូបច្រើន ដោយបញ្ជីរក្សាទុក និងប្រវត្តិមើលដាច់ដោយឡែក។
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {profiles.map((p) => (
            <button
              key={p}
              onClick={() => setProfile(p)}
              aria-pressed={p === profile}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                p === profile ? "bg-gold font-semibold text-ink" : "border border-line text-mist hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
          {profiles.length < 5 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addProfile(newProfile);
                setNewProfile("");
              }}
              className="flex items-center gap-2"
            >
              <input
                value={newProfile}
                onChange={(e) => setNewProfile(e.target.value)}
                placeholder="ប្រវត្តិរូបថ្មី"
                aria-label="ឈ្មោះប្រវត្តិរូបថ្មី"
                className="w-36 rounded-full border border-line bg-ink px-3 py-1.5 text-sm"
              />
              <button type="submit" className="rounded-full border border-gold/40 px-3 py-1.5 text-sm text-gold">
                + បន្ថែម
              </button>
            </form>
          )}
        </div>
      </section>

      <h2 className="mt-8 text-lg font-bold">រក្សាទុក ({list.length})</h2>
      {list.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-line p-10 text-center text-sm text-mist">
          មិនទាន់មានរឿងក្នុងបញ្ជីទេ។ <Link href="/browse" className="text-gold underline underline-offset-4">រកមើលរឿង</Link>
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {list.map((t) => (
            <TitleCard key={t.slug} title={t} />
          ))}
        </div>
      )}

      <h2 className="mt-8 text-lg font-bold">ប្រវត្តិមើល</h2>
      {progress.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-line p-10 text-center text-sm text-mist">
          មិនទាន់មានប្រវត្តិមើលទេ។
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line">
          {progress.map((p) => {
            const t = getTitle(p.slug);
            const e = t ? findEpisode(t, p.episodeId) : undefined;
            if (!t || !e) return null;
            const pct = Math.min(100, Math.round((p.position / Math.max(p.duration, 1)) * 100));
            return (
              <li key={`${p.slug}-${p.episodeId}`} className="flex items-center gap-3 bg-ink-2 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.nameKm}</p>
                  <p className="truncate text-xs text-mist">
                    រដូវ {e.season} ភាគ {e.number} · មើលរួច {pct}%
                  </p>
                </div>
                <Link href={`/watch/${t.slug}?ep=${e.id}`} className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs hover:text-gold">
                  បន្តមើល
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
