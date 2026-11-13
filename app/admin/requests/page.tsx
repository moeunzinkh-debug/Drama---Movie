import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import RequestStatusControl from "@/components/admin/request-status";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: requests }, { data: reports }] = await Promise.all([
    supabase
      .from("movie_requests")
      .select("id, title, country, year, notes, status, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("content_reports")
      .select("id, reason, status, created_at, titles(name_km), episodes(name_km)")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  type ReportRow = {
    id: string;
    reason: string;
    status: string;
    created_at: string;
    titles: { name_km: string } | null;
    episodes: { name_km: string } | null;
  };

  return (
    <>
      <section>
        <h2 className="mb-3 text-sm font-semibold">សំណើរឿង ({requests?.length ?? 0})</h2>
        {!requests?.length ? (
          <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-mist">
            មិនទាន់មានសំណើទេ។
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-3">
                <tr className="text-xs uppercase tracking-wider text-mist/60">
                  <th className="px-3 py-2 font-medium">រឿង</th>
                  <th className="px-3 py-2 font-medium">ព័ត៌មាន</th>
                  <th className="px-3 py-2 font-medium">ស្ថានភាព</th>
                  <th className="px-3 py-2 font-medium">កាលបរិច្ឆេទ</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-t border-line/60">
                    <td className="px-3 py-2">
                      <p>{r.title}</p>
                      {r.notes && <p className="text-[11px] text-mist/60">{r.notes}</p>}
                    </td>
                    <td className="px-3 py-2 text-xs text-mist">
                      {[r.country, r.year].filter(Boolean).join(" · ") || "—"}
                    </td>
                    <td className="px-3 py-2"><RequestStatusControl requestId={r.id} status={r.status} /></td>
                    <td className="px-3 py-2 text-xs text-mist/60">{new Date(r.created_at).toISOString().slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold">របាយការណ៍វីដេអូខូច ({reports?.length ?? 0})</h2>
        {!reports?.length ? (
          <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-mist">
            មិនទាន់មានរបាយការណ៍ទេ។
          </p>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line">
            {((reports ?? []) as unknown as ReportRow[]).map((r) => (
              <li key={r.id} className="bg-ink-2 px-4 py-3">
                <p className="text-sm">
                  {r.titles?.name_km ?? "—"} {r.episodes?.name_km ? `· ${r.episodes.name_km}` : ""}
                </p>
                <p className="mt-0.5 text-xs text-mist">{r.reason}</p>
                <p className="mt-1 text-[11px] text-mist/50">{new Date(r.created_at).toISOString().slice(0, 16).replace("T", " ")}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
