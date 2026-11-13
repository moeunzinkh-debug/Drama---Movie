/**
 * AdSlot — a deliberately empty, policy-safe placeholder.
 *
 * No ad network script is loaded. Real ad code is only added after the site has
 * been reviewed and approved by the provider (see the requirements document,
 * sections 2.2–2.4). The wrapper reserves a stable height so that turning ads on
 * later cannot cause layout shift, and it is marked with `data-ad-slot` so the
 * admin Ads Management screen can map placements to page/device config.
 *
 * Rules enforced by design here:
 *  - never rendered above/inside the video player or beside the Watch button;
 *  - fixed aspect ratio to avoid accidental taps and CLS;
 *  - clearly labelled "ការផ្សាយពាណិជ្ជកម្ម" so it is never mistaken for content.
 */
export default function AdSlot({
  placement,
  format = "leaderboard",
  className = "",
}: {
  /** e.g. "home-mid", "detail-side", "watch-below-player" */
  placement: string;
  format?: "leaderboard" | "rectangle" | "mobile";
  className?: string;
}) {
  const enabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
  const sizes: Record<string, string> = {
    leaderboard: "min-h-[90px] sm:min-h-[100px]",
    rectangle: "min-h-[250px]",
    mobile: "min-h-[100px]",
  };

  return (
    <aside
      data-ad-slot={placement}
      data-ad-format={format}
      data-ad-enabled={enabled ? "true" : "false"}
      aria-label="កន្លែងផ្សាយពាណិជ្ជកម្ម"
      className={`mx-auto w-full max-w-3xl ${className}`}
    >
      <div
        className={`flex ${sizes[format]} w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line/80 bg-ink-2/60 px-4 py-3 text-center`}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-mist/60">
          ការផ្សាយពាណិជ្ជកម្ម
        </span>
        <span className="text-[11px] text-mist/40">
          {enabled
            ? "រង់ចាំការអនុម័តពីអ្នកផ្តល់សេវាកម្មពាណិជ្ជកម្ម"
            : "កន្លែងពាណិជ្ជកម្ម — មិនទាន់បើក (រង់ចាំការអនុម័ត)"}
        </span>
      </div>
    </aside>
  );
}
