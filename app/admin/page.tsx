import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Admin overview — every number below is queried from Postgres.
 *
 * Ad revenue is deliberately absent: only provider-reported figures are valid,
 * and no provider is approved yet. Showing an invented number here would be
 * worse than showing nothing.
 */
export default async function AdminOverview() {
  await requireAdmin();
  const supabase = await createClient();

  const [
    accounts,
    profiles,
    titles,
    published,
    episodes,
    openReports,
    pendingRequests,
    auditLogs,
    adPlacements,
  ] = await Promise.all([
    supabase.from("accounts").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("titles").select("id", { count: "exact", head: true }),
    supabase.from("titles").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("episodes").select("id", { count: "exact", head: true }),
    supabase.from("content_reports").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("movie_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("admin_audit_logs")
      .select("id, actor_id, action, entity, entity_id, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase.from("ad_placements").select("id, page, enabled, format").order("id"),
  ]);

  const kpis = [
    { label: "គណនីចុះឈ្មោះ", value: accounts.count ?? 0 },
    { label: "ប្រវត្តិរូប", value: profiles.count ?? 0 },
    { label: "ចំណងជើងសរុប", value: titles.count ?? 0 },
    { label: "បានផ្សាយ", value: published.count ?? 0 },
    { label: "ភាគសរុប", value: episodes.count ?? 0 },
    { label: "របាយការណ៍បើក", value: openReports.count ?? 0 },
    { label: "សំណើរង់ចាំ", value: pendingRequests.count ?? 0 },
  ];

  return (
    <>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-line bg-ink-2 p-4">
            <p className="text-xs uppercase tracking-wider text-mist/60">{k.label}</p>
            <p className="mt-1 text-2xl font-black text-gold">{k.value}</p>
          </div>
        ))}
        <div className="rounded-xl border border-line bg-ink-2 p-4">
          <p className="text-xs uppercase tracking-wider text-mist/60">ចំណូលប៉ាន់ស្មាន</p>
          <p className="mt-1 text-sm text-white/60">—</p>
          <p className="mt-1 text-[11px] text-mist/50">
            មិនទាន់មានអ្នកផ្តល់សេវាពាណិជ្ជកម្ម។ ចំណូលត្រូវយកតែពីรายงานផ្លូវការ។
          </p>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-line bg-ink-2 p-4">
          <h2 className="text-sm font-semibold">កន្លែងពាណិជ្ជកម្ម</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {(adPlacements.data ?? []).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-2">
                <span className="text-mist">{p.id} · {p.page} · {p.format}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] ${p.enabled ? "bg-emerald-500/15 text-emerald-300" : "border border-line text-mist/60"}`}>
                  {p.enabled ? "បើក" : "បិទ"}
                </span>
              </li>
            ))}
          </ul>
          <Link href="/admin/ads" className="mt-3 inline-block text-xs text-gold hover:underline">គ្រប់គ្រង →</Link>
        </section>

        <section className="rounded-xl border border-line bg-ink-2 p-4">
          <h2 className="text-sm font-semibold">កំណត់ហេតុអ្នកគ្រប់គ្រង</h2>
          {(auditLogs.data ?? []).length === 0 ? (
            <p className="mt-3 text-xs text-mist/60">មិនទាន់មានសកម្មភាពទេ។</p>
          ) : (
            <ul className="mt-3 space-y-2 text-xs">
              {auditLogs.data!.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-2 border-b border-line/40 pb-1.5">
                  <span className="font-mono text-mist">{l.action}</span>
                  <span className="text-mist/50">{new Date(l.created_at).toISOString().slice(0, 16).replace("T", " ")}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
