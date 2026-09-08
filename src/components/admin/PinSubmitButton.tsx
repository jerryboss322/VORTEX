"use client";
import { useFormStatus } from "react-dom";
import { RollingSpinner } from "@/components/ui/Skeleton";

export function PinSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--th-text)] py-3 text-[13px] font-[600] tracking-[0.02em] text-[#0E1013] hover:bg-[#ddd8cf] disabled:opacity-60 disabled:cursor-wait"
    >
      {pending && <RollingSpinner size={13} className="text-[#0E1013]" />}
      {pending ? "Unlocking…" : "Unlock"}
    </button>
  );
}
