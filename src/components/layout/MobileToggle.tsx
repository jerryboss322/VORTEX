"use client";
import { useState } from "react";

export function MobileToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button aria-label="Menu" className="sm:hidden rounded-full border border-[var(--th-border)] bg-transparent px-3 py-1.5 text-[12px] font-[500] text-[var(--th-text)]" onClick={() => setOpen(!open)}>
        Menu
      </button>
      {open && <div className="border-t border-[var(--th-border)] bg-[var(--th-surface)] sm:hidden">{children}</div>}
    </>
  );
}
