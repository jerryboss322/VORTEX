"use client";
import { m } from "motion/react";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded bg-[var(--th-chip)] ${className || "h-4 w-full"}`}>
      <m.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function RollingSpinner({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <m.span
      aria-hidden
      className={`inline-block rounded-full border-2 border-current border-t-transparent ${className || ""}`}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
    />
  );
}

export function TipCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[var(--th-border)] bg-[var(--th-surface)]">
      <div className="h-[3px] w-full bg-[var(--th-chip)]" />
      <div className="bg-[#0E1013]/40 p-0">
        <Skeleton className="h-[220px] w-full rounded-none aspect-[16/10] max-h-[420px]" />
      </div>
      <div className="space-y-3 px-5 sm:px-6 pt-5">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-3 w-28" />
      </div>
      <div className="my-4 mx-5 border-t border-dashed border-[var(--th-border)]" />
      <div className="flex justify-between gap-3 px-5 sm:px-6 pb-5">
        <Skeleton className="h-8 w-28 rounded-[9px]" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
      <div className="flex justify-between border-t border-[var(--th-border)] px-5 sm:px-6 py-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function TipGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <TipCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function InlineRolling({ label = "Loading…" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] text-[var(--th-sub)]">
      <RollingSpinner size={14} className="text-[var(--th-gold)]" />
      {label}
    </span>
  );
}
