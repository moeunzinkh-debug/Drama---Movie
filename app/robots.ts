import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/supabase/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The admin area must never be indexed.
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
