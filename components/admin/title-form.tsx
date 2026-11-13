"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { upsertTitle } from "@/actions/admin";

export default function TitleAdminForm({
  categories,
  countries,
}: {
  categories: { slug: string; label: string }[];
  countries: { slug: string; label: string }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [open, setOpen] = useState(false);

  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [nameKm, setNameKm] = useState("");
  const [type, setType] = useState<"movie" | "drama">("drama");
  const [taglineKm, setTaglineKm] = useState("");
  const [synopsisKm, setSynopsisKm] = useState("");
  const [countrySlug, setCountrySlug] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [ageRating, setAgeRating] = useState("13+");
  const [status, setStatus] = useState<"draft" | "scheduled" | "published" | "archived">("draft");
  const [featured, setFeatured] = useState(false);
  const [rightsNote, setRightsNote] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    startTransition(async () => {
      const res = await upsertTitle({
        slug,
        name,
        nameKm,
        type,
        taglineKm,
        tagline: "",
        synopsis: "",
        synopsisKm,
        countrySlug: countrySlug || undefined,
        releaseYear: releaseYear ? Number(releaseYear) : undefined,
        ageRating,
        status,
        featured,
        popularity: 0,
        rightsNote,
        categorySlugs: selectedCats,
      });
      if (!res.ok) {
        setMsg({ kind: "err", text: res.error });
        return;
      }
      setMsg({ kind: "ok", text: "បានរក្សាទុក។" });
      setSlug(""); setName(""); setNameKm(""); setTaglineKm(""); setSynopsisKm(""); setRightsNote("");
      setSelectedCats([]);
      router.refresh();
    });
  }

  return (
    <section className="rounded-xl border border-line bg-ink-2 p-4">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-sm font-semibold">
        <span>បន្ថែម / កែសម្រួលចំណងជើង</span>
        <span className="text-gold">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <form onSubmit={submit} className="mt-4 space-y-3 text-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="t-name-km" className="mb-1 block text-xs text-mist/70">ឈ្មោះខ្មែរ *</label>
              <input id="t-name-km" value={nameKm} onChange={(e) => setNameKm(e.target.value)} required
                className="w-full rounded-lg border border-line bg-ink px-3 py-2" />
            </div>
            <div>
              <label htmlFor="t-name" className="mb-1 block text-xs text-mist/70">ឈ្មោះអង់គ្លេស *</label>
              <input id="t-name" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full rounded-lg border border-line bg-ink px-3 py-2" />
            </div>
            <div>
              <label htmlFor="t-slug" className="mb-1 block text-xs text-mist/70">slug * (a-z, 0-9, -)</label>
              <input id="t-slug" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} required
                className="w-full rounded-lg border border-line bg-ink px-3 py-2 font-mono" />
            </div>
            <div>
              <label htmlFor="t-type" className="mb-1 block text-xs text-mist/70">ប្រភេទ</label>
              <select id="t-type" value={type} onChange={(e) => setType(e.target.value as "movie" | "drama")}
                className="w-full rounded-lg border border-line bg-ink px-3 py-2">
                <option value="drama">រឿងភាគ</option>
                <option value="movie">ភាពយន្ត</option>
              </select>
            </div>
            <div>
              <label htmlFor="t-country" className="mb-1 block text-xs text-mist/70">ប្រទេស</label>
              <select id="t-country" value={countrySlug} onChange={(e) => setCountrySlug(e.target.value)}
                className="w-full rounded-lg border border-line bg-ink px-3 py-2">
                <option value="">—</option>
                {countries.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="t-year" className="mb-1 block text-xs text-mist/70">ឆ្នាំ</label>
              <input id="t-year" value={releaseYear} onChange={(e) => setReleaseYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="w-full rounded-lg border border-line bg-ink px-3 py-2" />
            </div>
            <div>
              <label htmlFor="t-age" className="mb-1 block text-xs text-mist/70">អាយុ</label>
              <select id="t-age" value={ageRating} onChange={(e) => setAgeRating(e.target.value)}
                className="w-full rounded-lg border border-line bg-ink px-3 py-2">
                {["All", "7+", "13+", "16+", "18+"].map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="t-status" className="mb-1 block text-xs text-mist/70">ស្ថានភាព</label>
              <select id="t-status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}
                className="w-full rounded-lg border border-line bg-ink px-3 py-2">
                <option value="draft">ព្រាង</option>
                <option value="scheduled">កំណត់ទុក</option>
                <option value="published">បានផ្សាយ</option>
                <option value="archived">ប័ណ្ណសារ</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="t-tagline" className="mb-1 block text-xs text-mist/70">សេចក្តីសង្ខេបខ្លី (ខ្មែរ)</label>
            <input id="t-tagline" value={taglineKm} onChange={(e) => setTaglineKm(e.target.value)}
              className="w-full rounded-lg border border-line bg-ink px-3 py-2" />
          </div>
          <div>
            <label htmlFor="t-synopsis" className="mb-1 block text-xs text-mist/70">អត្ថបទសង្ខេប (ខ្មែរ)</label>
            <textarea id="t-synopsis" value={synopsisKm} onChange={(e) => setSynopsisKm(e.target.value)} rows={3}
              className="w-full rounded-lg border border-line bg-ink px-3 py-2" />
          </div>

          <fieldset>
            <legend className="mb-1 text-xs text-mist/70">ប្រភេទរឿង</legend>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.slug}
                  aria-pressed={selectedCats.includes(c.slug)}
                  onClick={() =>
                    setSelectedCats((prev) =>
                      prev.includes(c.slug) ? prev.filter((x) => x !== c.slug) : [...prev, c.slug],
                    )
                  }
                  className={`rounded-full px-3 py-1 text-xs ${
                    selectedCats.includes(c.slug) ? "bg-gold text-ink" : "border border-line text-mist"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="rounded-lg border border-gold/30 bg-gold/5 p-3">
            <label htmlFor="t-rights" className="mb-1 block text-xs text-mist/70">
              សិទ្ធិមាតិកា * (ចាំបាច់មុនពេលផ្សាយ — មិនបង្ហាញជាសាធារណៈ)
            </label>
            <input id="t-rights" value={rightsNote} onChange={(e) => setRightsNote(e.target.value)}
              placeholder="ឧ. Original production — owner: CINEMA KH"
              className="w-full rounded-lg border border-line bg-ink px-3 py-2" />
          </div>

          <label className="flex items-center gap-2 text-xs text-mist">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-gold" />
            បង្ហាញនៅទំព័រដើម (featured)
          </label>

          {msg && (
            <p role="alert" className={msg.kind === "ok" ? "text-sm text-emerald-400" : "text-sm text-red-400"}>
              {msg.text}
            </p>
          )}

          <button type="submit" disabled={pending}
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-ink disabled:opacity-60">
            {pending ? "កំពុងរក្សាទុក…" : "រក្សាទុក"}
          </button>
        </form>
      )}
    </section>
  );
}
