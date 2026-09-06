import { prisma } from "@/lib/db";
import { TipGrid } from "@/components/tips/TipGrid";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function ResultsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const sp = await searchParams;
  const status = sp.status || "ALL";
  const where: any = status === "ALL" ? { status: { in: ["WON", "LOST", "CANCELLED"] } } : { status };
  let tips: any[] = [];
  try {
    tips = await prisma.tip.findMany({ where, orderBy: { updatedAt: "desc" }, take: 40 });
  } catch {}
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold">Results</h1>
      <div className="mt-4 flex gap-2">
        {["ALL", "WON", "LOST", "CANCELLED"].map((s) => (
          <a key={s} href={s === "ALL" ? "/results" : `/results?status=${s}`} className={`rounded-full border px-3 py-1 text-xs font-semibold ${status === s ? "bg-white text-black border-white" : "border-[#262626] text-zinc-400"}`}>
            {s}
          </a>
        ))}
      </div>
      <div className="mt-6">
        {tips.length === 0 ? <EmptyState title="No completed tips yet." /> : <TipGrid tips={tips} />}
      </div>
    </div>
  );
}
