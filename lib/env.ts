/**
 * Runtime environment access.
 *
 * Next.js replaces the literal expression `process.env.NAME` with the value it
 * saw at **build time**. On Cloudflare Workers the real values arrive with the
 * Worker's runtime environment (dashboard Variables and Secrets), so a literal
 * reference bakes in whatever existed during `next build` — usually nothing.
 * The compiled code then reports a missing setting even though the operator
 * configured it.
 *
 * A computed key (`process.env[name]`) cannot be analysed statically, so the
 * lookup survives to runtime where the Worker environment is visible. Every
 * server-side read of a secret must go through these helpers.
 */

const env = (): Record<string, string | undefined> =>
  typeof process !== "undefined" && process.env
    ? (process.env as Record<string, string | undefined>)
    : {};

/** Reads a variable at request time. Empty strings are treated as unset. */
export function readEnv(name: string): string | undefined {
  const value = env()[name];
  return value && value.length > 0 ? value : undefined;
}

/** Reads a variable at request time with a fallback. */
export function readEnvOr(name: string, fallback: string): string {
  return readEnv(name) ?? fallback;
}

/** Reads a numeric variable at request time, falling back when unparsable. */
export function readEnvNumber(name: string, fallback: number): number {
  const raw = readEnv(name);
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
