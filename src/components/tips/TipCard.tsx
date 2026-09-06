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
  return (
    <article className="overflow-hidden rounded-lg border border-[#262626] bg-[#141414] flex flex-col">
      <SlipViewer src={tip.imageUrl} alt={`Slip ${tip.bookingCode}`} />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] tracking-wide text-zinc-500 uppercase font-semibold">Booking Code</div>
            <div className="text-sm font-mono font-bold tracking-wide text-white">{tip.bookingCode}</div>
          </div>
          <CopyButton code={tip.bookingCode} />
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
          <span className="rounded-full border border-[#262626] bg-[#0a0a0a] px-2.5 py-1">{tip.bookmaker}</span>
          {tip.odds != null && <span className="rounded-full border border-[#262626] bg-[#0a0a0a] px-2.5 py-1">Odds: {tip.odds}</span>}
          {tip.confidence != null && <span className="rounded-full border border-[#262626] bg-[#0a0a0a] px-2.5 py-1">Confidence: {tip.confidence}%</span>}
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
