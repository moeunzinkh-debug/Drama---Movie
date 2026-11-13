import { explainAuthError } from "@/lib/auth-errors";

/**
 * Shows why sign-in failed, in Khmer, with the specific setting to fix.
 *
 * The detail is only rendered in development: in production a visitor should
 * get a readable message and a retry path, not the site's configuration.
 */
export default function AuthError({ error }: { error: string }) {
  const help = explainAuthError(error);
  const showSteps = process.env.NODE_ENV !== "production";

  return (
    <div
      role="alert"
      className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-xs leading-relaxed text-red-200/90"
    >
      <strong className="block text-sm text-red-200">ការចូលមិនបានជោគជ័យ</strong>
      <p className="mt-1.5">{help.message}</p>

      {showSteps && help.steps.length > 0 && (
        <ol className="mt-3 list-decimal space-y-1 border-t border-red-500/20 pt-3 pl-4 text-red-200/80">
          {help.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      )}

      {showSteps && (
        <p className="mt-3 border-t border-red-500/20 pt-3 text-[11px] text-red-200/60">
          ព័ត៌មានបច្ចេកទេស៖ <code className="break-all">{error}</code>
        </p>
      )}
    </div>
  );
}
