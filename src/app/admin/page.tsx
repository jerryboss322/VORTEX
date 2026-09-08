import Link from "next/link";
import { getResultsStats } from "@/lib/tips";
import { StatsStrip, BookmakerChart } from "@/components/results/StatsStrip";

export const dynamic = "force-dynamic";

function AdminCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="rounded-[14px] border border-[var(--th-border)] bg-[var(--th-surface)] p-5 hover:bg-[var(--th-chip)] hover:border-[var(--th-text)]/10 transition-colors group">
      <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[var(--th-chip)] border border-[var(--th-border)] text-[var(--th-gold)] group-hover:border-[var(--th-gold)]/30" aria-hidden>
        <span className="text-[11px]">◆</span>
      </div>
      <div className="mt-3 text-[14px] font-[500] tracking-[-0.01em] text-[var(--th-text)]">{title}</div>
      <div className="mt-1 text-[13px] leading-relaxed text-[var(--th-sub)]">{desc}</div>
    </Link>
  );
}

export default async function AdminPage() {
  const stats = await getResultsStats({}).catch(() => null);

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-8">
      <div className="rounded-[20px] border border-[var(--th-border)] bg-[var(--th-surface)] p-7 sm:p-8">
        <h1 className="font-display text-[25px] font-[500] tracking-[-0.02em] text-[var(--th-text)]">Admin</h1>
        <p className="mt-1.5 text-[13px] text-[var(--th-sub)]">PIN 1740 — simple controls.</p>

        {stats && (
          <div className="mt-6 space-y-4">
            <StatsStrip stats={stats} />
            <BookmakerChart stats={stats} />
            <div className="rounded-[14px] border border-[var(--th-border)] bg-[var(--th-bg)]/40 p-4 flex flex-wrap gap-4 text-[12px] text-[var(--th-sub)]">
              <span>
                Total: <b className="font-mono font-[500] text-[var(--th-text)]">{stats.total}</b> (P:{stats.pending} C:{stats.cancelled})
              </span>
              <span>
                Settled: <b className="font-mono font-[500] text-[var(--th-text)]">{stats.totalSettled}</b>
              </span>
              <span>
                Won <b className="text-[var(--th-green)]">{stats.won}</b> · Lost <b className="text-[var(--th-red)]">{stats.lost}</b>
              </span>
              <Link href="/results" className="ml-auto text-[var(--th-sub)] hover:text-[var(--th-text)] underline underline-offset-4 decoration-[var(--th-border)]">
                Public results →
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <AdminCard href="/admin/tips" title="Manage Tips" desc="Publish, edit odds, delete, set Won / Lost." />
        <AdminCard href="/admin/submissions" title="Submissions" desc="Review guest tips → Approve / Reject." />
        <AdminCard href="/admin/notifications" title="Notifications" desc="History of submits, approves, publishes." />
      </div>

      <div className="mt-6 rounded-[14px] border border-[var(--th-border)] bg-[var(--th-surface)] p-4 text-[13px] leading-relaxed text-[var(--th-sub)]">
        Tip: Go to <span className="font-mono font-[500] text-[var(--th-text)]">/admin</span> directly, enter <span className="font-[600] text-[var(--th-text)]">1740</span>, then use the cards above.
      </div>
    </div>
  );
}
