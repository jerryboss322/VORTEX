"use client";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { StatusControl } from "./StatusControl";
import { deleteTipAction } from "@/lib/actions";
import Link from "next/link";
import { m } from "motion/react";
import { viewportAdmin } from "@/lib/motion";

export function TipRow({ tip }: { tip: any }) {
  return (
    <m.div
      layout="position"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={viewportAdmin}
      transition={{ duration: 0.15 }}
      className="flex flex-col gap-3 rounded-none border-b border-[var(--th-border)] bg-transparent px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tip.imageUrl} alt={tip.bookingCode} className="h-12 w-20 object-contain bg-[#0E1013] rounded-[8px] border border-[var(--th-border)] shrink-0" loading="lazy" decoding="async" />
        <div className="min-w-0">
          <div className="font-mono text-[13px] font-[500] tracking-[0.04em] text-[var(--th-text)] truncate">{tip.bookingCode}</div>
          <div className="text-[12px] text-[var(--th-sub)] truncate">
            {tip.bookmaker} · {tip.odds != null ? tip.odds : "—"} {tip.confidence != null ? `· ${tip.confidence}%` : ""}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        <StatusControl id={tip.id} status={tip.status} />
        <Link
          href={`/admin/tips/${tip.id}/edit`}
          className="rounded-full border border-[var(--th-border)] bg-transparent px-3 py-1.5 text-[12px] font-[500] text-[var(--th-sub)] hover:text-[var(--th-text)] hover:border-[var(--th-text)]/15"
        >
          Edit
        </Link>
        <ConfirmDialog
          title="Delete tip?"
          description={`This will permanently delete ${tip.bookingCode} and its image. This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={async () => {
            try {
              await deleteTipAction(tip.id);
            } catch (e: any) {
              alert(e?.message || "Failed to delete.");
            }
          }}
        >
          <button className="rounded-full border border-[var(--th-red)]/30 bg-transparent px-3 py-1.5 text-[12px] font-[500] text-[var(--th-red)] hover:bg-[var(--th-red)]/10">
            Delete
          </button>
        </ConfirmDialog>
      </div>
    </m.div>
  );
}

export function TipTableHeader() {
  return (
    <div className="hidden sm:grid grid-cols-[1fr_auto] gap-3 border-b border-[var(--th-border)] bg-[var(--th-chip)] px-5 py-2.5 text-[11px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">
      <div className="grid grid-cols-[64px_1fr_90px] gap-3 items-center">
        <span>Preview</span>
        <span>Code · Bookmaker</span>
        <span>Odds</span>
      </div>
      <span className="text-right pr-[2px]">Status · Actions</span>
    </div>
  );
}
