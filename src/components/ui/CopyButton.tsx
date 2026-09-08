"use client";
import { useState } from "react";

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
      <button
        onClick={handle}
        className={`rounded-full border px-3.5 py-1.5 text-[12px] font-[500] tracking-[0.02em] transition-colors ${
          copied
            ? "border-[var(--th-green)] bg-[var(--th-green)] text-[#0E1013]"
            : "border-[var(--th-border)] bg-transparent text-[var(--th-text)] hover:border-[var(--th-text)]/20 hover:bg-[var(--th-chip)]"
        }`}
        aria-label="Copy booking code"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      {error && <span className="text-[12px] text-[var(--th-red)]">Unable to copy.</span>}
    </div>
  );
}
