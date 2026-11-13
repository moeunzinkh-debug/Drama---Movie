import type { MetadataRoute } from "next";

/**
 * Web app manifest.
 *
 * Deliberately a *browsable* PWA: the app shell, catalogue and saved lists work
 * offline-ish (installed, cached shell), but video playback is never cached.
 * Offline video requires an authorised download SDK with expiry and device
 * limits — see docs/SECURITY.md §4. Until that exists, no downloads are offered
 * rather than shipping an unsafe workaround.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CINEMA KH — ភាពយន្ត និងរឿងភាគ",
    short_name: "CINEMA KH",
    description:
      "វេទិកាមើលភាពយន្ត និងរឿងភាគឥតគិតថ្លៃសម្រាប់ទស្សនិកជនខ្មែរ។",
    lang: "km",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#07070c",
    theme_color: "#07070c",
    categories: ["entertainment", "video"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "ភាពយន្ត", short_name: "ភាពយន្ត", url: "/browse?type=movie" },
      { name: "រឿងភាគ", short_name: "រឿងភាគ", url: "/browse?type=drama" },
      { name: "បញ្ជីរបស់ខ្ញុំ", short_name: "បញ្ជី", url: "/my-list" },
      { name: "កាលវិភាគ", short_name: "កាលវិភាគ", url: "/calendar" },
    ],
  };
}
