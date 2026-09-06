"use client";
import { useState } from "react";

export function MobileToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button aria-label="Menu" className="sm:hidden rounded-md border border-[#262626] px-3 py-1.5 text-xs" onClick={() => setOpen(!open)}>
        Menu
      </button>
      {open && <div className="border-t border-[#262626] bg-[#141414] sm:hidden">{children}</div>}
    </>
  );
}
