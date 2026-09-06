import { prisma } from "@/lib/db";
import { TipGrid, DateGrouped } from "@/components/tips/TipGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { groupByDate } from "@/lib/tips";

export const dynamic = "force-dynamic";

export default async function TipsPage({ searchParams }: { searchParams: Promise<{ q?: string; bookmaker?: string; status?: string; page?: string }> }) {
  const sp = await searchParams;
  const where: any = { status: sp.status || "PENDING" };
  if (sp.bookmaker) where.bookmaker = { contains: sp.bookmaker, mode: "insensitive" };
  if (sp.q) where.OR = [{ bookingCode: { contains: sp.q, mode: "insensitive" } }, { bookmaker: { contains: sp.q, mode: "insensitive" } }];
  let tips: any[] = [];
  try {
    tips = await prisma.tip.findMany({ where, orderBy: { createdAt: "desc" }, take: 40 });
  } catch {}
  const groups = groupByDate(tips);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold">Tips</h1>
      <form className="mt-4 flex flex-wrap gap-2">
        <input name="q" defaultValue={sp.q || ""} placeholder="Search code / bookmaker" className="rounded-md border border-[#262626] bg-[#141414] px-3 py-2 text-sm placeholder:text-zinc-500" />
        <input name="bookmaker" defaultValue={sp.bookmaker || ""} placeholder="Bookmaker" className="rounded-md border border-[#262626] bg-[#141414] px-3 py-2 text-sm placeholder:text-zinc-500" />
        <select name="status" defaultValue={sp.status || "PENDING"} className="rounded-md border border-[#262626] bg-[#141414] px-3 py-2 text-sm">
          <option value="PENDING">Pending</option>
          <option value="WON">Won</option>
          <option value="LOST">Lost</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-bold text-black hover:bg-cyan-400">Filter</button>
      </form>
      <div className="mt-6">
        {tips.length === 0 ? <EmptyState title="No tips found." /> : <DateGrouped groups={groups} />}
      </div>
    </div>
  );
}
