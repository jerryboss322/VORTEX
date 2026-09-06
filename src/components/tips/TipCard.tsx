import { StatusBadge } from "@/components/ui/StatusBadge";
import { CopyButton } from "@/components/ui/CopyButton";
import { SlipViewer } from "@/components/ui/SlipViewer";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

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

export function TipCard({ tip }: { tip: Tip }) {
  const topColor =
    tip.status === "PENDING" ? "border-t-amber-500/50" : tip.status === "WON" ? "border-t-violet-500/50" : tip.status === "LOST" ? "border-t-red-500/30" : "border-t-zinc-700";
  return (
    <article className={`overflow-hidden rounded-lg border border-[#262626] bg-[#141414] flex flex-col border-t-2 ${topColor}`}>
      <SlipViewer src={tip.imageUrl} alt={`Slip ${tip.bookingCode}`} />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] tracking-wide text-zinc-500 uppercase font-semibold flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${tip.status === "PENDING" ? "bg-amber-400" : tip.status === "WON" ? "bg-violet-400" : "bg-zinc-600"}`} />
              Booking Code
            </div>
            <div className="text-sm font-mono font-bold tracking-wide text-white">{tip.bookingCode}</div>
          </div>
          <CopyButton code={tip.bookingCode} />
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#262626] bg-[#0a0a0a] px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/70" />
            {tip.bookmaker}
          </span>
          {tip.odds != null && <span className="rounded-full border border-[#262626] bg-[#0a0a0a] px-2.5 py-1">Odds: {tip.odds}</span>}
          {tip.confidence != null && <span className="rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-300 px-2.5 py-1">Confidence: {tip.confidence}%</span>}
        </div>
        <div className="flex items-center justify-between">
          <StatusBadge status={tip.status} />
          <span className="text-xs text-zinc-500">{formatDate(tip.createdAt)}</span>
        </div>
        <Link href={`/tips/${tip.id}`} className="text-xs font-semibold text-zinc-300 hover:text-white">
          View details →
        </Link>
      </div>
    </article>
  );
}
