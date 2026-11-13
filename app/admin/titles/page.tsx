import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import TitleAdminForm from "@/components/admin/title-form";
import TitleStatusControl from "@/components/admin/title-status";

export const dynamic = "force-dynamic";

export default async function AdminTitlesPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: titles }, { data: categories }, { data: countries }] = await Promise.all([
    supabase
      .from("titles")
      .select("id, slug, name, name_km, type, status, featured, popularity, rights_note, updated_at")
      .order("updated_at", { ascending: false })
      .limit(100),
    supabase.from("categories").select("slug, name_km").order("sort_order"),
    supabase.from("countries").select("slug, name_km").order("sort_order"),
  ]);

  return (
    <>
      <TitleAdminForm
        categories={(categories ?? []).map((c) => ({ slug: c.slug as string, label: c.name_km as string }))}
        countries={(countries ?? []).map((c) => ({ slug: c.slug as string, label: c.name_km as string }))}
      />

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold">ចំណងជើងទាំងអស់ ({titles?.length ?? 0})</h2>
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-3">
              <tr className="text-xs uppercase tracking-wider text-mist/60">
                <th className="px-3 py-2 font-medium">ចំណងជើង</th>
                <th className="px-3 py-2 font-medium">ប្រភេទ</th>
                <th className="px-3 py-2 font-medium">ស្ថានភាព</th>
                <th className="px-3 py-2 font-medium">សិទ្ធិ</th>
                <th className="px-3 py-2 font-medium">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {(titles ?? []).map((t) => (
                <tr key={t.id} className="border-t border-line/60">
                  <td className="px-3 py-2">
                    <Link href={`/title/${t.slug}`} className="hover:text-gold">{t.name_km}</Link>
                    <span className="ml-2 text-[11px] text-mist/40">{t.slug}</span>
                  </td>
                  <td className="px-3 py-2 text-mist">{t.type === "movie" ? "ភាពយន្ត" : "រឿងភាគ"}</td>
                  <td className="px-3 py-2">
                    <TitleStatusControl titleId={t.id} status={t.status} />
                  </td>
                  <td className="px-3 py-2">
                    {String(t.rights_note ?? "").trim() ? (
                      <span className="text-emerald-400 text-xs">✓</span>
                    ) : (
                      <span className="text-red-400 text-xs">ខ្វះ</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-mist/60">
                    {new Date(t.updated_at).toISOString().slice(0, 10)}
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
