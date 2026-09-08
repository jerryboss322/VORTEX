"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { m } from "motion/react";

export function AnimatedNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname() || "";
  const active = pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`relative py-1 text-[13px] font-[400] tracking-[0.01em] transition-colors ${active ? "text-[var(--th-text)]" : "text-[var(--th-sub)] hover:text-[var(--th-text)]"}`}
    >
      {label}
      {active && (
        <m.span layoutId="nav-underline" transition={{ type: "spring", stiffness: 500, damping: 30 }} className="absolute inset-x-0 -bottom-[9px] h-[1.5px] bg-[var(--th-gold)]" aria-hidden />
      )}
    </Link>
  );
}
