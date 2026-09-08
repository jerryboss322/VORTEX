import { prisma } from "@/lib/db";
import { TipCard } from "@/components/tips/TipCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatBar } from "@/components/tips/StatBar";
import { getResultsStats } from "@/lib/tips";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const active = await prisma.tip.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "desc" }, take: 6 }).catch(() => []);
  const recentResults = await prisma.tip.findMany({ where: { status: { in: ["WON", "LOST"] } }, orderBy: { updatedAt: "desc" }, take: 6 }).catch(() => []);
  const stats = await getResultsStats({}).catch(() => null);

  const now = new Date();
  const monthLabel = now.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      {/* hero — ticket is the hero, nav is quiet; stat bar gives trust before list */}
      <Reveal>
        <section className="rounded-[20px] border border-[var(--th-border)] bg-[var(--th-surface)] p-7 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="text-[12px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">Private slips · {monthLabel}</div>
            <h1 className="mt-2 font-display text-[25px] font-[500] leading-none tracking-[-0.02em] text-[var(--th-text)]">Today&apos;s tips</h1>
            <p className="mt-2 max-w-[560px] text-[13px] leading-relaxed text-[var(--th-sub)]">
              Official slips. Copy the booking code and use it on your bookmaker. The track record below is why this page is worth following.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/tips" className="rounded-full bg-[var(--th-text)] px-4 py-2 text-[12px] font-[500] text-[#0E1013] hover:bg-[#ddd8cf] transition-colors">
              Browse tips
            </Link>
            <Link href="/results" className="rounded-full border border-[var(--th-border)] px-4 py-2 text-[12px] font-[500] text-[var(--th-text)] hover:bg-[var(--th-chip)] transition-colors">
              Results
            </Link>
          </div>
        </div>

        {stats && (
          <div className="mt-6">
            <StatBar
              stats={[
                { label: "Tips this month", value: String(stats.total), sub: `${stats.pending} pending · ${stats.totalSettled} settled` },
                { label: "Win rate", value: `${stats.winRate.toFixed(1)}%`, sub: `${stats.won}W · ${stats.lost}L` },
                { label: "Avg odds", value: stats.avgOdds != null ? stats.avgOdds.toFixed(2) : "—", sub: stats.avgOddsWon != null ? `Won avg ${stats.avgOddsWon.toFixed(2)}` : "—" },
              ]}
            />
          </div>
        )}
        </section>
      </Reveal>

      <Reveal delay={0.06}>
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[15px] font-[500] tracking-[-0.01em] text-[var(--th-text)]">Active Tips</h2>
            <Link href="/tips" className="text-[12px] font-[500] tracking-[0.02em] text-[var(--th-sub)] hover:text-[var(--th-text)]">View all →</Link>
          </div>
          {active.length === 0 ? (
            <EmptyState title="No tips have been published yet." description="Check back later — official slips appear here." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {active.map((t) => (
                <TipCard key={t.id} tip={t} />
              ))}
            </div>
          )}
        </section>
      </Reveal>

      <Reveal delay={0.1}>
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[15px] font-[500] tracking-[-0.01em] text-[var(--th-text)]">Recent Results</h2>
            <Link href="/results" className="text-[12px] font-[500] tracking-[0.02em] text-[var(--th-sub)] hover:text-[var(--th-text)]">View results →</Link>
          </div>
          {recentResults.length === 0 ? (
            <EmptyState title="No completed tips yet." description="Settled slips will appear here once results are posted." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentResults.map((t) => (
                <TipCard key={t.id} tip={t} />
              ))}
            </div>
          )}
        </section>
      </Reveal>
    </div>
  );
}
