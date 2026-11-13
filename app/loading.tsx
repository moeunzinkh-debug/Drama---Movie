/** Shown while a server component streams. Keeps the layout stable. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6" role="status" aria-live="polite">
      <span className="sr-only">កំពុងផ្ទុក…</span>
      <div className="h-8 w-48 animate-pulse rounded-lg bg-ink-3" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-line/60 bg-ink-2">
            <div className="aspect-[2/3] animate-pulse bg-ink-3" />
            <div className="p-3">
              <div className="h-3 w-3/4 animate-pulse rounded bg-ink-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
