import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import EpisodeForm from "@/components/admin/episode-form";

export const dynamic = "force-dynamic";

export default async function AdminEpisodesPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: titles }, { data: episodes }] = await Promise.all([
    supabase.from("titles").select("id, slug, name_km").order("name_km").limit(200),
    supabase
      .from("episodes")
      .select("id, number, name, name_km, release_at, seasons!inner(number, titles!inner(slug, name_km)), video_assets(id, provider)")
      .order("release_at", { ascending: false })
      .limit(60),
  ]);

  type Row = {
    id: string;
    number: number;
    name: string;
    name_km: string;
    release_at: string;
    seasons: { number: number; titles: { slug: string; name_km: string } };
    video_assets: { id: string; provider: string }[] | null;
  };

  return (
    <>
      <EpisodeForm titles={(titles ?? []).map((t) => ({ id: t.id as string, label: t.name_km as string }))} />

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold">ភាគថ្មីៗ</h2>
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-3">
              <tr className="text-xs uppercase tracking-wider text-mist/60">
                <th className="px-3 py-2 font-medium">ចំណងជើង</th>
                <th className="px-3 py-2 font-medium">ភាគ</th>
                <th className="px-3 py-2 font-medium">ចេញផ្សាយ</th>
                <th className="px-3 py-2 font-medium">វីដេអូ</th>
              </tr>
            </thead>
            <tbody>
              {((episodes ?? []) as unknown as Row[]).map((e) => (
                <tr key={e.id} className="border-t border-line/60">
                  <td className="px-3 py-2">{e.seasons.titles.name_km}</td>
                  <td className="px-3 py-2 text-mist">S{e.seasons.number}E{e.number} · {e.name_km}</td>
                  <td className="px-3 py-2 text-xs text-mist/70">{new Date(e.release_at).toISOString().slice(0, 16).replace("T", " ")}</td>
                  <td className="px-3 py-2">
                    {(e.video_assets ?? []).length > 0 ? (
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300">
                        {e.video_assets![0].provider === "cloudflare_stream" ? "Stream" : "HLS"}
                      </span>
                    ) : (
                      <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[11px] text-red-300">
                        គ្មាន
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
