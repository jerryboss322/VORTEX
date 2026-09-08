"use client";
import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { playfulSpring, spring } from "@/lib/motion";

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  async function handle() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  }
  return (
    <div className="flex items-center gap-2">
      <m.button
        onClick={handle}
        whileTap={{ scale: 0.97 }}
        transition={spring}
        className={`rounded-full border px-3.5 py-1.5 text-[12px] font-[500] tracking-[0.02em] transition-colors ${
          copied
            ? "border-[var(--th-green)] bg-[var(--th-green)] text-[#0E1013]"
            : "border-[var(--th-border)] bg-transparent text-[var(--th-text)] hover:border-[var(--th-text)]/20 hover:bg-[var(--th-chip)]"
        }`}
        aria-label="Copy booking code"
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.span
            key={copied ? "copied" : "copy"}
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={copied ? playfulSpring : { duration: 0.14 }}
            className="inline-block"
          >
            {copied ? "Copied" : "Copy"}
          </m.span>
        </AnimatePresence>
      </m.button>
      <AnimatePresence>
        {error && (
          <m.span initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="text-[12px] text-[var(--th-red)]">
            Unable to copy.
          </m.span>
        )}
      </AnimatePresence>
    </div>
  );
}
