#!/usr/bin/env node
/**
 * Verifies that `npm run build` produced a deployable OpenNext bundle.
 *
 * Why this exists
 * ---------------
 * Cloudflare Workers Builds runs two commands: a build step, then a deploy step
 * (`npx wrangler deploy`). If the build step does not create `.open-next/`, the
 * deploy fails with:
 *
 *     ERROR Could not find compiled Open Next config, did you run the build command?
 *
 * That happened here because `npm run build` was set to `opennextjs-cloudflare
 * build`, which internally runs `npm run build` again — infinite recursion, so
 * the bundle was never written. `open-next.config.ts` now pins the inner command
 * to `next build`.
 *
 * Run this after a build, and in CI if you ever add it, to fail fast with a
 * clear message instead of a confusing deploy error.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

const REQUIRED = [
  ".open-next/worker.js",
  ".open-next/assets",
  ".open-next/.build/open-next.config.edge.mjs",
];

let failed = false;
const fail = (msg) => {
  console.error(`✗ ${msg}`);
  failed = true;
};

// 1. The bundle must exist.
for (const rel of REQUIRED) {
  const abs = join(root, rel);
  if (existsSync(abs)) {
    const size = statSync(abs).isDirectory() ? "" : ` (${(statSync(abs).size / 1024).toFixed(0)} KiB)`;
    console.log(`✓ ${rel}${size}`);
  } else {
    fail(`missing ${rel} — did the build step actually run?`);
  }
}

// 2. Recursion guard: `npm run build` must not resolve to the OpenNext CLI.
const buildScript = pkg.scripts?.build ?? "";
if (buildScript.includes("opennextjs-cloudflare")) {
  // Allowed only when the inner command is pinned, otherwise it loops forever.
  const cfgPath = join(root, "open-next.config.ts");
  const pinned =
    existsSync(cfgPath) &&
    /buildCommand\s*:\s*["']next build["']/.test(readFileSync(cfgPath, "utf8"));

  if (pinned) {
    console.log("✓ build script runs the OpenNext CLI with buildCommand pinned to `next build`");
  } else {
    fail(
      "`npm run build` runs `opennextjs-cloudflare build`, which internally runs " +
        "`npm run build` → infinite recursion. Pin `buildCommand: \"next build\"` in " +
        "open-next.config.ts, or change the build script.",
    );
  }
} else {
  console.log(`✓ build script does not invoke the OpenNext CLI directly ("${buildScript}")`);
}

// 3. wrangler entry point must match the bundle.
if (existsSync(join(root, "wrangler.jsonc"))) {
  const raw = readFileSync(join(root, "wrangler.jsonc"), "utf8")
    .split("\n")
    .filter((l) => !l.trim().startsWith("//"))
    .join("\n");
  const main = /"main"\s*:\s*"([^"]+)"/.exec(raw)?.[1];
  if (!main) {
    fail('wrangler.jsonc has no "main" entry point');
  } else if (!existsSync(join(root, main))) {
    fail(`wrangler.jsonc "main" points at ${main}, which does not exist after the build`);
  } else {
    console.log(`✓ wrangler main entry: ${main}`);
  }
}

console.log("");
if (failed) {
  console.error("Build verification FAILED — deploying this would fail on Cloudflare.");
  process.exit(1);
}
console.log("Build verification passed — safe to run `npx wrangler deploy`.");
