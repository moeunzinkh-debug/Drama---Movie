import { getTitleBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c] as string),
  );
}

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const title = await getTitleBySlug(slug).catch(() => null);
  const [c1, c2] = title?.palette ?? ["#101018", "#3a3a55"];
  const seed = hash(slug);
  const W = 600;
  const H = 900;

  // Deterministic decorative "light rays" so each placeholder looks distinct.
  const rays = Array.from({ length: 7 }, (_, i) => {
    const x = 40 + ((seed >> (i * 3)) % 520);
    const w = 30 + ((seed >> (i * 5)) % 90);
    const o = 0.03 + ((seed >> (i * 2)) % 7) / 100;
    return `<rect x="${x}" y="-100" width="${w}" height="${H + 200}" fill="${c2}" opacity="${o.toFixed(2)}" transform="rotate(${(i * 7) % 24} 300 450)" />`;
  }).join("");

  const name = escapeXml(title?.name ?? slug);
  const nameKm = escapeXml(title?.nameKm ?? "");
  const words = name.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > 14) {
      lines.push(line.trim());
      line = w;
    } else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);

  const text = lines
    .slice(0, 3)
    .map(
      (l, i) =>
        `<text x="48" y="${H - 150 + i * 52}" font-family="Georgia, 'Times New Roman', serif" font-size="46" font-weight="700" fill="#ffffff">${l}</text>`,
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${name}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" stop-opacity="0.55" />
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0.45" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0" />
      <stop offset="100%" stop-color="#000" stop-opacity="0.72" />
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${c1}" />
  <rect width="${W}" height="${H}" fill="url(#g)" />
  ${rays}
  <circle cx="${80 + (seed % 420)}" cy="${180 + (seed % 220)}" r="${120 + (seed % 90)}" fill="${c2}" opacity="0.12" />
  <rect width="${W}" height="${H}" fill="url(#fade)" />
  <g>
    <rect x="48" y="${H - 250}" width="56" height="4" fill="${c2}" />
    ${text}
    <text x="48" y="${H - 46}" font-family="'Noto Sans Khmer', 'Khmer OS', system-ui, sans-serif" font-size="26" fill="#e8e8f0" opacity="0.85">${nameKm}</text>
  </g>
</svg>`;

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}


