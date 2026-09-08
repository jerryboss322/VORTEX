import { prisma } from "@/lib/db";
import { DateGrouped } from "@/components/tips/TipGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { groupByDate } from "@/lib/tips";
import { Reveal } from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export default async function TipsPage({ searchParams }: { searchParams: Promise<{ q?: string; bookmaker?: string; status?: string; page?: string }> }) {
  const sp = await searchParams;
  const where: any = { status: sp.status || "PENDING" };
  if (sp.bookmaker) where.bookmaker = { contains: sp.bookmaker, mode: "insensitive" };
  if (sp.q) where.OR = [{ bookingCode: { contains: sp.q, mode: "insensitive" } }, { bookmaker: { contains: sp.q, mode: "insensitive" } }];
  let tips: any[] = [];
  try {
    tips = await prisma.tip.findMany({ where, orderBy: { createdAt: "desc" }, take: 40 });
  } catch {}
  const groups = groupByDate(tips);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <Reveal>
        <div className="rounded-[20px] border border-[var(--th-border)] bg-[var(--th-surface)] p-7 sm:p-8">
        <h1 className="font-display text-[25px] font-[500] tracking-[-0.02em] text-[var(--th-text)]">Tips</h1>
        <p className="mt-1.5 max-w-[560px] text-[13px] leading-relaxed text-[var(--th-sub)]">Browse official slips. Filter by code, bookmaker, or status.</p>

        <form className="mt-6 flex flex-wrap gap-2 rounded-[14px] border border-[var(--th-border)] bg-[var(--th-bg)]/60 p-3">
          <input
            name="q"
            defaultValue={sp.q || ""}
            placeholder="Booking code / bookmaker"
            className="min-w-[200px] flex-1 rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2 text-[13px] placeholder:text-[var(--th-sub)] outline-none focus:border-[var(--th-text)]/20"
          />
          <input
            name="bookmaker"
            defaultValue={sp.bookmaker || ""}
            placeholder="Bookmaker"
            className="w-[160px] rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2 text-[13px] placeholder:text-[var(--th-sub)] outline-none focus:border-[var(--th-text)]/20"
          />
          <select
            name="status"
            defaultValue={sp.status || "PENDING"}
            className="rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2 text-[13px] text-[var(--th-text)] outline-none"
          >
            <option value="PENDING">Pending</option>
            <option value="WON">Won</option>
            <option value="LOST">Lost</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button className="rounded-full bg-[var(--th-text)] px-5 py-2 text-[12px] font-[500] tracking-[0.02em] text-[#0E1013] hover:bg-[#ddd8cf]">Filter</button>
          <a
            href="/tips"
            className="rounded-full border border-[var(--th-border)] px-4 py-2 text-[12px] font-[500] text-[var(--th-sub)] hover:text-[var(--th-text)] hover:border-[var(--th-text)]/15"
          >
            Clear
          </a>
        </form>
        </div>
      </Reveal>

      <div className="mt-8">
        {tips.length === 0 ? <EmptyState title="No tips found." description="Try a different filter or check back later." /> : <DateGrouped groups={groups} />}
      </div>
    </div>
  );
}
