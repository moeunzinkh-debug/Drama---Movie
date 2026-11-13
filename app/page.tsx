import Link from "next/link";
import HeroCarousel from "@/components/hero-carousel";
import Section from "@/components/section";
import ContinueWatching from "@/components/continue-watching";
import AdSlot from "@/components/ad-slot";
import { getFeatured, getTrending, listTitles, getRecentlyAdded, getCategories } from "@/lib/queries";
import { getActiveProfile } from "@/lib/auth";
import { getContinueWatching } from "@/lib/progress";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const profile = await getActiveProfile();

  const [hero, top, popularTitles, recent, categories, continueWatching] = await Promise.all([
    getFeatured(),
    getTrending(10),
    listTitles({ sort: "popular", limit: 24 }),
    getRecentlyAdded(6),
    getCategories(),
    profile ? getContinueWatching(profile.id) : Promise.resolve([]),
  ]);

  const movies = popularTitles.filter((t) => t.type === "movie").slice(0, 6);
  const dramas = popularTitles.filter((t) => t.type === "drama").slice(0, 6);
  const featuredTitles = hero.length ? hero : popularTitles.slice(0, 3);

  return (
    <>
      <HeroCarousel titles={featuredTitles} />
      <ContinueWatching items={continueWatching} />

      {popularTitles.length === 0 ? (
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-lg font-bold">មិនទាន់មានមាតិកាក្នុងមូលដ្ឋានទិន្នន័យទេ</h2>
          <p className="mt-2 text-sm leading-relaxed text-mist">
            បើអ្នកទើបបង្កើត Supabase project សូមរត់ migrations និង seed ជាមុន៖
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-line bg-ink-2 p-4 text-left text-xs text-gold/90">
{`supabase db push          # apply migrations
# ឬចម្លង 0001–0003 ចូល SQL Editor តាមលំដាប់`}
          </pre>
          <p className="mt-4 text-xs text-mist/60">
            សូមមើល <Link href="/about" className="text-gold underline">docs/SETUP_REAL_BACKEND.md</Link>
          </p>
        </section>
      ) : (
        <>
          <Section heading="កំពុងពេញនិយម" headingEn="Popular now" titles={popularTitles.slice(0, 6)} href="/browse?sort=popular" />
          <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
            <AdSlot placement="home-mid" format="leaderboard" />
          </div>
          <Section heading="កំពុងនិយម — Top 10" headingEn="Top 10 this week" titles={top} ranked />
          <Section heading="ភាពយន្ត" headingEn="Movies" titles={movies} href="/browse?type=movie" />
          <Section heading="រឿងភាគ" headingEn="Drama series" titles={dramas} href="/browse?type=drama" />
        </>
      )}

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <h2 className="mb-4 text-xl font-bold sm:text-2xl">ប្រភេទរឿង</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/browse?category=${encodeURIComponent(c.slug)}`}
                className="rounded-full border border-line px-4 py-2 text-sm text-mist transition hover:border-gold/50 hover:text-gold"
              >
                {c.name_km}
              </Link>
            ))}
          </div>
        </section>
      )}

      <Section heading="បន្ថែមថ្មីៗ" headingEn="Recently added" titles={recent} href="/browse?sort=newest" />

      <div className="mx-auto max-w-7xl px-4 pb-4 pt-2 sm:px-6">
        <AdSlot placement="home-bottom" format="leaderboard" />
      </div>
    </>
  );
}
