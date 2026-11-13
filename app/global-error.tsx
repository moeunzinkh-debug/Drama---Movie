"use client";

/**
 * Last-resort boundary: replaces the root layout when it throws, so it must
 * render its own <html>/<body>. Keep it dependency-free — no Tailwind classes
 * are guaranteed to be available if the stylesheet failed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="km">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#07070c",
          color: "#ececf4",
          fontFamily: "system-ui, -apple-system, 'Noto Sans Khmer', sans-serif",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "26rem" }}>
          <p style={{ fontSize: "2.5rem", fontWeight: 900, color: "#f0b429", margin: 0 }}>!</p>
          <h1 style={{ fontSize: "1.25rem", margin: "0.75rem 0 0.5rem" }}>
            មានបញ្ហាបច្ចេកទេស
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#9a9aad", lineHeight: 1.6, margin: 0 }}>
            សូមផ្ទុកទំព័រឡើងវិញ។ ប្រសិនបើបញ្ហានៅតែកើតឡើង សូមរាយការណ៍។
          </p>
          {error.digest && (
            <p style={{ marginTop: "1rem", fontSize: "0.7rem", color: "#9a9aad", fontFamily: "monospace" }}>
              Ref: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "999px",
              border: 0,
              background: "#f0b429",
              color: "#07070c",
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            ព្យាយាមម្តងទៀត
          </button>
        </div>
      </body>
    </html>
  );
}
