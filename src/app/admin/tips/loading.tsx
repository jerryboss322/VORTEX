import { InlineRolling, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-8">
      <div className="rounded-[20px] border border-[var(--th-border)] bg-[var(--th-surface)] p-7 sm:p-8">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-2 h-4 w-48" />
        <div className="mt-6 h-40 rounded-[14px] bg-[var(--th-chip)] animate-pulse" />
      </div>
      <div className="mt-6 rounded-[14px] border border-[var(--th-border)] bg-[var(--th-surface)] p-5">
        <div className="flex items-center gap-2">
          <InlineRolling label="Rolling tips…" />
        </div>
        <div className="mt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-[10px] bg-[var(--th-chip)] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
