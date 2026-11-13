import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signInWithGoogle } from "@/actions/auth";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "ចូលដោយ Google" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next = "/", error } = await searchParams;

  if (isSupabaseConfigured()) {
    const user = await getCurrentUser();
    if (user) redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-black tracking-tight">ចូលដោយ Google</h1>
      <p className="mt-2 text-sm leading-relaxed text-mist">
        ចូលដើម្បីមើលវីដេអូ រក្សាទុកបញ្ជីរបស់អ្នក និងបន្តមើលពីកន្លែងដែលអ្នកឈប់។
      </p>

      {!isSupabaseConfigured() && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-xs leading-relaxed text-red-200/90">
          <strong className="block text-sm text-red-200">មិនទាន់កំណត់ Supabase</strong>
          សូមបន្ថែម <code>NEXT_PUBLIC_SUPABASE_URL</code> និង{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> ក្នុង <code>.env.local</code>។
          សូមមើល <Link href="/" className="underline">docs/SETUP_REAL_BACKEND.md</Link>។
        </div>
      )}

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-xs text-red-200">
          ការចូលមិនបានជោគជ័យ៖ {decodeURIComponent(error)}
        </div>
      )}

      <form action={signInWithGoogle} className="mt-6">
        <input type="hidden" name="next" value={next} />
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 disabled:opacity-60"
          disabled={!isSupabaseConfigured()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M21.35 11.1H12v2.9h5.35c-.23 1.4-1.66 4.1-5.35 4.1A6.1 6.1 0 1 1 12 5.9c1.76 0 2.94.75 3.62 1.4l2.47-2.38A9.6 9.6 0 0 0 12 2.4a9.6 9.6 0 1 0 0 19.2c5.54 0 9.2-3.9 9.2-9.38 0-.63-.07-1.1-.15-1.62z" />
          </svg>
          បន្តដោយ Google
        </button>
      </form>

      <p className="mt-6 text-[11px] leading-relaxed text-mist/50">
        ការប្រើប្រាស់សេវាកម្មនេះមានន័យថាអ្នកយល់ព្រមនឹង{" "}
        <Link href="/terms" className="text-gold/80 underline underline-offset-4">លក្ខខណ្ឌប្រើប្រាស់</Link>{" "}
        និង{" "}
        <Link href="/privacy" className="text-gold/80 underline underline-offset-4">គោលការណ៍ភាពឯកជន</Link>។
      </p>
    </div>
  );
}
