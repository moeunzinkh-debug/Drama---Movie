import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import RequestForm from "@/components/request-form";

export const metadata: Metadata = { title: "ស្នើសុំរឿង" };
export const dynamic = "force-dynamic";

export default async function RequestPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-black">ស្នើសុំរឿង</h1>
        <p className="mt-2 text-sm text-mist">
          អ្នកត្រូវចូលដោយ Google ដើម្បីផ្ញើសំណើ។
        </p>
        <Link href="/login?next=/request" className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink">
          ចូលដោយ Google
        </Link>
      </div>
    );
  }

  const supabase = await createClient();
  const [{ data: requests }, { data: countries }] = await Promise.all([
    supabase
      .from("movie_requests")
      .select("id, title, country, year, status, created_at")
      .eq("account_id", user.account.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase.from("countries").select("slug, name_km").order("sort_order"),
  ]);

  const statusLabel: Record<string, string> = {
    pending: "រង់ចាំពិនិត្យ",
    planned: "បានគ្រោងទុក",
    fulfilled: "បានបន្ថែម",
    rejected: "មិនអាចបន្ថែម",
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight">ស្នើសុំរឿង</h1>
      <p className="mt-2 text-sm text-mist">
        មិនអាចធានាថាគ្រប់សំណើនឹងត្រូវបានបន្ថែមទេ — យើងអាចបន្ថែមបានតែមាតិកាដែលមានសិទ្ធិស្របច្បាប់។
        អតិបរមា ៥ សំណើរង់ចាំ និង ១០ សំណើក្នុងមួយថ្ងៃ។
      </p>

      <RequestForm countries={(countries ?? []).map((c) => ({ slug: c.slug as string, label: c.name_km as string }))} />

      {requests && requests.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-semibold">សំណើរបស់អ្នក</h2>
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line">
            {requests.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 bg-ink-2 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm">{m.title}</p>
                  <p className="text-xs text-mist">
                    {[m.country, m.year].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${
                    m.status === "pending"
                      ? "border border-line text-mist"
                      : m.status === "fulfilled"
                        ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : m.status === "rejected"
                          ? "border border-red-500/30 bg-red-500/10 text-red-300"
                          : "border border-gold/40 bg-gold/10 text-gold"
                  }`}
                >
                  {statusLabel[m.status] ?? m.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
