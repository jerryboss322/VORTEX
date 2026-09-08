"use client";
import { m } from "motion/react";
import { spring, viewportOnce } from "@/lib/motion";

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <m.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={spring} className="rounded-[14px] border border-dashed border-[var(--th-border)] bg-transparent px-8 py-14 text-center">
      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-[9px] bg-[var(--th-chip)] border border-[var(--th-border)] text-[var(--th-sub)]" aria-hidden>
        ◯
      </div>
      <p className="mt-4 font-display text-[15px] font-[500] tracking-[-0.01em] text-[var(--th-text)]">{title}</p>
      {description && <p className="mx-auto mt-1.5 max-w-sm text-[13px] leading-relaxed text-[var(--th-sub)]">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </m.div>
  );
}
