import type { Metadata } from "next";
import Link from "next/link";
import TitleCard from "@/components/title-card";
import { browse } from "@/lib/data";

export const metadata: Metadata = { title: "ស្វែងរក" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? browse({ q: query }) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">ស្វែងរក</h1>
      {query ? (
        <p className="mt-1 text-sm text-mist">
          លទ្ធផលសម្រាប់ “{query}” — {results.length} រឿង
        </p>
      ) : (
        <p className="mt-1 text-sm text-mist">បញ្ចូលឈ្មោះរឿង តារាសម្តែង ឬប្រភេទរឿង។</p>
      )}

      {query && results.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-line p-12 text-center">
          <p className="text-lg font-semibold">មិនឃើញលទ្ធផលទេ</p>
          <p className="mt-2 text-sm text-mist">
            អ្នកអាច{" "}
            <Link href="/request" className="text-gold underline underline-offset-4">
              ស្នើសុំរឿងនេះ
            </Link>{" "}
            ហើយយើងនឹងពិនិត្យមើល។
          </p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {results.map((t) => (
          <TitleCard key={t.slug} title={t} />
        ))}
      </div>
    </div>
  );
}
