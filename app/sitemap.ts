import type { MetadataRoute } from "next";
import { listTitles } from "@/lib/queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const titles = await listTitles({ limit: 500 }).catch(() => []);
  const pages = ["", "/browse", "/calendar", "/request", "/about", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({
      url: `${SITE_URL}${p}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: p === "" ? 1 : 0.6,
    })),
    ...titles.map((t) => ({
      url: `${SITE_URL}/title/${t.slug}`,
      lastModified: new Date(t.addedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
