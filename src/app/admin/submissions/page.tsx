import { prisma } from "@/lib/db";
import { approveSubmissionAction, rejectSubmissionAction } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  let subs: any[] = [];
  try {
    subs = await prisma.submission.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "desc" }, include: { submittedBy: true } });
  } catch {}
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold">Awaiting Review</h1>
      {subs.length === 0 ? <p className="mt-4 text-sm text-zinc-500">No submissions awaiting review.</p> : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {subs.map((s) => (
            <div key={s.id} className="rounded-lg border border-[#262626] bg-[#141414] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.imageUrl} alt={s.bookingCode} className="h-64 w-full object-contain bg-zinc-900" />
              <div className="p-4 space-y-2 text-sm">
                <div className="text-xs text-zinc-500">
                  {s.submittedBy ? `Contributor: ${s.submittedBy.email}` : s.guestName ? `Guest: ${s.guestName} (member)` : "Guest (member)"} {s.source === "member" && !s.submittedBy ? "· member" : ""}
                </div>
                <div className="font-mono font-bold">{s.bookingCode}</div>
                <div className="text-xs text-zinc-400">{s.bookmaker} · Odds {s.odds ?? "—"} · Conf {s.confidence ?? "—"}%</div>
                {s.note && <div className="text-xs text-zinc-300">{s.note}</div>}
                <div className="flex gap-2 pt-2">
                  <form action={async () => { "use server"; await approveSubmissionAction(s.id); }}>
                    <button className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white">Approve</button>
                  </form>
                  <form action={async () => { "use server"; await rejectSubmissionAction(s.id); }}>
                    <button className="rounded-md border border-[#262626] px-4 py-2 text-xs">Reject</button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
