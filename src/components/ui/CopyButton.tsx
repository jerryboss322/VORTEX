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
        className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${copied ? "bg-emerald-600 text-white" : "bg-white text-black hover:bg-zinc-200"}`}
        aria-label="Copy booking code"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      {error && <span className="text-xs text-red-400">Unable to copy. Please copy manually.</span>}
    </div>
  );
}
