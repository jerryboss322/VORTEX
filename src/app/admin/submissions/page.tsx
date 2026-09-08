import { prisma } from "@/lib/db";
import { approveSubmissionAction, rejectSubmissionAction } from "@/lib/actions";
import { Reveal } from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  let subs: any[] = [];
  try {
    subs = await prisma.submission.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "desc" }, include: { submittedBy: true } });
  } catch {}
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="rounded-[20px] border border-[var(--th-border)] bg-[var(--th-surface)] p-7 sm:p-8">
        <h1 className="font-display text-[25px] font-[500] tracking-[-0.02em] text-[var(--th-text)]">Awaiting Review</h1>
        <p className="mt-1.5 text-[13px] text-[var(--th-sub)]">{subs.length} pending submission{subs.length !== 1 ? "s" : ""} — approve to publish as official tip.</p>
      </div>

      {subs.length === 0 ? (
        <div className="mt-6 rounded-[14px] border border-dashed border-[var(--th-border)] bg-transparent p-10 text-center text-[13px] text-[var(--th-sub)]">
          No submissions awaiting review.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {subs.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.04}>
              <div className="overflow-hidden rounded-[14px] border border-[var(--th-border)] bg-[var(--th-surface)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.imageUrl} alt={s.bookingCode} className="h-64 w-full object-contain bg-[#0E1013]" />
              <div className="p-4 space-y-2">
                <div className="text-[11px] tracking-[0.04em] text-[var(--th-sub)]">
                  {s.submittedBy ? `Contributor: ${s.submittedBy.email}` : s.guestName ? `Guest: ${s.guestName}` : "Guest"} {s.source === "member" && !s.submittedBy ? "· member" : ""}
                </div>
                <div className="inline-flex rounded-[9px] border border-[var(--th-border)] bg-[var(--th-chip)] px-2.5 py-1 font-mono text-[13px] font-[500] tracking-[0.04em] text-[var(--th-text)]">
                  {s.bookingCode}
                </div>
                <div className="text-[12px] text-[var(--th-sub)]">
                  {s.bookmaker} · Odds {s.odds ?? "—"} · Conf {s.confidence ?? "—"}%
                </div>
                {s.note && <div className="text-[13px] leading-relaxed text-[var(--th-text)]">{s.note}</div>}
                <div className="flex gap-2 pt-2">
                  <form action={async () => { "use server"; await approveSubmissionAction(s.id); }}>
                    <button className="rounded-full bg-[var(--th-green)] px-4 py-2 text-[12px] font-[600] text-[#0E1013] hover:bg-[#6aa882]">Approve</button>
                  </form>
                  <form action={async () => { "use server"; await rejectSubmissionAction(s.id); }}>
                    <button className="rounded-full border border-[var(--th-border)] px-4 py-2 text-[12px] font-[500] text-[var(--th-sub)] hover:text-[var(--th-text)] hover:border-[var(--th-text)]/15">Reject</button>
                  </form>
                </div>
              </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
