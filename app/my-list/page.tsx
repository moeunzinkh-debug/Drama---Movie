import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser, getActiveProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getContinueWatching } from "@/lib/progress";
import TitleCard from "@/components/title-card";
import ProfileManager from "@/components/profile-manager";
import type { Title } from "@/lib/types";

export const metadata: Metadata = { title: "បញ្ជីរបស់ខ្ញុំ" };
export const dynamic = "force-dynamic";

export default async function MyListPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-black">បញ្ជីរបស់ខ្ញុំ</h1>
        <p className="mt-2 text-sm text-mist">ចូលដើម្បីមើលបញ្ជីរក្សាទុក និងប្រវត្តិមើលរបស់អ្នក។</p>
        <Link href="/login?next=/my-list" className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink">
          ចូលដោយ Google
        </Link>
      </div>
    );
  }

  const profile = await getActiveProfile();
  const supabase = await createClient();

  const [{ data: profiles }, watchlistRes, progress] = await Promise.all([
    supabase.from("profiles").select("id, name, is_kids").eq("account_id", user.account.id).order("created_at"),
    profile
      ? supabase
          .from("watchlists")
          .select("titles!inner(id, slug, name, name_km, alt_title, synopsis, synopsis_km, tagline, tagline_km, type, country_slug, release_year, age_rating, cast_members, subtitle_langs, palette, featured, trending_rank, popularity, created_at)")
          .eq("profile_id", profile.id)
          .order("added_at", { ascending: false })
      : Promise.resolve({ data: [] as never[] }),
    profile ? getContinueWatching(profile.id, 20) : Promise.resolve([]),
  ]);

  type WatchlistRow = { titles: Record<string, unknown> };
  const list: Title[] = ((watchlistRes.data ?? []) as unknown as WatchlistRow[]).map((row) => {
    const t = row.titles;
    return {
      id: t.id as string,
      slug: t.slug as string,
      name: t.name as string,
      nameKm: t.name_km as string,
      altTitle: (t.alt_title as string) ?? undefined,
      type: t.type as "movie" | "drama",
      country: (t.country_slug as string) ?? "",
      year: (t.release_year as number) ?? 0,
      categories: [],
      ageRating: t.age_rating as string,
      tagline: t.tagline as string,
      taglineKm: t.tagline_km as string,
      synopsis: t.synopsis as string,
      synopsisKm: t.synopsis_km as string,
      cast: (t.cast_members as string[]) ?? [],
      subtitleLanguages: (t.subtitle_langs as string[]) ?? [],
      featured: Boolean(t.featured),
      trendingRank: (t.trending_rank as number) ?? undefined,
      popularity: (t.popularity as number) ?? 0,
      addedAt: (t.created_at as string) ?? new Date().toISOString(),
      palette: ((t.palette as string[]) ?? ["#101018", "#3a3a55"]) as [string, string],
      seasons: [],
      status: "published" as const,
      rightsNote: "",
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">បញ្ជីរបស់ខ្ញុំ</h1>

      <ProfileManager
        profiles={(profiles ?? []).map((p) => ({ id: p.id as string, name: p.name as string, isKids: Boolean(p.is_kids) }))}
        activeId={profile?.id ?? null}
      />

      <h2 className="mt-8 text-lg font-bold">រក្សាទុក ({list.length})</h2>
      {list.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-line p-10 text-center text-sm text-mist">
          មិនទាន់មានរឿងក្នុងបញ្ជីទេ។{" "}
          <Link href="/browse" className="text-gold underline underline-offset-4">រកមើលរឿង</Link>
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {list.map((t) => <TitleCard key={t.slug} title={t} />)}
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
            const pct = Math.min(100, Math.round((p.positionSeconds / Math.max(p.durationSeconds, 1)) * 100));
            return (
              <li key={`${p.slug}-${p.episodeId}`} className="flex items-center gap-3 bg-ink-2 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.titleNameKm}</p>
                  <p className="truncate text-xs text-mist">
                    រដូវ {p.season} ភាគ {p.number} · មើលរួច {pct}%
                  </p>
                </div>
                <Link href={`/watch/${p.slug}?ep=${p.episodeId}`} className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs hover:text-gold">
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
