import { prisma } from "@/lib/db";
import { TipCard } from "@/components/tips/TipCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const active = await prisma.tip.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "desc" }, take: 6 }).catch(() => []);
  const recentResults = await prisma.tip.findMany({ where: { status: { in: ["WON", "LOST"] } }, orderBy: { updatedAt: "desc" }, take: 6 }).catch(() => []);
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-10">
      <section>
        <div className="mb-2 text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Today&apos;s Tips — Latest official slips</div>
        <h1 className="text-2xl font-bold tracking-tight">Today&apos;s Tips</h1>
        <p className="mt-1 text-sm text-zinc-400">Official slips. Copy the booking code and use it on your bookmaker.</p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Active Tips</h2>
          <Link href="/tips" className="text-xs text-zinc-400 hover:text-white">View all →</Link>
        </div>
        {active.length === 0 ? (
          <EmptyState title="No tips have been published yet." description="Check back later." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((t) => (
              <TipCard key={t.id} tip={t} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Recent Results</h2>
          <Link href="/results" className="text-xs text-zinc-400 hover:text-white">View results →</Link>
        </div>
        {recentResults.length === 0 ? (
          <EmptyState title="No completed tips yet." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentResults.map((t) => (
              <article key={t.id} className="rounded-lg border border-[#262626] bg-[#141414] overflow-hidden">
                <div className="h-[180px] overflow-hidden bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.imageUrl} alt={t.bookingCode} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-xs font-mono">{t.bookingCode}</span>
                  <StatusBadge status={t.status} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
