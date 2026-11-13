import type { Metadata } from "next";
import Link from "next/link";
import { releaseCalendar } from "@/lib/data";

export const metadata: Metadata = {
  title: "កាលវិភាគភាគថ្មី",
  description: "កាលវិភាគចេញផ្សាយភាគថ្មីៗ។",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("km-KH", { weekday: "short", day: "numeric", month: "short" });

function Row({ entry, upcoming }: { entry: ReturnType<typeof releaseCalendar>["upcoming"][number]; upcoming: boolean }) {
  const { title, episode } = entry;
  return (
    <li className="flex items-center gap-3 border-b border-line/60 px-4 py-3 last:border-0">
      <div className="w-16 shrink-0 text-center">
        <p className="text-[11px] uppercase tracking-wide text-mist/60">{fmtDate(episode.releaseAt)}</p>
        <p className="text-xs font-semibold text-gold">
          {new Date(episode.releaseAt).toLocaleTimeString("km-KH", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/api/poster/${title.slug}`} alt="" width={40} height={60} className="h-[60px] w-10 rounded object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title.nameKm}</p>
        <p className="truncate text-xs text-mist">
          រដូវ {episode.season} · ភាគ {episode.number} — {episode.titleKm}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${
          upcoming ? "border border-gold/40 bg-gold/10 text-gold" : "border border-line text-mist"
        }`}
      >
        {upcoming ? "កំណត់ទុក" : "ចេញហើយ"}
      </span>
      {!upcoming && (
        <Link href={`/watch/${title.slug}?ep=${episode.id}`} className="shrink-0 text-xs text-gold hover:underline">
          មើល
        </Link>
      )}
    </li>
  );
}

export default function CalendarPage() {
  const { upcoming, recent } = releaseCalendar();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">កាលវិភាគភាគថ្មី</h1>
      <p className="mt-1 text-sm text-mist">
        ពេលវេលាបង្ហាញតាមម៉ោងក្នុងឧបករណ៍របស់អ្នក។ កាលវិភាគអាចផ្លាស់ប្តូរបាន។
      </p>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-bold">នឹងចេញផ្សាយ</h2>
        {upcoming.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-mist">
            មិនទាន់មានភាគកំណត់ទុកទេ។
          </p>
        ) : (
          <ul className="overflow-hidden rounded-xl border border-line bg-ink-2">
            {upcoming.map((e) => (
              <Row key={e.episode.id} entry={e} upcoming />
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-2 text-lg font-bold">ចេញផ្សាយថ្មីៗ</h2>
        <ul className="overflow-hidden rounded-xl border border-line bg-ink-2">
          {recent.map((e) => (
            <Row key={e.episode.id} entry={e} upcoming={false} />
          ))}
        </ul>
      </section>
    </div>
  );
}
