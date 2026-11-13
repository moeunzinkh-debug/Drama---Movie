"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setAdPlacementEnabled } from "@/actions/admin";

export default function AdToggle({
  id,
  enabled,
  providerEnabled,
}: {
  id: string;
  enabled: boolean;
  providerEnabled: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="flex flex-col gap-1">
      <button
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const res = await setAdPlacementEnabled(id, !enabled);
            if (!res.ok) setError(res.error);
            router.refresh();
          })
        }
        disabled={pending}
        aria-pressed={enabled}
        className={`rounded-full px-3 py-1 text-xs transition disabled:opacity-50 ${
          enabled
            ? "bg-emerald-500/15 text-emerald-300"
            : providerEnabled
              ? "border border-line text-mist hover:text-white"
              : "border border-line text-mist/40"
        }`}
      >
        {enabled ? "បើក" : "បិទ"}
      </button>
      {error && <span className="max-w-[16rem] text-[10px] leading-tight text-red-400">{error}</span>}
    </span>
  );
}
