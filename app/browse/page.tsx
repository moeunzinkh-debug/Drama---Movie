import type { Metadata } from "next";
import { Suspense } from "react";
import TitleCard from "@/components/title-card";
import FilterBar from "@/components/filter-bar";
import AdSlot from "@/components/ad-slot";
import { listTitles, getCategories, getCountries, getYears } from "@/lib/queries";

export const metadata: Metadata = {
  title: "រកមើលភាពយន្ត និងរឿងភាគ",
  description: "រកមើលតាមប្រភេទ ប្រទេស ឆ្នាំ និងការតម្រៀប។",
};

export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function BrowsePage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const one = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const filters = {
    q: one("q"),
    type: one("type"),
    category: one("category"),
    country: one("country"),
    year: one("year"),
    sort: one("sort"),
  };

  const [results, categories, countries, years] = await Promise.all([
    listTitles({ ...filters, limit: 60 }),
    getCategories(),
    getCountries(),
    getYears(),
  ]);

  const heading =
    filters.type === "movie" ? "ភាពយន្ត" : filters.type === "drama" ? "រឿងភាគ" : "រកមើលទាំងអស់";

  const chips = [
    filters.category && (categories.find((c) => c.slug === filters.category)?.name_km ?? filters.category),
    filters.country && (countries.find((c) => c.slug === filters.country)?.name_km ?? filters.country),
    filters.year,
  ].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{heading}</h1>
        <p className="text-sm text-mist">
          រកឃើញ {results.length} រឿង{chips.length ? ` · ${chips.join(" · ")}` : ""}
        </p>
      </div>

      <div className="mt-5">
        <Suspense fallback={<div className="h-10" />}>
          <FilterBar
            categories={categories.map((c) => ({ slug: c.slug, label: c.name_km }))}
            countries={countries.map((c) => ({ slug: c.slug, label: c.name_km }))}
            years={years}
          />
        </Suspense>
      </div>

      {results.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-line p-12 text-center">
          <p className="text-lg font-semibold">រកមិនឃើញរឿងដែលត្រូវនឹងតម្រងទេ</p>
          <p className="mt-2 text-sm text-mist">សូមព្យាយាមដោះតម្រង ឬស្នើសុំរឿងដែលអ្នកចង់មើល។</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {results.map((t) => (
            <TitleCard key={t.slug} title={t} />
          ))}
        </div>
      )}

      {results.length > 6 && (
        <div className="mt-10">
          <AdSlot placement="browse-mid" format="leaderboard" />
        </div>
      )}
    </div>
  );
}
