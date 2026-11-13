/**
 * Pre-flight configuration check.
 *
 * Usage: node --experimental-strip-types scripts/check-config.ts
 *
 * Verifies that every variable the app needs is present before you deploy, so a
 * missing secret fails here instead of on the first viewer request.
 */
interface Check {
  name: string;
  required: boolean;
  secret?: boolean;
  hint: string;
}

const checks: Check[] = [
  { name: "NEXT_PUBLIC_SITE_URL", required: true, hint: "e.g. https://cinema-kh.com" },
  { name: "NEXT_PUBLIC_SUPABASE_URL", required: true, hint: "Supabase → Project Settings → API" },
  { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", required: true, hint: "anon/publishable key" },
  { name: "SUPABASE_SERVICE_ROLE_KEY", required: true, secret: true, hint: "server-only; Cloudflare Secret" },
  { name: "CLOUDFLARE_ACCOUNT_ID", required: false, hint: "needed for Cloudflare Stream" },
  { name: "CLOUDFLARE_STREAM_API_TOKEN", required: false, secret: true, hint: "needed for Cloudflare Stream" },
  { name: "CLOUDFLARE_STREAM_SIGNING_KEY", required: false, secret: true, hint: "recommended: signed playback" },
  { name: "NEXT_PUBLIC_ADS_ENABLED", required: false, hint: "keep false until ad approval" },
];

let failed = false;

for (const c of checks) {
  const value = process.env[c.name];
  const present = Boolean(value && value.length > 0);
  const status = present ? "✓" : c.required ? "✗" : "·";

  if (c.required && !present) failed = true;

  // Show only a masked preview for secrets.
  const preview = present
    ? c.secret
      ? `${value!.slice(0, 3)}…${value!.slice(-2)} (${value!.length} chars)`
      : value
    : "(unset)";

  console.log(`${status} ${c.name.padEnd(34)} ${preview}`);
  if (!present && !c.required) console.log(`    hint: ${c.hint}`);
  if (!present && c.required) console.log(`    REQUIRED — ${c.hint}`);
}

// Guard rails that cannot be checked from env alone.
const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
const streamConfigured = Boolean(process.env.CLOUDFLARE_STREAM_API_TOKEN);
console.log("");
console.log(`ads enabled:            ${adsEnabled ? "YES (only legal after provider approval)" : "no"}`);
console.log(`stream configured:      ${streamConfigured ? "yes" : "no — playback will return 503"}`);

// A NEXT_PUBLIC_ service key would leak to the browser; refuse loudly.
const leaked = Object.keys(process.env).find(
  (k) => k.startsWith("NEXT_PUBLIC_") && process.env[k] && process.env[k]!.length > 200,
);
if (leaked) {
  console.error(`\n⚠ ${leaked} looks like a secret in a NEXT_PUBLIC_ variable — it would ship to the browser.`);
  failed = true;
}

process.exit(failed ? 1 : 0);
