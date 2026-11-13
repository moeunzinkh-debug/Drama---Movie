#!/usr/bin/env node
/**
 * Sign-in diagnostics.
 *
 * Google sign-in fails for exactly one of three reasons. This script tells you
 * which one, without needing the browser:
 *
 *   1. Supabase is not configured        (missing URL / anon key)
 *   2. Google provider is not enabled    (Supabase returns provider error)
 *   3. The redirect allow-list is wrong  (Supabase rejects redirect_to)
 *
 * Usage:
 *   node scripts/check-auth.mjs [site-url]
 *
 * `site-url` is the address you actually open in the browser, e.g.
 *   https://cinema-kh.<subdomain>.workers.dev
 * It defaults to NEXT_PUBLIC_SITE_URL.
 *
 * Only public values are used (URL + anon key). No secret is required.
 */

import { readFileSync, existsSync } from "node:fs";

// Load .env.local without a dependency; Next.js only loads it for the app.
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const site = process.argv[2] ?? process.env.NEXT_PUBLIC_SITE_URL;

const ok = (m) => console.log(`\x1b[32m✓\x1b[0m ${m}`);
const bad = (m) => console.log(`\x1b[31m✗\x1b[0m ${m}`);
const warn = (m) => console.log(`\x1b[33m!\x1b[0m ${m}`);
const hint = (m) => console.log(`    \x1b[2m${m}\x1b[0m`);

console.log("\nCINEMA KH — diagnostics សម្រាប់ការចូល Google\n" + "=".repeat(52) + "\n");

// --- 1. Configuration present ------------------------------------------------
if (!url || !anon) {
  bad("Supabase មិនទាន់កំណត់ — ខ្វះ NEXT_PUBLIC_SUPABASE_URL ឬ NEXT_PUBLIC_SUPABASE_ANON_KEY");
  hint("បន្ថែមក្នុង .env.local និងក្នុង Worker Variables រួច deploy ម្តងទៀត");
  process.exit(1);
}
ok(`Supabase URL: ${url}`);

if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url)) {
  warn("URL មិនមើលទៅដូច URL ស្តង់ដាររបស់ Supabase ទេ (ត្រូវបញ្ចប់ដោយ .supabase.co)");
}
if (!site) {
  bad("មិនទាន់ដឹង site URL — ផ្ញើជា argument ឬកំណត់ NEXT_PUBLIC_SITE_URL");
  hint("node scripts/check-auth.mjs https://<ដែនរបស់អ្នក>");
  process.exit(1);
}

const siteUrl = site.replace(/\/$/, "");
const authBase = url.replace(/\/$/, "");
const projectRef = new URL(authBase).hostname.split(".")[0];

console.log(`\nដែនដែលបានពិនិត្យ៖ ${siteUrl}\n`);

// --- 2. Is the redirect target same as what we send? -------------------------
const redirectTo = `${siteUrl}/auth/callback`;
ok(`redirect_to ដែល app នឹងផ្ញើ៖ ${redirectTo}`);
hint("ត្រូវតែមាននៅក្នុង Supabase → Authentication → URL Configuration → Redirect URLs");

// --- 3. Does Supabase accept the provider + redirect? -----------------------
// GET /auth/v1/authorize is the same endpoint the browser would hit. We do not
// follow the redirect; we only inspect whether Supabase rejects the request.
const probe = `${authBase}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(
  redirectTo,
)}&code_challenge=diag&code_challenge_method=s256`;

async function main() {
  let res;
  try {
    res = await fetch(probe, { redirect: "manual" });
  } catch (e) {
    bad(`មិនអាចភ្ជាប់ទៅ Supabase បានទេ៖ ${e.message}`);
    process.exit(1);
  }

  const status = res.status;
  const location = res.headers.get("location") ?? "";
  let body = "";
  try {
    body = await res.text();
  } catch {
    /* ignore */
  }

  // A 302 to accounts.google.com means everything up to Google is correct.
  if (status >= 300 && status < 400 && /accounts\.google\.com/.test(location)) {
    ok("Supabase ទទួលយក redirect ហើយបញ្ជូនបន្តទៅ Google");
    ok("Google provider បើករួចហើយ");
    console.log("");
    ok("ការកំណត់ទាំងអស់នៅខាងក្រោយត្រឹមត្រូវ។");
    hint("បើអ្នកនៅតែចូលមិនបាន បញ្ហាស្ថិតនៅ Google Cloud:");
    hint(`  Authorized redirect URI ត្រូវតែមាន https://${projectRef}.supabase.co/auth/v1/callback`);
    hint("  (មិនមែនដែនរបស់អ្នកទេ)");
    process.exit(0);
  }

  if (status === 400 || status === 403) {
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      parsed = {};
    }
    const msg = parsed.msg ?? parsed.error_description ?? parsed.error ?? body.slice(0, 200);

    if (/provider/i.test(String(msg))) {
      bad("Google provider មិនទាន់បើកក្នុង Supabase");
      hint("Supabase → Authentication → Providers → Google → Enable + Client ID/Secret");
      process.exit(1);
    }

    bad(`Supabase បដិសេធសំណើ (HTTP ${status})៖ ${msg}`);
    hint("ជាទូទៅមានន័យថា redirect_to មិននៅក្នុង Redirect URLs");
    hint("Supabase → Authentication → URL Configuration → Redirect URLs");
    hint(`បន្ថែម៖ ${redirectTo}`);
    process.exit(1);
  }

  if (status === 401) {
    bad("anon key មិនត្រឹមត្រូវ (401)");
    hint("ចម្លងម្តងទៀតពី Supabase → Settings → API → anon/publishable");
    process.exit(1);
  }

  warn(`ចម្លើយមិនរំពឹងទុក៖ HTTP ${status}`);
  hint(location || body.slice(0, 200));
  process.exit(1);
}

main();
