export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-[var(--th-chip)] ${className || "h-4 w-full"}`} />;
}
