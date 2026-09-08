import { prisma } from "@/lib/db";
import { StatusBadge, statusAccent } from "@/components/ui/StatusBadge";
import { CopyButton } from "@/components/ui/CopyButton";
import { notFound } from "next/navigation";
import { formatDateTime } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

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
  const accent = statusAccent(tip.status);
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <a href="/tips" className="text-[12px] font-[500] tracking-[0.02em] text-[var(--th-sub)] hover:text-[var(--th-text)]">← Back to tips</a>
      <Reveal>
        <div className="mt-4 overflow-hidden rounded-[18px] border border-[var(--th-border)] bg-[var(--th-surface)]">
        <div className={`h-[3px] w-full ${accent}`} aria-hidden />
        <div className="bg-[#0E1013]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tip.imageUrl} alt={tip.bookingCode} className="w-full h-auto max-h-[700px] object-contain" />
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">Booking Code</div>
              <div className="mt-2 flex items-center gap-3">
                <span className="rounded-[9px] border border-[var(--th-border)] bg-[var(--th-chip)] px-3 py-1.5 font-mono text-[15px] font-[500] tracking-[0.06em] text-[var(--th-text)]">
                  {tip.bookingCode}
                </span>
                <CopyButton code={tip.bookingCode} />
              </div>
            </div>
            <StatusBadge status={tip.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-[var(--th-border)] pt-5">
            <div>
              <div className="text-[11px] tracking-[0.08em] uppercase text-[var(--th-sub)]">Bookmaker</div>
              <div className="mt-1 text-[13px] font-[500] text-[var(--th-text)]">{tip.bookmaker}</div>
            </div>
            <div>
              <div className="text-[11px] tracking-[0.08em] uppercase text-[var(--th-sub)]">Odds</div>
              <div className="mt-1 font-display text-[20px] font-[500] tracking-[-0.02em] text-[var(--th-text)]">{tip.odds ?? "—"}</div>
            </div>
            <div>
              <div className="text-[11px] tracking-[0.08em] uppercase text-[var(--th-sub)]">Confidence</div>
              <div className="mt-1 text-[13px] font-[500] text-[var(--th-text)]">{tip.confidence != null ? `${tip.confidence}%` : "—"}</div>
            </div>
            <div>
              <div className="text-[11px] tracking-[0.08em] uppercase text-[var(--th-sub)]">Posted</div>
              <div className="mt-1 text-[13px] text-[var(--th-sub)]">{formatDateTime(tip.createdAt)}</div>
            </div>
          </div>
          {tip.note && <div className="border-t border-[var(--th-border)] pt-4 text-[13px] leading-relaxed text-[var(--th-text)]">{tip.note}</div>}
        </div>
        </div>
      </Reveal>
    </div>
  );
}
