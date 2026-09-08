import { cn } from "@/lib/utils";

const map: Record<string, { dot: string; label: string }> = {
  PENDING: { dot: "bg-[var(--th-gold)]", label: "Pending" },
  WON: { dot: "bg-[var(--th-green)]", label: "Won" },
  LOST: { dot: "bg-[var(--th-red)]", label: "Lost" },
  CANCELLED: { dot: "bg-[var(--th-sub)]", label: "Cancelled" },
  APPROVED: { dot: "bg-[var(--th-green)]", label: "Approved" },
  REJECTED: { dot: "bg-[var(--th-red)]", label: "Rejected" },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const m = map[status] || { dot: "bg-[var(--th-sub)]", label: status };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-2.5 py-1 text-[12px] font-[400] tracking-[0.01em] text-[var(--th-sub)]",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} aria-hidden />
      {m.label}
    </span>
  );
}

export function statusDot(status: string) {
  if (status === "WON") return "bg-[var(--th-green)]";
  if (status === "LOST") return "bg-[var(--th-red)]";
  if (status === "CANCELLED") return "bg-[var(--th-sub)]";
  return "bg-[var(--th-gold)]";
}

export function statusAccent(status: string) {
  if (status === "WON") return "bg-[var(--th-green)]";
  if (status === "LOST") return "bg-[var(--th-red)]";
  return "bg-[var(--th-gold)]";
}
