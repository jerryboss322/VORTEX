"use client";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { deleteTipAction, updateTipStatusAction } from "@/lib/actions";
import Link from "next/link";
import { useTransition } from "react";

export function TipRow({ tip }: { tip: any }) {
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#262626] bg-[#141414] p-3">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tip.imageUrl} alt={tip.bookingCode} className="h-12 w-20 object-cover rounded bg-zinc-900 border border-[#262626]" />
        <div>
          <div className="font-mono text-sm font-bold">{tip.bookingCode}</div>
          <div className="text-xs text-zinc-500">{tip.bookmaker} · Odds {tip.odds ?? "—"} {tip.confidence != null ? `· ${tip.confidence}%` : ""}</div>
        </div>
        <StatusBadge status={tip.status} />
      </div>
      <div className="flex items-center gap-2">
        <Link href={`/admin/tips/${tip.id}/edit`} className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-1.5 text-xs font-medium hover:bg-zinc-900">
          Edit odds
        </Link>
        <ConfirmDialog
          title="Delete tip?"
          description={`This will permanently delete ${tip.bookingCode} and its R2 image. This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={async () => {
            try {
              await deleteTipAction(tip.id);
            } catch (e: any) {
              alert(e?.message || "Failed to delete. Please login again.");
            }
          }}
        >
          <button className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">Delete</button>
        </ConfirmDialog>
        <form
          action={(fd: FormData) => {
            const s = fd.get("status") as string;
            start(async () => {
              try {
                await updateTipStatusAction(tip.id, s);
              } catch (e: any) {
                alert(e?.message || "Failed to update status. Please login again.");
              }
            });
          }}
          className="flex items-center gap-1"
        >
          <select name="status" defaultValue={tip.status} className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-2 py-1.5 text-xs outline-none">
            <option value="PENDING">PENDING</option>
            <option value="WON">WON</option>
            <option value="LOST">LOST</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          <button disabled={pending} className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-black disabled:opacity-50">
            {pending ? "…" : "Set"}
          </button>
        </form>
      </div>
    </div>
  );
}
