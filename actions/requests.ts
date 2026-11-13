"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export type RequestResult = { ok: true } | { ok: false; error: string };

/**
 * Submits a movie request.
 *
 * Rate limited in the database (max 5 open requests, and max 10 per day) rather
 * than in the browser, so the limit cannot be bypassed by calling the API directly.
 */
export async function submitMovieRequest(input: {
  title: string;
  country?: string;
  year?: string;
  notes?: string;
}): Promise<RequestResult> {
  const user = await requireUser();

  const title = input.title.trim();
  if (title.length < 2) return { ok: false, error: "សូមបញ្ចូលឈ្មោះរឿងយ៉ាងតិច ២ តួអក្សរ។" };
  if (title.length > 200) return { ok: false, error: "ឈ្មោះរឿងវែងពេក។" };

  const yearNum = input.year ? Number(input.year) : undefined;
  if (yearNum !== undefined && (!Number.isInteger(yearNum) || yearNum < 1900 || yearNum > 2100)) {
    return { ok: false, error: "ឆ្នាំមិនត្រឹមត្រូវ។" };
  }

  const supabase = await createClient();

  const dayAgo = new Date(Date.now() - 86_400_000).toISOString();
  const [{ count: openCount }, { count: todayCount }] = await Promise.all([
    supabase
      .from("movie_requests")
      .select("id", { count: "exact", head: true })
      .eq("account_id", user.account.id)
      .eq("status", "pending"),
    supabase
      .from("movie_requests")
      .select("id", { count: "exact", head: true })
      .eq("account_id", user.account.id)
      .gte("created_at", dayAgo),
  ]);

  if ((openCount ?? 0) >= 5) {
    return { ok: false, error: "អ្នកមានសំណើរង់ចាំ ៥ ហើយ។ សូមរង់ចាំការពិនិត្យសិន។" };
  }
  if ((todayCount ?? 0) >= 10) {
    return { ok: false, error: "អ្នកបានផ្ញើសំណើច្រើនពេកថ្ងៃនេះ។ សូមព្យាយាមថ្ងៃស្អែក។" };
  }

  const { error } = await supabase.from("movie_requests").insert({
    account_id: user.account.id,
    title,
    country: input.country?.slice(0, 40) || null,
    year: yearNum ?? null,
    notes: input.notes?.slice(0, 400) || null,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/request");
  return { ok: true };
}
