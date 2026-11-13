import type { MetadataRoute } from "next";
import { publishedTitles } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/browse", "/calendar", "/request", "/about", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({
      url: `${SITE_URL}${p}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: p === "" ? 1 : 0.6,
    })),
    ...publishedTitles().map((t) => ({
      url: `${SITE_URL}/title/${t.slug}`,
      lastModified: new Date(t.addedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
