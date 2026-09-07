import { prisma } from "@/lib/db";
import { notificationMeta, timeAgo } from "@/lib/notifications";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  let items: any[] = [];
  try {
    items = await prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  } catch {
    items = [];
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <div className="flex items-baseline justify-between">
        <h1 className="text-xl font-bold">Notifications</h1>
        <span className="text-xs text-zinc-500">{items.length} total</span>
      </div>
      <p className="mt-1 text-sm text-zinc-500">Submissions, approvals, tip updates — nice history. Bell menu in header for quick view.</p>

      {items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-[#262626] bg-[#141414] p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1a1a1a] text-lg">🔕</div>
          <div className="mt-3 text-sm font-medium text-white">No notifications yet</div>
          <div className="mt-1 text-xs text-zinc-500">Submit a tip, approve a submission, or publish — they’ll show up here and in the bell.</div>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-[#1a1a1a] overflow-hidden rounded-xl border border-[#262626] bg-[#141414]">
          {items.map((n) => {
            const m = notificationMeta(n.type);
            return (
              <div key={n.id} className="flex gap-3 px-4 py-4 hover:bg-[#1a1a1a]/50">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1e1e1e] text-sm">{m.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${n.read ? "bg-zinc-700" : m.dot}`} />
                    <span className="text-sm font-medium text-white">{n.title}</span>
                    <span className="ml-auto text-xs text-zinc-500">{timeAgo(n.createdAt)}</span>
                  </div>
                  {n.body && <div className="mt-1 text-sm text-zinc-400">{n.body}</div>}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {n.bookingCode && <span className="rounded bg-[#262626] px-1.5 py-0.5 font-mono text-xs text-zinc-300">{n.bookingCode}</span>}
                    {n.bookmaker && <span className="text-xs text-zinc-500">{n.bookmaker}</span>}
                    <span className="rounded-full bg-[#262626] px-2 py-0.5 text-xs text-zinc-400">{m.label}</span>
                    {n.link && (
                      <Link href={n.link} className="text-xs font-medium text-cyan-300 hover:text-cyan-200">
                        View →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
