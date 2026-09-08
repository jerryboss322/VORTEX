"use client";
import type { ResultsStats } from "@/lib/tips";
import { m } from "motion/react";
import { staggerContainer, spring, viewportOnce } from "@/lib/motion";

function fmtPct(n: number) {
  return `${n.toFixed(1)}%`;
}
function fmtOdds(n: number | null) {
  return n == null ? "—" : n.toFixed(2);
}
function fmtProfit(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(0)}`;
}

export function StatsStrip({ stats }: { stats: ResultsStats }) {
  const cards = [
    {
      label: "Win Rate",
      value: fmtPct(stats.winRate),
      sub: `${stats.won}W / ${stats.lost}L · ${stats.totalSettled} settled`,
    },
    {
      label: "Profit (100 stake)",
      value: `${fmtProfit(stats.profit)}`,
      sub: `ROI ${fmtPct(stats.roi)}`,
    },
    {
      label: "Avg Odds",
      value: fmtOdds(stats.avgOdds),
      sub: stats.avgOddsWon != null ? `Avg WON: ${fmtOdds(stats.avgOddsWon)}` : `${stats.total} tips`,
    },
    {
      label: "Current Streak",
      value: stats.currentStreak.type ? `${stats.currentStreak.count} ${stats.currentStreak.type}` : "—",
      sub: `Longest W:${stats.longestWinStreak} L:${stats.longestLoseStreak}`,
    },
  ];

  return (
    <m.div initial="initial" whileInView="animate" viewport={viewportOnce} variants={staggerContainer} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <m.div key={c.label} variants={{ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0, transition: spring } }} className="rounded-[14px] border border-[var(--th-border)] bg-[var(--th-surface)] p-5">
          <div className="text-[11px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">{c.label}</div>
          <div className="mt-2 font-display text-[20px] font-[600] tracking-[-0.02em] text-[var(--th-text)]">{c.value}</div>
          <div className="mt-1 text-[12px] text-[var(--th-sub)]">{c.sub}</div>
        </m.div>
      ))}
    </m.div>
  );
}

export function BookmakerChart({ stats }: { stats: ResultsStats }) {
  const max = Math.max(1, ...stats.bookmakerBreakdown.map((b) => b.total));
  if (stats.bookmakerBreakdown.length === 0) {
    return <p className="text-[13px] text-[var(--th-sub)]">No data for breakdown.</p>;
  }
  return (
    <m.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={spring} className="rounded-[14px] border border-[var(--th-border)] bg-[var(--th-surface)] p-5">
      <div className="text-[11px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">By Bookmaker</div>
      <div className="mt-4 space-y-3">
        {stats.bookmakerBreakdown.map((b, i) => (
          <div key={b.bookmaker} className="space-y-1.5">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-[500] text-[var(--th-text)]">{b.bookmaker}</span>
              <span className="text-[12px] text-[var(--th-sub)]">
                {b.total} tips · {b.won}W {b.lost}L · {fmtPct(b.winRate)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-[var(--th-bg)] border border-[var(--th-border)] overflow-hidden flex">
              <m.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={viewportOnce} transition={{ ...spring, delay: i * 0.04 }} style={{ originX: 0, width: `${(b.won / max) * 100}%` }} className="bg-[var(--th-green)]/70 h-full" title={`WON ${b.won}`} />
              <m.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={viewportOnce} transition={{ ...spring, delay: i * 0.04 + 0.05 }} style={{ originX: 0, width: `${(b.lost / max) * 100}%` }} className="bg-[var(--th-red)]/60 h-full" title={`LOST ${b.lost}`} />
            </div>
          </div>
        ))}
      </div>
    </m.div>
  );
}
