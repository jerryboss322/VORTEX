import { prisma } from "@/lib/db";
import { TipGrid } from "@/components/tips/TipGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { getResultsStats } from "@/lib/tips";
import { StatsStrip } from "@/components/results/StatsStrip";
import { Reveal } from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

type SP = { status?: string; bookmaker?: string; from?: string; to?: string; q?: string };

export default async function ResultsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const status = sp.status || "ALL";
  const bookmaker = sp.bookmaker || "";
  const from = sp.from || "";
  const to = sp.to || "";
  const q = sp.q || "";

  const where: any = status === "ALL" ? { status: { in: ["WON", "LOST", "CANCELLED"] } } : { status };
  if (bookmaker) where.bookmaker = { contains: bookmaker, mode: "insensitive" };
  if (q) where.OR = [{ bookingCode: { contains: q, mode: "insensitive" } }, { bookmaker: { contains: q, mode: "insensitive" } }];
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) {
      const d = new Date(to);
      d.setHours(23, 59, 59, 999);
      where.createdAt.lte = d;
    }
    if (where.createdAt.gte && isNaN(where.createdAt.gte.getTime())) delete where.createdAt.gte;
    if (where.createdAt.lte && isNaN(where.createdAt.lte.getTime())) delete where.createdAt.lte;
    if (Object.keys(where.createdAt).length === 0) delete where.createdAt;
  }

  let tips: any[] = [];
  try {
    tips = await prisma.tip.findMany({ where, orderBy: { updatedAt: "desc" }, take: 40 });
  } catch {}

  const stats = await getResultsStats({
    status,
    bookmaker: bookmaker || undefined,
    search: q || undefined,
    dateFrom: from || undefined,
    dateTo: to || undefined,
  }).catch(() => null);

  function qs(over: Partial<SP>) {
    const p = new URLSearchParams();
    const s = { status, bookmaker, from, to, q, ...over } as SP;
    if (s.status && s.status !== "ALL") p.set("status", s.status);
    if (s.bookmaker) p.set("bookmaker", s.bookmaker);
    if (s.from) p.set("from", s.from);
    if (s.to) p.set("to", s.to);
    if (s.q) p.set("q", s.q);
    const str = p.toString();
    return str ? `/results?${str}` : "/results";
  }

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-8">
      <Reveal>
        <div className="rounded-[20px] border border-[var(--th-border)] bg-[var(--th-surface)] p-7 sm:p-8">
          <h1 className="font-display text-[25px] font-[500] tracking-[-0.02em] text-[var(--th-text)]">Results</h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--th-sub)]">Settled tips with credibility stats.</p>

        {stats && (
          <div className="mt-6">
            <StatsStrip stats={stats} />
          </div>
        )}

        <form method="GET" className="mt-6 flex flex-wrap gap-3 rounded-[14px] border border-[var(--th-border)] bg-[var(--th-bg)]/60 p-4 items-end">
          {status !== "ALL" && <input type="hidden" name="status" value={status} />}
          <div className="flex flex-col">
            <label className="text-[11px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">Search</label>
            <input
              name="q"
              defaultValue={q}
              placeholder="Code / bookmaker"
              className="mt-1.5 rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2 text-[13px] text-[var(--th-text)] placeholder:text-[var(--th-sub)] outline-none focus:border-[var(--th-text)]/20"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[11px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">Bookmaker</label>
            <input
              name="bookmaker"
              defaultValue={bookmaker}
              placeholder="Bet9ja"
              className="mt-1.5 rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2 text-[13px] text-[var(--th-text)] placeholder:text-[var(--th-sub)] outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[11px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">From</label>
            <input
              type="date"
              name="from"
              defaultValue={from}
              className="mt-1.5 rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-3 py-2 text-[13px] text-[var(--th-text)] outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[11px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">To</label>
            <input
              type="date"
              name="to"
              defaultValue={to}
              className="mt-1.5 rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-3 py-2 text-[13px] text-[var(--th-text)] outline-none"
            />
          </div>
          <button type="submit" className="rounded-full bg-[var(--th-text)] px-5 py-2 text-[12px] font-[500] text-[#0E1013] hover:bg-[#ddd8cf]">
            Filter
          </button>
          <a href="/results" className="rounded-full border border-[var(--th-border)] px-4 py-2 text-[12px] font-[500] text-[var(--th-sub)] hover:text-[var(--th-text)] hover:border-[var(--th-text)]/15">
            Clear
          </a>
        </form>

        <div className="mt-4 flex gap-2 flex-wrap">
          {["ALL", "WON", "LOST", "CANCELLED"].map((s) => (
            <a
              key={s}
              href={qs({ status: s })}
              className={`rounded-full border px-3.5 py-1.5 text-[12px] font-[500] tracking-[0.02em] transition-colors ${
                status === s ? "border-[var(--th-gold)] bg-[var(--th-gold)] text-[#0E1013]" : "border-[var(--th-border)] text-[var(--th-sub)] hover:text-[var(--th-text)] hover:border-[var(--th-text)]/15"
              }`}
            >
              {s}
            </a>
          ))}
        </div>
        </div>
      </Reveal>

      <div className="mt-8">
        {tips.length === 0 ? <EmptyState title="No completed tips yet." description="Settled slips appear here after admin marks results." /> : <TipGrid tips={tips} />}
      </div>
    </div>
  );
}
