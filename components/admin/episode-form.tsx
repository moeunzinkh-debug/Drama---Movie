"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { upsertEpisode, attachVideoAsset } from "@/actions/admin";

export default function EpisodeForm({ titles }: { titles: { id: string; label: string }[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [open, setOpen] = useState(false);

  const [titleId, setTitleId] = useState(titles[0]?.id ?? "");
  const [seasonNumber, setSeasonNumber] = useState("1");
  const [number, setNumber] = useState("1");
  const [name, setName] = useState("");
  const [nameKm, setNameKm] = useState("");
  const [releaseAt, setReleaseAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [provider, setProvider] = useState<"cloudflare_stream" | "external_embed">("cloudflare_stream");
  const [assetId, setAssetId] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    startTransition(async () => {
      const ep = await upsertEpisode({
        titleId,
        seasonNumber: Number(seasonNumber),
        number: Number(number),
        name,
        nameKm,
        releaseAt: new Date(releaseAt).toISOString(),
      });
      if (!ep.ok) {
        setMsg({ kind: "err", text: ep.error });
        return;
      }
      if (ep.id && (assetId || embedUrl)) {
        const asset = await attachVideoAsset({
          episodeId: ep.id,
          provider,
          providerAssetId: provider === "cloudflare_stream" ? assetId : undefined,
          embedUrl: provider === "external_embed" ? embedUrl : undefined,
        });
        if (!asset.ok) {
          setMsg({ kind: "err", text: `ភាគបានរក្សាទុក ប៉ុន្តែវីដេអូមិនបាន៖ ${asset.error}` });
          router.refresh();
          return;
        }
      }
      setMsg({ kind: "ok", text: "បានរក្សាទុកភាគ និងវីដេអូ។" });
      setName(""); setNameKm(""); setAssetId(""); setEmbedUrl("");
      router.refresh();
    });
  }

  return (
    <section className="rounded-xl border border-line bg-ink-2 p-4">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-sm font-semibold">
        <span>បន្ថែម / កែសម្រួលភាគ</span>
        <span className="text-gold">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <form onSubmit={submit} className="mt-4 space-y-3 text-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="e-title" className="mb-1 block text-xs text-mist/70">ចំណងជើង *</label>
              <select id="e-title" value={titleId} onChange={(e) => setTitleId(e.target.value)} required
                className="w-full rounded-lg border border-line bg-ink px-3 py-2">
                {titles.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="e-season" className="mb-1 block text-xs text-mist/70">រដូវ</label>
              <input id="e-season" value={seasonNumber} onChange={(e) => setSeasonNumber(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-lg border border-line bg-ink px-3 py-2" />
            </div>
            <div>
              <label htmlFor="e-number" className="mb-1 block text-xs text-mist/70">លេខភាគ *</label>
              <input id="e-number" value={number} onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))} required
                className="w-full rounded-lg border border-line bg-ink px-3 py-2" />
            </div>
            <div>
              <label htmlFor="e-name-km" className="mb-1 block text-xs text-mist/70">ឈ្មោះភាគ (ខ្មែរ)</label>
              <input id="e-name-km" value={nameKm} onChange={(e) => setNameKm(e.target.value)}
                className="w-full rounded-lg border border-line bg-ink px-3 py-2" />
            </div>
            <div>
              <label htmlFor="e-name" className="mb-1 block text-xs text-mist/70">ឈ្មោះភាគ (អង់គ្លេស)</label>
              <input id="e-name" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-line bg-ink px-3 py-2" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="e-release" className="mb-1 block text-xs text-mist/70">ពេលចេញផ្សាយ *</label>
              <input id="e-release" type="datetime-local" value={releaseAt} onChange={(e) => setReleaseAt(e.target.value)} required
                className="w-full rounded-lg border border-line bg-ink px-3 py-2" />
              <p className="mt-1 text-[11px] text-mist/50">ការចាក់នឹងត្រូវបានបដិសេធនៅខាងម៉ាស៊ីនមេ រហូតដល់ពេលនេះ។</p>
            </div>
          </div>

          <fieldset className="rounded-lg border border-line p-3">
            <legend className="px-1 text-xs text-mist/70">ប្រភពវីដេអូ</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="e-provider" className="mb-1 block text-xs text-mist/70">អ្នកផ្តល់</label>
                <select id="e-provider" value={provider} onChange={(e) => setProvider(e.target.value as typeof provider)}
                  className="w-full rounded-lg border border-line bg-ink px-3 py-2">
                  <option value="cloudflare_stream">Cloudflare Stream</option>
                  <option value="external_embed">HLS / Embed URL</option>
                </select>
              </div>
              {provider === "cloudflare_stream" ? (
                <div>
                  <label htmlFor="e-asset" className="mb-1 block text-xs text-mist/70">Stream Video UID</label>
                  <input id="e-asset" value={assetId} onChange={(e) => setAssetId(e.target.value)} placeholder="abc123…"
                    className="w-full rounded-lg border border-line bg-ink px-3 py-2 font-mono text-xs" />
                </div>
              ) : (
                <div>
                  <label htmlFor="e-embed" className="mb-1 block text-xs text-mist/70">HLS URL (.m3u8)</label>
                  <input id="e-embed" value={embedUrl} onChange={(e) => setEmbedUrl(e.target.value)} placeholder="https://…/master.m3u8"
                    className="w-full rounded-lg border border-line bg-ink px-3 py-2 font-mono text-xs" />
                </div>
              )}
            </div>
          </fieldset>

          {msg && (
            <p role="alert" className={msg.kind === "ok" ? "text-sm text-emerald-400" : "text-sm text-red-400"}>
              {msg.text}
            </p>
          )}

          <button type="submit" disabled={pending}
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-ink disabled:opacity-60">
            {pending ? "កំពុងរក្សាទុក…" : "រក្សាទុកភាគ"}
          </button>
        </form>
      )}
    </section>
  );
}
