import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CopyButton } from "@/components/ui/CopyButton";
import { notFound } from "next/navigation";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `Tip ${id}`, robots: { index: false, follow: false } };
}

export default async function TipDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let tip: any = null;
  try {
    tip = await prisma.tip.findUnique({ where: { id } });
  } catch {}
  if (!tip) notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <a href="/tips" className="text-xs text-zinc-400 hover:text-white">← Back</a>
      <div className="mt-4 rounded-lg border border-[#262626] bg-[#141414] overflow-hidden">
        <div className="bg-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tip.imageUrl} alt={tip.bookingCode} className="w-full h-auto max-h-[700px] object-contain" />
        </div>
        <div className="p-6 space-y-4">
          <div>
            <div className="text-xs tracking-widest uppercase text-zinc-500 font-semibold">Booking Code</div>
            <div className="mt-1 flex items-center gap-3">
              <span className="text-xl font-mono font-bold">{tip.bookingCode}</span>
              <CopyButton code={tip.bookingCode} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-zinc-500">Bookmaker</div>
              <div className="font-medium">{tip.bookmaker}</div>
            </div>
            <div>
              <div className="text-zinc-500">Odds</div>
              <div className="font-medium">{tip.odds ?? "—"}</div>
            </div>
            <div>
              <div className="text-zinc-500">Confidence</div>
              <div className="font-medium">{tip.confidence != null ? `${tip.confidence}%` : "—"}</div>
            </div>
            <div>
              <div className="text-zinc-500">Status</div>
              <StatusBadge status={tip.status} />
            </div>
          </div>
          {tip.note && <div className="text-sm text-zinc-300 border-t border-[#262626] pt-4">{tip.note}</div>}
          <div className="text-xs text-zinc-500">Posted {formatDateTime(tip.createdAt)}</div>
        </div>
      </div>
    </div>
  );
}
