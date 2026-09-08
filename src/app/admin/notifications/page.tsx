import { prisma } from "@/lib/db";
import { notificationMeta, timeAgo } from "@/lib/notifications";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

function groupByDay(items: any[]) {
  const groups: { label: string; items: any[] }[] = [];
  const now = new Date();
  const todayStr = now.toLocaleDateString("en-GB");
  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  const yStr = y.toLocaleDateString("en-GB");
  for (const n of items) {
    const d = new Date(n.createdAt).toLocaleDateString("en-GB");
    let label = d;
    if (d === todayStr) label = "Today";
    else if (d === yStr) label = "Yesterday";
    else label = new Date(n.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(n);
    else groups.push({ label, items: [n] });
  }
  return groups;
}

export default async function AdminNotificationsPage() {
  let items: any[] = [];
  try {
    items = await prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  } catch {
    items = [];
  }

  const groups = groupByDay(items);

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8 py-8">
      <div className="rounded-[20px] border border-[var(--th-border)] bg-[var(--th-surface)] p-7 sm:p-8">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-display text-[25px] font-[500] tracking-[-0.02em] text-[var(--th-text)]">Notifications</h1>
          <span className="text-[12px] tracking-[0.04em] text-[var(--th-sub)]">{items.length} total</span>
        </div>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--th-sub)]">Activity log — submissions, approvals, tip updates. Bell menu in header for quick view.</p>
      </div>

      {items.length === 0 ? (
        <Reveal>
          <div className="mt-6 rounded-[14px] border border-dashed border-[var(--th-border)] bg-transparent p-10 text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-[9px] bg-[var(--th-chip)] border border-[var(--th-border)] text-[var(--th-sub)]">○</div>
            <div className="mt-3 font-display text-[15px] font-[500] text-[var(--th-text)]">No notifications yet</div>
            <div className="mt-1 text-[12px] text-[var(--th-sub)]">Submit a tip, approve a submission, or publish — they’ll show up here and in the bell.</div>
          </div>
        </Reveal>
      ) : (
        <div className="mt-6 space-y-6">
          {groups.map((g, gi) => (
            <Reveal key={g.label} delay={gi * 0.06}>
              <div>
                <div className="mb-2 text-[11px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">{g.label}</div>
                <div className="overflow-hidden rounded-[14px] border border-[var(--th-border)] bg-[var(--th-surface)] divide-y divide-[var(--th-border)]/60">
                  {g.items.map((n) => {
                    const meta = notificationMeta(n.type);
                    return (
                      <div key={n.id} className="flex gap-3 px-4 py-4 hover:bg-[var(--th-chip)]/30">
                      <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] border border-[var(--th-border)] bg-[var(--th-chip)] text-[13px]">{meta.icon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${n.read ? "bg-[var(--th-border)]" : meta.dot}`} aria-hidden />
                          <span className="text-[13px] font-[500] text-[var(--th-text)]">{n.title}</span>
                          <span className="ml-auto text-[11px] text-[var(--th-sub)]">{timeAgo(n.createdAt)}</span>
                        </div>
                        {n.body && <div className="mt-1 text-[13px] leading-relaxed text-[var(--th-sub)]">{n.body}</div>}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {n.bookingCode && <span className="rounded-[6px] border border-[var(--th-border)] bg-[var(--th-chip)] px-2 py-0.5 font-mono text-[11px] text-[var(--th-text)]">{n.bookingCode}</span>}
                          {n.bookmaker && <span className="text-[11px] text-[var(--th-sub)]">{n.bookmaker}</span>}
                          <span className="rounded-full bg-[var(--th-chip)] border border-[var(--th-border)] px-2 py-0.5 text-[11px] text-[var(--th-sub)]">{meta.label}</span>
                          {n.link && (
                            <Link href={n.link} className="text-[12px] font-[500] text-[var(--th-sub)] hover:text-[var(--th-text)] underline underline-offset-4 decoration-[var(--th-border)]">
                              View →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
