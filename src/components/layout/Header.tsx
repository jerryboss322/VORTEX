"use client";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-[#262626] bg-[#0a0a0a]/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-sm font-bold tracking-tight">
          TipsHub
        </Link>
        <nav className="hidden items-center gap-6 text-sm sm:flex">
          <Link href="/tips" className="text-zinc-400 hover:text-white transition-colors">
            Tips
          </Link>
          <Link href="/results" className="text-zinc-400 hover:text-white transition-colors">
            Results
          </Link>
          <Link href="/submit" className="text-zinc-400 hover:text-white transition-colors">
            Submit Tip
          </Link>
          <Link href="/login" className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-zinc-200">
            Login
          </Link>
        </nav>
        <button
          aria-label="Menu"
          className="sm:hidden rounded-md border border-[#262626] px-3 py-1.5 text-xs"
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
      </div>
      {open && (
        <div className="border-t border-[#262626] bg-[#141414] sm:hidden">
          <nav className="flex flex-col px-4 py-3 gap-3 text-sm">
            <Link href="/tips" onClick={() => setOpen(false)} className="text-zinc-300">
              Tips
            </Link>
            <Link href="/results" onClick={() => setOpen(false)} className="text-zinc-300">
              Results
            </Link>
            <Link href="/submit" onClick={() => setOpen(false)} className="text-zinc-300">
              Submit Tip
            </Link>
            <Link href="/login" onClick={() => setOpen(false)} className="text-zinc-300">
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
