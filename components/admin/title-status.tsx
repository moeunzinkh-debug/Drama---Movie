"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setTitleStatus } from "@/actions/admin";

const STATUSES = ["draft", "scheduled", "published", "archived"] as const;
const LABELS: Record<string, string> = {
  draft: "ព្រាង",
  scheduled: "កំណត់ទុក",
  published: "បានផ្សាយ",
  archived: "ប័ណ្ណសារ",
};

export default function TitleStatusControl({
  titleId,
  status,
}: {
  titleId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="inline-flex flex-col gap-1">
      <select
        value={status}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as (typeof STATUSES)[number];
          setError(null);
          startTransition(async () => {
            const res = await setTitleStatus(titleId, next);
            if (!res.ok) setError(res.error);
            router.refresh();
          });
        }}
        className="rounded-md border border-line bg-ink px-2 py-1 text-xs"
        aria-label="ផ្លាស់ប្តូរស្ថានភាព"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{LABELS[s]}</option>
        ))}
      </select>
      {error && <span className="text-[10px] text-red-400">{error}</span>}
    </span>
  );
}
