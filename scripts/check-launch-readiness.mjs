#!/usr/bin/env node
/**
 * Launch readiness check.
 *
 * Answers one question: "can this build be published to the public?"
 *
 * It inspects the repository and environment (not the live site) and reports
 * BLOCKERS (must fix — legal/safety/security), WARNINGS (should fix before real
 * traffic), and PASSES. Exit code 1 when any blocker remains, so it can gate a
 * release step.
 *
 * Usage:
 *   node scripts/check-launch-readiness.mjs
 *   node scripts/check-launch-readiness.mjs --strict   # warnings also fail
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const strict = process.argv.includes("--strict");

const blockers = [];
const warnings = [];
const passes = [];

const blocker = (id, msg, fix) => blockers.push({ id, msg, fix });
const warn = (id, msg, fix) => warnings.push({ id, msg, fix });
const pass = (id, msg) => passes.push({ id, msg });

const read = (p) => readFileSync(join(root, p), "utf8");
const has = (p) => existsSync(join(root, p));
const env = (k) => process.env[k];

// ---------------------------------------------------------------------------
// 1. Required production assets
// ---------------------------------------------------------------------------
const REQUIRED_ASSETS = [
  ["public/favicon.ico", "favicon"],
  ["public/icon-192.png", "PWA icon 192"],
  ["public/icon-512.png", "PWA icon 512"],
  ["public/icon-maskable-192.png", "maskable icon 192"],
  ["public/icon-maskable-512.png", "maskable icon 512"],
  ["public/apple-touch-icon.png", "Apple touch icon"],
  ["public/og-default.png", "Open Graph fallback image"],
  ["app/manifest.ts", "web app manifest"],
  ["app/error.tsx", "error boundary"],
  ["app/global-error.tsx", "global error boundary"],
  ["app/not-found.tsx", "404 page"],
  ["app/robots.ts", "robots.txt"],
  ["app/sitemap.ts", "sitemap"],
  ["public/ads.txt", "ads.txt"],
];
const missingAssets = REQUIRED_ASSETS.filter(([p]) => !has(p)).map(([p, n]) => `${n} (${p})`);
if (missingAssets.length) {
  blocker("assets", `Missing production assets: ${missingAssets.join(", ")}`, "Run `npm run icons`.");
} else {
  pass("assets", `All ${REQUIRED_ASSETS.length} production assets present`);
}

// ---------------------------------------------------------------------------
// 2. Environment variables
// ---------------------------------------------------------------------------
const REQUIRED_ENV = ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"];
const missingEnv = REQUIRED_ENV.filter((k) => !env(k));
if (missingEnv.length) {
  // Absence here usually means this check ran without loading .env — warn, not block.
  warn(
    "env",
    `Not set in this shell: ${missingEnv.join(", ")}`,
    "Export your .env.local values, or confirm they are set as Worker variables.",
  );
} else {
  pass("env", "Required public environment variables are set");

  const site = env("NEXT_PUBLIC_SITE_URL");
  if (site && !site.startsWith("https://")) {
    warn("env-https", `NEXT_PUBLIC_SITE_URL is not HTTPS (${site})`, "Use https:// in production for OAuth and HSTS.");
  }
  if (site && /localhost|127\.0\.0\.1/.test(site)) {
    blocker("env-localhost", "NEXT_PUBLIC_SITE_URL still points at localhost", "Set the real domain before publishing.");
  }
}

if (!env("SUPABASE_SERVICE_ROLE_KEY")) {
  warn("env-service", "SUPABASE_SERVICE_ROLE_KEY not visible here", "Must exist as a Worker secret for playback tokens.");
}

// A secret in a NEXT_PUBLIC_ variable ships to the browser.
const leakedSecret = Object.entries(process.env).find(
  ([k, v]) =>
    k.startsWith("NEXT_PUBLIC_") &&
    typeof v === "string" &&
    (k.toUpperCase().includes("SERVICE") || k.toUpperCase().includes("SECRET") || v.length > 200),
);
if (leakedSecret) {
  blocker("secret-leak", `${leakedSecret[0]} looks like a secret in a public variable`, "Move it to a Worker secret.");
} else {
  pass("secret-leak", "No secret-looking values in NEXT_PUBLIC_ variables");
}

// ---------------------------------------------------------------------------
// 3. Advertising must stay off until approved
// ---------------------------------------------------------------------------
if (env("NEXT_PUBLIC_ADS_ENABLED") === "true") {
  warn(
    "ads-enabled",
    "NEXT_PUBLIC_ADS_ENABLED=true",
    "Only legal after the ad provider approves this site. Confirm approval first.",
  );
} else {
  pass("ads-enabled", "Ads disabled (correct before provider approval)");
}

const adsTxt = has("public/ads.txt") ? read("public/ads.txt") : "";
const adsTxtHasSeller = adsTxt.split("\n").some((l) => /^[a-z0-9.-]+,\s*pub-\d+/.test(l.trim()));
if (adsTxtHasSeller) {
  warn("ads-txt", "ads.txt contains a seller record", "Verify it is the exact line from your provider dashboard.");
} else {
  pass("ads-txt", "ads.txt publishes no authorisation (correct before approval)");
}

// ---------------------------------------------------------------------------
// 4. Placeholder content still in the catalogue
// ---------------------------------------------------------------------------
const seedPath = "supabase/migrations/0003_seed.sql";
let stillSampleVideo = false;
if (has(seedPath)) {
  const seed = read(seedPath);
  stillSampleVideo = seed.includes("test-streams.mux.dev");
  if (stillSampleVideo) {
    blocker(
      "sample-video",
      "Seed data still points at a third-party sample stream (test-streams.mux.dev)",
      "Replace with your own rights-cleared Cloudflare Stream assets before publishing.",
    );
  } else {
    pass("sample-video", "No placeholder sample stream in the seed");
  }

  const fictionalCount = (seed.match(/insert into titles/g) ?? []).length;
  if (fictionalCount > 0) {
    blocker(
      "fictional-catalogue",
      `Seed still inserts ${fictionalCount} placeholder titles`,
      "Publish only content CINEMA KH is authorised to distribute. Replace the demo catalogue.",
    );
  }
}

// ---------------------------------------------------------------------------
// 5. Legal pages must not still be marked as templates
// ---------------------------------------------------------------------------
for (const page of ["app/privacy/page.tsx", "app/terms/page.tsx"]) {
  if (!has(page)) {
    blocker("legal", `Missing ${page}`, "Add the policy page.");
    continue;
  }
  const body = read(page);
  if (/ឯកសារគំរូ|template|placeholder/i.test(body)) {
    warn(
      "legal-template",
      `${page} still says it is a template`,
      "Have it reviewed for your jurisdiction and remove the banner before launch.",
    );
  }
}

// Marketing copy that still describes the site as a prototype.
const PROTOTYPE_PHRASES = ["ដំណាក់កាលអភិវឌ្ឍន៍", "គំរូអភិវឌ្ឍន៍", "development stage", "prototype"];
const prototypeHits = [];
for (const dir of ["app", "components"]) {
  const walk = (p) => {
    if (!existsSync(p)) return;
    for (const entry of readdirSync(p, { withFileTypes: true })) {
      const full = join(p, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.tsx$/.test(entry.name)) {
        const body = readFileSync(full, "utf8");
        if (PROTOTYPE_PHRASES.some((s) => body.includes(s))) prototypeHits.push(full.replace(root + "/", ""));
      }
    }
  };
  walk(join(root, dir));
}
if (prototypeHits.length) {
  warn(
    "prototype-copy",
    `Public copy still calls the site a prototype: ${prototypeHits.join(", ")}`,
    "Rewrite this copy before the public launch — visitors should not read 'development stage'.",
  );
} else {
  pass("prototype-copy", "No prototype wording in public copy");
}

// ---------------------------------------------------------------------------
// 6. Security controls still in place
// ---------------------------------------------------------------------------
const proxySrc = has("proxy.ts") ? read("proxy.ts") : has("middleware.ts") ? read("middleware.ts") : "";
if (!proxySrc) {
  blocker("auth-gate", "No proxy.ts/middleware.ts", "The /admin gate and session refresh depend on it.");
} else if (!proxySrc.includes("/admin")) {
  blocker("auth-gate", "Proxy does not gate /admin", "Restore the admin redirect.");
} else {
  pass("auth-gate", "Request proxy gates /admin and refreshes the session");
}

const playback = has("app/api/playback/route.ts") ? read("app/api/playback/route.ts") : "";
if (!playback) {
  blocker("playback", "Missing /api/playback", "Playback authorisation is required.");
} else {
  const checks = [
    ["getCurrentUser", "session check"],
    ["suspended_at", "suspension check"],
    ["release_at", "release-time check"],
    ["rating_allows", "parental check"],
  ];
  const missing = checks.filter(([token]) => !playback.includes(token)).map(([, n]) => n);
  if (missing.length) {
    blocker("playback", `Playback gate missing: ${missing.join(", ")}`, "Restore the server-side checks.");
  } else {
    pass("playback", "Playback enforces session, suspension, release and parental checks");
  }
}

const rls = has("supabase/migrations/0002_rls.sql") ? read("supabase/migrations/0002_rls.sql") : "";
if (!rls || !rls.includes("enable row level security")) {
  blocker("rls", "RLS migration missing or disabled", "Restore 0002_rls.sql before publishing.");
} else if (!rls.includes("revoke all on all tables in schema public from anon, authenticated")) {
  warn("rls", "RLS present but the table-privilege revoke is missing", "Column grants protect internal fields.");
} else {
  pass("rls", "RLS + table/column grants in place");
}

const host = has("next.config.ts") ? read("next.config.ts") : "";
const headerChecks = [
  ["Content-Security-Policy", "CSP"],
  ["X-Content-Type-Options", "nosniff"],
  ["Strict-Transport-Security", "HSTS"],
  ["frame-ancestors 'none'", "clickjacking protection"],
];
const missingHeaders = headerChecks.filter(([t]) => !host.includes(t)).map(([, n]) => n);
if (missingHeaders.length) {
  warn("headers", `Missing security headers: ${missingHeaders.join(", ")}`, "Add them in next.config.ts headers().");
} else {
  pass("headers", "CSP, nosniff, HSTS and frame-ancestors set");
}

// ---------------------------------------------------------------------------
// 7. Deployability
// ---------------------------------------------------------------------------
if (!has(".open-next/worker.js")) {
  warn("bundle", "No .open-next/worker.js — build has not run", "Run `npm run build`.");
} else {
  pass("bundle", "OpenNext worker bundle exists");
}

const pkg = JSON.parse(read("package.json"));
if (String(pkg.scripts?.build ?? "").includes("opennextjs-cloudflare")) {
  const cfg = has("open-next.config.ts") ? read("open-next.config.ts") : "";
  if (!/buildCommand\s*:\s*["']next build["']/.test(cfg)) {
    blocker("recursion", "`npm run build` invokes the OpenNext CLI without a pinned buildCommand", "This recurses; see open-next.config.ts.");
  } else {
    pass("recursion", "OpenNext buildCommand pinned (no recursion)");
  }
}

// Indexing switches: a demo catalogue must never be indexed as real content.
const robotsSrc = has("app/robots.ts") ? read("app/robots.ts") : has("app/robots.txt") ? read("app/robots.txt") : "";
if (!robotsSrc) {
  warn("robots", "No robots rule found", "Add app/robots.ts so /admin stays out of search results.");
} else if (!robotsSrc.includes("/admin")) {
  warn("robots", "robots does not disallow /admin", "Admin pages must never be indexed.");
} else {
  pass("robots", "robots disallows /admin and /api");
}

// While the catalogue is placeholder, indexing it invites legal and SEO problems.
if (stillSampleVideo || prototypeHits.length) {
  warn(
    "noindex",
    "Placeholder content is still published, but the site asks search engines to index it",
    "Consider setting robots to noindex until rights-cleared content replaces the demo catalogue.",
  );
}

// Uncommitted work should never be published.
try {
  const dirty = execSync("git status --porcelain", { cwd: root, encoding: "utf8" }).trim();
  if (dirty) {
    const n = dirty.split("\n").length;
    warn("git-dirty", `${n} uncommitted change(s)`, "Commit before publishing so the deployed build matches a known commit.");
  } else {
    pass("git-dirty", "Working tree clean");
  }
} catch {
  /* not a git checkout — ignore */
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

console.log("\nCINEMA KH — launch readiness\n" + "=".repeat(46) + "\n");

if (blockers.length) {
  console.log(`${RED}BLOCKERS (${blockers.length}) — do not publish yet${RESET}`);
  for (const b of blockers) {
    console.log(`  ${RED}✗${RESET} ${b.msg}`);
    console.log(`    ${DIM}fix: ${b.fix}${RESET}`);
  }
  console.log();
}

if (warnings.length) {
  console.log(`${YELLOW}WARNINGS (${warnings.length})${RESET}`);
  for (const w of warnings) {
    console.log(`  ${YELLOW}!${RESET} ${w.msg}`);
    console.log(`    ${DIM}${w.fix}${RESET}`);
  }
  console.log();
}

console.log(`${GREEN}PASSED (${passes.length})${RESET}`);
for (const p of passes) console.log(`  ${GREEN}✓${RESET} ${p.msg}`);

console.log("\n" + "=".repeat(46));
if (blockers.length) {
  console.log(`${RED}NOT READY${RESET} — ${blockers.length} blocker(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
if (strict && warnings.length) {
  console.log(`${YELLOW}STRICT MODE${RESET} — ${warnings.length} warning(s) treated as failures`);
  process.exit(1);
}
console.log(`${GREEN}READY TO PUBLISH${RESET} — 0 blockers, ${warnings.length} warning(s) to review`);
