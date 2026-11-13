import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext build configuration.
 *
 * ---------------------------------------------------------------------------
 * Why `buildCommand` is set explicitly
 * ---------------------------------------------------------------------------
 * `opennextjs-cloudflare build` compiles the Next.js app by shelling out to the
 * package's build command, which defaults to `npm run build`.
 *
 * If `npm run build` is itself `opennextjs-cloudflare build`, that recurses:
 *
 *     npm run build → opennextjs-cloudflare build → npm run build → …
 *
 * which is exactly the failure this repository hit on Cloudflare Workers Builds
 * ("Could not find compiled Open Next config"): the build step ran, recursion
 * failed, `.open-next/` was never produced, and the deploy step had nothing to
 * upload.
 *
 * Pinning the inner command to `next build` means:
 *   1. `npm run build` produces a complete bundle in `.open-next/`, so any host
 *      whose build step is the default `npm run build` works out of the box.
 *   2. `npx wrangler deploy` then finds `.open-next/open-next.config.edge.mjs`
 *      and `.open-next/worker.js`.
 *   3. `npm run cf:build` / `npm run cf:deploy` no longer recurse.
 *
 * NOTE: this key must sit on the exported object. `defineCloudflareConfig()`
 * only forwards adapter-specific overrides (cache, queue, tag cache) and drops
 * unknown keys, so passing `buildCommand` into it silently has no effect.
 * ---------------------------------------------------------------------------
 */
const cloudflareConfig = defineCloudflareConfig();

export default {
  ...cloudflareConfig,
  buildCommand: "next build",
};
