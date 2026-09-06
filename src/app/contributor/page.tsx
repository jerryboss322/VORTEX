import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ContributorPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return <div className="p-8 text-center text-sm">Please login</div>;
  let subs: any[] = [];
  try {
    subs = await prisma.submission.findMany({ where: { submittedById: userId }, orderBy: { createdAt: "desc" } });
  } catch {}
  const pending = subs.filter((s) => s.status === "PENDING").length;
  const approved = subs.filter((s) => s.status === "APPROVED").length;
  const rejected = subs.filter((s) => s.status === "REJECTED").length;
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold">My Submissions</h1>
      <div className="mt-4 grid grid-cols-3 gap-3 max-w-md">
        <div className="rounded-lg border border-[#262626] bg-[#141414] p-4 text-center"><div className="text-xl font-bold">{pending}</div><div className="text-xs text-zinc-500 uppercase">Pending</div></div>
        <div className="rounded-lg border border-[#262626] bg-[#141414] p-4 text-center"><div className="text-xl font-bold text-emerald-400">{approved}</div><div className="text-xs text-zinc-500 uppercase">Approved</div></div>
        <div className="rounded-lg border border-[#262626] bg-[#141414] p-4 text-center"><div className="text-xl font-bold text-red-400">{rejected}</div><div className="text-xs text-zinc-500 uppercase">Rejected</div></div>
      </div>
      <Link href="/submit" className="mt-4 inline-block rounded-md bg-white px-4 py-2 text-sm font-semibold text-black">Submit New Tip</Link>
      <div className="mt-6">
        {subs.length === 0 ? <EmptyState title="No submissions yet." /> : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subs.map((s) => (
              <div key={s.id} className="rounded-lg border border-[#262626] bg-[#141414] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.imageUrl} alt={s.bookingCode} className="h-48 w-full object-cover bg-zinc-900" />
                <div className="p-3 space-y-2">
                  <div className="font-mono text-sm">{s.bookingCode}</div>
                  <StatusBadge status={s.status} />
                  <div className="text-xs text-zinc-500">{new Date(s.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
