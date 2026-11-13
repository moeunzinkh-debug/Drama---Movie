"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setRequestStatus } from "@/actions/admin";

const STATUSES = ["pending", "planned", "fulfilled", "rejected"] as const;
const LABELS: Record<string, string> = {
  pending: "រង់ចាំ",
  planned: "គ្រោងទុក",
  fulfilled: "បានបន្ថែម",
  rejected: "បដិសេធ",
};

export default function RequestStatusControl({
  requestId,
  status,
}: {
  requestId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      aria-label="ស្ថានភាពសំណើ"
      onChange={(e) => {
        const next = e.target.value as (typeof STATUSES)[number];
        startTransition(async () => {
          await setRequestStatus(requestId, next);
          router.refresh();
        });
      }}
      className="rounded-md border border-line bg-ink px-2 py-1 text-xs"
    >
      {STATUSES.map((s) => <option key={s} value={s}>{LABELS[s]}</option>)}
    </select>
  );
}
