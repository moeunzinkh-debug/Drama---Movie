/**
 * Grants the admin role to an existing account.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node --experimental-strip-types scripts/bootstrap-admin.ts you@example.com
 *
 * Deliberately requires the service-role key and runs outside the app: there is
 * no public endpoint that can create an admin, and the first admin cannot be
 * granted from the browser.
 */
import { createClient } from "@supabase/supabase-js";

const email = process.argv[2];
if (!email) {
  console.error("Usage: bootstrap-admin.ts <email-of-existing-account>");
  process.exit(1);
}

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment.");
  process.exit(1);
}

const admin = createClient(url, key, { auth: { persistSession: false } });

const { data: account, error: findError } = await admin
  .from("accounts")
  .select("id, email, display_name")
  .eq("email", email)
  .maybeSingle();

if (findError) {
  console.error("Lookup failed:", findError.message);
  process.exit(1);
}

if (!account) {
  console.error(
    `No account for ${email}. Sign in with Google once first so the account row exists.`,
  );
  process.exit(1);
}

const { error } = await admin
  .from("user_roles")
  .upsert({ account_id: account.id, role: "admin" }, { onConflict: "account_id,role" });

if (error) {
  console.error("Grant failed:", error.message);
  process.exit(1);
}

await admin.from("admin_audit_logs").insert({
  actor_id: account.id,
  action: "role.grant",
  entity: "user_roles",
  entity_id: account.id,
  after: { role: "admin", via: "bootstrap-admin script" },
});

console.log(`✓ ${email} (${account.id}) is now an admin.`);
