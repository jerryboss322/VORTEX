import { TipGridSkeleton, InlineRolling } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-8">
      <div className="rounded-[20px] border border-[var(--th-border)] bg-[var(--th-surface)] p-7 sm:p-8">
        <div className="flex items-center gap-3">
          <InlineRolling label="Loading Today’s tips…" />
        </div>
        <div className="mt-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 rounded-[14px] bg-[var(--th-chip)] animate-pulse" />
            <div className="h-20 rounded-[14px] bg-[var(--th-chip)] animate-pulse" />
            <div className="h-20 rounded-[14px] bg-[var(--th-chip)] animate-pulse" />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <TipGridSkeleton count={6} />
      </div>
    </div>
  );
}
