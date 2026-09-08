import { InlineRolling, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8 py-8">
      <Skeleton className="h-3 w-24" />
      <div className="mt-4 overflow-hidden rounded-[18px] border border-[var(--th-border)] bg-[var(--th-surface)]">
        <div className="h-[420px] w-full bg-[var(--th-chip)] animate-pulse" />
        <div className="p-6 space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-8 w-28 rounded-[9px]" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-5">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <InlineRolling label="Rolling slip…" />
          </div>
        </div>
      </div>
    </div>
  );
}
