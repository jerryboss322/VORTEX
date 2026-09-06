import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  WON: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  LOST: "bg-red-500/10 text-red-400 border-red-500/20",
  CANCELLED: "bg-zinc-800 text-zinc-400 border-zinc-700",
  APPROVED: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase", map[status] || "bg-zinc-800 text-zinc-300", className)}>
      {status}
    </span>
  );
}
