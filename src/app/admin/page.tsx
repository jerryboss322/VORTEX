import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let stats = { active: 0, pendingResults: 0, awaiting: 0, contributors: 0 };
  let recentTips: any[] = [];
  let pendingSubs: any[] = [];
  try {
    const [active, pending, awaiting, contributors, tips, subs] = await Promise.all([
      prisma.tip.count({ where: { status: "PENDING" } }),
      prisma.tip.count({ where: { status: "PENDING" } }), // pending results same as active for MVP
      prisma.submission.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { role: "CONTRIBUTOR" } }),
      prisma.tip.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.submission.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "desc" }, take: 5, include: { submittedBy: true } }),
    ]);
    stats = { active, pendingResults: pending, awaiting, contributors };
    recentTips = tips;
    pendingSubs = subs;
  } catch {}

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-[#262626] bg-[#141414] p-4"><div className="text-2xl font-bold">{stats.active}</div><div className="text-xs text-zinc-500 uppercase">Active Tips</div></div>
        <div className="rounded-lg border border-[#262626] bg-[#141414] p-4"><div className="text-2xl font-bold">{stats.pendingResults}</div><div className="text-xs text-zinc-500 uppercase">Pending Results</div></div>
        <div className="rounded-lg border border-[#262626] bg-[#141414] p-4"><div className="text-2xl font-bold">{stats.awaiting}</div><div className="text-xs text-zinc-500 uppercase">Awaiting Review</div></div>
        <div className="rounded-lg border border-[#262626] bg-[#141414] p-4"><div className="text-2xl font-bold">{stats.contributors}</div><div className="text-xs text-zinc-500 uppercase">Contributors</div></div>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <section className="rounded-lg border border-[#262626] bg-[#141414] p-4">
          <div className="flex items-center justify-between"><h2 className="text-sm font-semibold">Recent Tips</h2><Link href="/admin/tips" className="text-xs text-zinc-400">Manage →</Link></div>
          <div className="mt-3 space-y-2">
            {recentTips.length === 0 ? <p className="text-xs text-zinc-500">No tips yet.</p> : recentTips.map((t) => (
              <Link key={t.id} href={`/tips/${t.id}`} className="flex items-center justify-between rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-xs">
                <span className="font-mono">{t.bookingCode}</span><span className="text-zinc-500">{t.status}</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-[#262626] bg-[#141414] p-4">
          <div className="flex items-center justify-between"><h2 className="text-sm font-semibold">Awaiting Review</h2><Link href="/admin/submissions" className="text-xs text-zinc-400">Review →</Link></div>
          <div className="mt-3 space-y-2">
            {pendingSubs.length === 0 ? <p className="text-xs text-zinc-500">No submissions awaiting review.</p> : pendingSubs.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-xs">
                <span className="font-mono">{s.bookingCode}</span><span className="text-zinc-500">{s.submittedBy.email}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
