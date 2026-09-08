import { TipGridSkeleton, InlineRolling } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-8">
      <div className="rounded-[20px] border border-[var(--th-border)] bg-[var(--th-surface)] p-7 sm:p-8">
        <div className="h-6 w-24 rounded bg-[var(--th-chip)] animate-pulse" />
        <div className="mt-2 h-4 w-64 rounded bg-[var(--th-chip)] animate-pulse" />
        <div className="mt-6 flex gap-3 rounded-[14px] border border-[var(--th-border)] bg-[var(--th-bg)]/60 p-4">
          <div className="h-9 flex-1 rounded-full bg-[var(--th-chip)] animate-pulse" />
          <div className="h-9 w-32 rounded-full bg-[var(--th-chip)] animate-pulse" />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2">
        <InlineRolling label="Rolling tips in…" />
      </div>
      <div className="mt-6">
        <TipGridSkeleton count={6} />
      </div>
    </div>
  );
}
