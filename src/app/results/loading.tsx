import { TipGridSkeleton, InlineRolling, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-8">
      <div className="rounded-[20px] border border-[var(--th-border)] bg-[var(--th-surface)] p-7 sm:p-8">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="mt-2 h-4 w-48" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-[14px] bg-[var(--th-chip)] animate-pulse" />
          ))}
        </div>
        <div className="mt-6 h-10 rounded-[14px] bg-[var(--th-chip)] animate-pulse" />
      </div>
      <div className="mt-6 flex items-center gap-2">
        <InlineRolling label="Rolling results…" />
      </div>
      <div className="mt-6">
        <TipGridSkeleton count={6} />
      </div>
    </div>
  );
}
