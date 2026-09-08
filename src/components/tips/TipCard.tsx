"use client";
import { SlipViewer } from "@/components/ui/SlipViewer";
import { CopyButton } from "@/components/ui/CopyButton";
import { statusDot, statusAccent } from "@/components/ui/StatusBadge";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { m } from "motion/react";
import { cardEnter, spring, playfulSpring, viewportOnce } from "@/lib/motion";

type Tip = {
  id: string;
  imageUrl: string;
  bookingCode: string;
  bookmaker: string;
  odds: number | null;
  confidence: number | null;
  status: string;
  createdAt: Date | string;
};

function payoutExample(odds: number | null) {
  if (odds == null || odds <= 1) return null;
  const stake = 1000;
  const payout = Math.round(stake * odds);
  return `₦${stake.toLocaleString()} → ₦${payout.toLocaleString()}`;
}

export function TipCard({ tip }: { tip: Tip }) {
  const accent = statusAccent(tip.status);
  const dot = statusDot(tip.status);
  const statusLabel = tip.status === "WON" ? "Won" : tip.status === "LOST" ? "Lost" : tip.status === "CANCELLED" ? "Cancelled" : "Pending";
  const odds = tip.odds ?? null;

  return (
    <m.article
      variants={cardEnter}
      initial="initial"
      whileInView="animate"
      viewport={viewportOnce}
      whileHover={{ y: -4 }}
      transition={spring}
      className="overflow-hidden rounded-[18px] border border-[var(--th-border)] bg-[var(--th-surface)]"
    >
      <m.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={viewportOnce} transition={playfulSpring} style={{ originX: 0 }} className={`h-[3px] w-full ${accent}`} aria-hidden />

      <div className="bg-[#0E1013]/40">
        <SlipViewer src={tip.imageUrl} alt={`Slip ${tip.bookingCode}`} />
      </div>

      <div className="flex items-center justify-between gap-3 px-5 pt-4">
        <span className="text-[12px] font-[400] tracking-[0.04em] text-[var(--th-sub)]">{tip.bookmaker}</span>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-[400] text-[var(--th-sub)]">
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-[1.2fr_0.9fr] gap-4 px-5 pt-3">
        <div>
          <div className="font-display text-[32px] font-[500] leading-none tracking-[-0.03em] text-[var(--th-text)]">
            {odds != null ? odds.toFixed(2) : "—"}
          </div>
          <div className="mt-1 text-[12px] font-[400] text-[var(--th-sub)]">Combined odds</div>
        </div>
        <div className="text-right">
          <div className="text-[13px] font-[500] text-[var(--th-text)]">
            {tip.confidence != null ? `${tip.confidence}% confidence` : payoutExample(odds) ? "1 selection" : "—"}
          </div>
          <div className="mt-1 text-[12px] text-[var(--th-sub)]">
            {payoutExample(odds) ? payoutExample(odds) : tip.confidence != null ? "" : formatDate(tip.createdAt)}
          </div>
          {payoutExample(odds) && tip.confidence == null && <div className="text-[12px] text-[var(--th-sub)]">{formatDate(tip.createdAt)}</div>}
        </div>
      </div>

      <div className="relative my-4 flex items-center">
        <span className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--th-bg)] border border-[var(--th-border)]" aria-hidden />
        <span className="absolute right-0 top-1/2 h-3 w-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--th-bg)] border border-[var(--th-border)]" aria-hidden />
        <div className="mx-5 flex-1 border-t border-dashed border-[var(--th-border)]" />
      </div>

      <div className="flex items-center justify-between gap-3 px-5 pb-5">
        <span className="inline-flex items-center rounded-[9px] border border-[var(--th-border)] bg-[var(--th-chip)] px-3 py-1.5 font-mono text-[13px] font-[500] tracking-[0.06em] text-[var(--th-text)]">
          {tip.bookingCode}
        </span>
        <CopyButton code={tip.bookingCode} />
      </div>

      <div className="border-t border-[var(--th-border)] px-5 py-2.5 flex items-center justify-between">
        <span className="text-[12px] text-[var(--th-sub)]">{formatDate(tip.createdAt)}</span>
        <Link href={`/tips/${tip.id}`} className="text-[12px] font-[500] tracking-[0.02em] text-[var(--th-sub)] hover:text-[var(--th-text)]">
          View details →
        </Link>
      </div>
    </m.article>
  );
}
