import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Posters/backdrops are served from our own /api/poster + /api/backdrop
    // routes so no external image domains need to be allowlisted.
    unoptimized: true,
  },
};

export default nextConfig;
