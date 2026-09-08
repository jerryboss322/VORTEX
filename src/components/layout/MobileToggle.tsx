"use client";
import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { spring } from "@/lib/motion";

export function MobileToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button aria-label="Menu" className="sm:hidden rounded-full border border-[var(--th-border)] bg-transparent px-3 py-1.5 text-[12px] font-[500] text-[var(--th-text)]" onClick={() => setOpen(!open)}>
        Menu
      </button>
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, scaleY: 0.97 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.97 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ originY: 0 }}
            className="border-t border-[var(--th-border)] bg-[var(--th-surface)] sm:hidden overflow-hidden"
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
