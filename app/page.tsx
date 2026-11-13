import Link from "next/link";
import HeroCarousel from "@/components/hero-carousel";
import Section from "@/components/section";
import ContinueWatching from "@/components/continue-watching";
import AdSlot from "@/components/ad-slot";
import TitleCard from "@/components/title-card";
import {
  featured,
  trending,
  popular,
  recentlyAdded,
  publishedTitles,
} from "@/lib/data";
import { CATEGORIES, CATEGORIES_KM } from "@/lib/catalogue";

export default function HomePage() {
  const hero = featured();
  const top = trending(10);
  const movies = popular().filter((t) => t.type === "movie").slice(0, 6);
  const dramas = publishedTitles()
    .filter((t) => t.type === "drama")
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 6);

  return (
    <>
      <HeroCarousel titles={hero} />
      <ContinueWatching />

      <Section heading="កំពុងពេញនិយម" headingEn="Popular now" titles={popular(6)} href="/browse?sort=popular" />

      {/* Ad placement: between content sections, kept away from the hero. */}
      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
        <AdSlot placement="home-mid" format="leaderboard" />
      </div>

      <Section heading="កំពុងនិយម — Top 10" headingEn="Top 10 this week" titles={top} ranked />

      <Section heading="ភាពយន្ត" headingEn="Movies" titles={movies} href="/browse?type=movie" />
      <Section heading="រឿងភាគ" headingEn="Drama series" titles={dramas} href="/browse?type=drama" />

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h2 className="mb-4 text-xl font-bold sm:text-2xl">ប្រភេទរឿង</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/browse?category=${encodeURIComponent(c)}`}
              className="rounded-full border border-line px-4 py-2 text-sm text-mist transition hover:border-gold/50 hover:text-gold"
            >
              {CATEGORIES_KM[c] ?? c}
            </Link>
          ))}
        </div>
      </section>

      <Section heading="បន្ថែមថ្មីៗ" headingEn="Recently added" titles={recentlyAdded(6)} href="/browse?sort=newest" />

      {/* Ad placement: bottom of the page, after all content. */}
      <div className="mx-auto max-w-7xl px-4 pb-4 pt-2 sm:px-6">
        <AdSlot placement="home-bottom" format="leaderboard" />
      </div>
    </>
  );
}
