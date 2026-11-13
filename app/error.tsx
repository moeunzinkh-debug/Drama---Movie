"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-level error boundary.
 *
 * Next.js renders this when a page throws during render. It must not leak the
 * raw error to the viewer: `digest` is safe to show (it correlates with the
 * server log), the message is not.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side logging happens in the Worker; this is the browser-side trace.
    console.error("[cinema-kh] render error", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-5xl font-black text-gold">!</p>
      <h1 className="mt-3 text-xl font-bold">មានបញ្ហាបច្ចេកទេស</h1>
      <p className="mt-2 text-sm leading-relaxed text-mist">
        សូមព្យាយាមម្តងទៀត។ ប្រសិនបើបញ្ហានៅតែកើតឡើង សូមរាយការណ៍ជាមួយលេខខាងក្រោម។
      </p>

      {error.digest && (
        <p className="mt-4 inline-block rounded-lg border border-line bg-ink-2 px-3 py-1.5 font-mono text-[11px] text-mist">
          Ref: {error.digest}
        </p>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          onClick={reset}
          className="rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink transition hover:bg-gold-dim"
        >
          ព្យាយាមម្តងទៀត
        </button>
        <Link
          href="/"
          className="rounded-full border border-line px-6 py-3 text-sm text-mist transition hover:border-gold/50 hover:text-gold"
        >
          ទំព័រដើម
        </Link>
      </div>
    </div>
  );
}
