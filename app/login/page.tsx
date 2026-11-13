"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useSession } from "@/components/session-provider";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const { signIn, user } = useSession();
  const [name, setName] = useState("");

  if (user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-lg font-semibold">អ្នកបានចូលរួចហើយ</p>
        <p className="mt-1 text-sm text-mist">{user.email}</p>
        <button onClick={() => router.push(next)} className="mt-6 rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink">
          បន្ត
        </button>
      </div>
    );
  }

  function handle(e: React.FormEvent) {
    e.preventDefault();
    signIn(name.trim() || "អ្នកមើល");
    router.push(next);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-black tracking-tight">ចូលដោយ Google</h1>
      <p className="mt-2 text-sm leading-relaxed text-mist">
        ចូលដើម្បីមើលវីដេអូ រក្សាទុកបញ្ជីរបស់អ្នក និងបន្តមើលពីកន្លែងដែលអ្នកឈប់។
      </p>

      <div className="mt-6 rounded-xl border border-gold/30 bg-gold/5 p-4 text-xs leading-relaxed text-gold/90">
        <strong className="block text-sm">សូមចំណាំ៖ នេះជាការចូលសាកល្បង</strong>
        Google OAuth ពិតប្រាកដមិនទាន់បានកំណត់ទេ។ សូមបញ្ចូលឈ្មោះដើម្បីសាកល្បងចំណុចប្រទាក់។
        ទិន្នន័យសម័យនេះរក្សាទុកក្នុងកម្មវិធីរុករករបស់អ្នកតែប៉ុណ្ណោះ។
      </div>

      <form onSubmit={handle} className="mt-5 space-y-3">
        <div>
          <label htmlFor="name" className="mb-1 block text-xs uppercase tracking-wider text-mist/70">
            ឈ្មោះបង្ហាញ
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ឧ. សុភា"
            className="w-full rounded-lg border border-line bg-ink-2 px-4 py-3 text-sm outline-none focus:border-gold/60"
            autoComplete="name"
          />
        </div>
        <button type="submit" className="w-full rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink transition hover:bg-gold-dim">
          បន្តក្នុងនាមជាភ្ញៀវសាកល្បង
        </button>
      </form>

      <p className="mt-6 text-[11px] leading-relaxed text-mist/50">
        ការប្រើប្រាស់សេវាកម្មនេះមានន័យថាអ្នកយល់ព្រមនឹង{" "}
        <a href="/terms" className="text-gold/80 underline underline-offset-4">លក្ខខណ្ឌប្រើប្រាស់</a>{" "}
        និង{" "}
        <a href="/privacy" className="text-gold/80 underline underline-offset-4">គោលការណ៍ភាពឯកជន</a>។
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-mist">កំពុងផ្ទុក…</div>}>
      <LoginForm />
    </Suspense>
  );
}
