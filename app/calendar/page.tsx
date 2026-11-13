import type { Metadata } from "next";
import Link from "next/link";
import { getReleaseCalendar } from "@/lib/queries";

export const metadata: Metadata = {
  title: "កាលវិភាគភាគថ្មី",
  description: "កាលវិភាគចេញផ្សាយភាគថ្មីៗ។",
};

export const dynamic = "force-dynamic";

type Entry = Awaited<ReturnType<typeof getReleaseCalendar>>["recent"][number];

/** Rendered with a fixed locale/format so server and client HTML always match. */
const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
};
const fmtTime = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
};

function Row({ entry, upcoming }: { entry: Entry; upcoming: boolean }) {
  return (
    <li className="flex items-center gap-3 border-b border-line/60 px-4 py-3 last:border-0">
      <div className="w-20 shrink-0 text-center">
        <p className="text-[11px] uppercase tracking-wide text-mist/60">{fmtDate(entry.releaseAt)}</p>
        <p className="text-xs font-semibold text-gold">{fmtTime(entry.releaseAt)} UTC</p>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/api/poster/${entry.titleSlug}`} alt="" width={40} height={60} className="h-[60px] w-10 rounded object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{entry.titleNameKm}</p>
        <p className="truncate text-xs text-mist">
          រដូវ {entry.season} · ភាគ {entry.number} — {entry.nameKm}
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
        <Link href={`/watch/${entry.titleSlug}?ep=${entry.episodeId}`} className="shrink-0 text-xs text-gold hover:underline">
          មើល
        </Link>
      )}
    </li>
  );
}

export default async function CalendarPage() {
  const { upcoming, recent } = await getReleaseCalendar();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">កាលវិភាគភាគថ្មី</h1>
      <p className="mt-1 text-sm text-mist">
        ពេលវេលាបង្ហាញជា UTC។ កាលវិភាគអាចផ្លាស់ប្តូរបាន។
      </p>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-bold">នឹងចេញផ្សាយ</h2>
        {upcoming.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-mist">
            មិនទាន់មានភាគកំណត់ទុកទេ។
          </p>
        ) : (
          <ul className="overflow-hidden rounded-xl border border-line bg-ink-2">
            {upcoming.map((e) => <Row key={e.episodeId} entry={e} upcoming />)}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-2 text-lg font-bold">ចេញផ្សាយថ្មីៗ</h2>
        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-mist">
            មិនទាន់មានភាគចេញផ្សាយទេ។
          </p>
        ) : (
          <ul className="overflow-hidden rounded-xl border border-line bg-ink-2">
            {recent.map((e) => <Row key={e.episodeId} entry={e} upcoming={false} />)}
          </ul>
        )}
      </section>
    </div>
  );
}
