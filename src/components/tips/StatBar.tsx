"use client";
import { m } from "motion/react";
import { staggerContainer, viewportOnce, spring } from "@/lib/motion";

type Stat = { label: string; value: string; sub?: string };

export function StatBar({ stats }: { stats: Stat[] }) {
  if (!stats.length) return null;
  return (
    <m.div
      initial="initial"
      whileInView="animate"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="overflow-hidden rounded-[14px] border border-[var(--th-border)] bg-[var(--th-surface)]"
    >
      <div className="grid grid-cols-3 divide-x divide-[var(--th-border)]">
        {stats.map((s) => (
          <m.div
            key={s.label}
            variants={{ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0, transition: spring } }}
            className="px-5 py-5 sm:px-6 sm:py-6"
          >
            <div className="text-[11px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">{s.label}</div>
            <div className="mt-1.5 font-display text-[19px] font-[600] tracking-[-0.02em] text-[var(--th-text)]">{s.value}</div>
            {s.sub && <div className="mt-1 text-[12px] leading-none text-[var(--th-sub)]">{s.sub}</div>}
          </m.div>
        ))}
      </div>
    </m.div>
  );
}
