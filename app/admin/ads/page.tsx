import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import AdToggle from "@/components/admin/ad-toggle";
import { adsEnabled } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function AdminAdsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: placements } = await supabase
    .from("ad_placements")
    .select("id, page, format, enabled, notes")
    .order("id");

  const providerEnabled = adsEnabled();

  return (
    <>
      <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 text-xs leading-relaxed text-gold/90">
        <strong className="block text-sm">គោលការណ៍ពាណិជ្ជកម្ម</strong>
        មិនត្រូវបើកពាណិជ្ជកម្ម រហូតដល់អ្នកផ្តល់សេវាអនុម័តគេហទំព័រនេះ។ កុំដាក់ពាណិជ្ជកម្មលើ ឬក្នុង player
        ឬជិតប៊ូតុង Play / ភាគបន្ទាប់។ មិនត្រូវបង្កើតទិន្នន័យចំណូល ឬការចុចក្នុង database ឡើយ —
        ចំណូលត្រូវយកតែពីรายงานផ្លូវការរបស់អ្នកផ្តល់សេវា។
      </div>

      <div className={`mt-4 rounded-xl border p-4 text-xs ${providerEnabled ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-200" : "border-line bg-ink-2 text-mist"}`}>
        <strong className="block text-sm">ស្ថានភាពអ្នកផ្តល់សេវា</strong>
        {providerEnabled
          ? "NEXT_PUBLIC_ADS_ENABLED=true — អាចបើកកន្លែងពាណិជ្ជកម្មបាន។"
          : "NEXT_PUBLIC_ADS_ENABLED=false — ការបើកកន្លែងពាណិជ្ជកម្មត្រូវបានហាមឃាត់។"}
      </div>

      <section className="mt-6 overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-3">
            <tr className="text-xs uppercase tracking-wider text-mist/60">
              <th className="px-3 py-2 font-medium">កន្លែង</th>
              <th className="px-3 py-2 font-medium">ទំព័រ</th>
              <th className="px-3 py-2 font-medium">ទម្រង់</th>
              <th className="px-3 py-2 font-medium">ស្ថានភាព</th>
            </tr>
          </thead>
          <tbody>
            {(placements ?? []).map((p) => (
              <tr key={p.id} className="border-t border-line/60">
                <td className="px-3 py-2 font-mono text-xs">{p.id}</td>
                <td className="px-3 py-2 text-mist">{p.page}</td>
                <td className="px-3 py-2 text-mist">{p.format}</td>
                <td className="px-3 py-2">
                  <AdToggle id={p.id} enabled={Boolean(p.enabled)} providerEnabled={providerEnabled} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-6 rounded-xl border border-line bg-ink-2 p-4 text-xs text-mist">
        <h2 className="text-sm font-semibold text-white">ads.txt</h2>
        <p className="mt-2 leading-relaxed">
          ឯកសារ <code>public/ads.txt</code> នៅទទេដោយចេតនា។ បន្ទាប់ពីអនុម័ត សូមដាក់បន្ទាត់ពិតប្រាកដពី dashboard
          របស់អ្នកផ្តល់សេវា (ឧ. <code>google.com, pub-XXXX, DIRECT, f08c47fec0942fa0</code>)។
        </p>
      </section>
    </>
  );
}
