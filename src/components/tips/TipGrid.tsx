"use client";
import { TipCard } from "./TipCard";
import { m } from "motion/react";
import { staggerContainer, viewportOnce } from "@/lib/motion";

export function TipGrid({ tips }: { tips: any[] }) {
  if (tips.length === 0) return null;
  return (
    <m.div
      initial="initial"
      whileInView="animate"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {tips.map((t) => (
        <TipCard key={t.id} tip={t} />
      ))}
    </m.div>
  );
}

export function DateGrouped({ groups }: { groups: { date: string; tips: any[] }[] }) {
  return (
    <div className="space-y-8">
      {groups.map((g, idx) => (
        <m.section
          key={g.date}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.22, delay: idx * 0.04 }}
        >
          <h3 className="mb-3 flex items-center gap-2 text-[12px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">
            <span className={`h-1.5 w-1.5 rounded-full ${idx === 0 ? "bg-[var(--th-gold)]" : "bg-[var(--th-sub)]"}`} />
            {g.date}
          </h3>
          <m.div
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {g.tips.map((t: any) => (
              <TipCard key={t.id} tip={t} />
            ))}
          </m.div>
        </m.section>
      ))}
    </div>
  );
}
