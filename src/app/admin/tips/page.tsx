import { prisma } from "@/lib/db";
import { createTipsBatchAction } from "@/lib/actions";
import { AdminBatchTipForm } from "@/components/admin/AdminBatchTipForm";
import { TipRow } from "@/components/admin/TipRow";

export const dynamic = "force-dynamic";

export default async function AdminTipsPage() {
  let tips: any[] = [];
  try { tips = await prisma.tip.findMany({ orderBy: { createdAt: "desc" } }); } catch {}
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="rounded-[20px] border border-[var(--th-border)] bg-[var(--th-surface)] p-7 sm:p-8">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-display text-[25px] font-[500] tracking-[-0.02em] text-[var(--th-text)]">Manage Tips</h1>
          <span className="text-[12px] font-[400] tracking-[0.04em] text-[var(--th-sub)]">{tips.length} total · R2 storage</span>
        </div>

        <div className="mt-6">
          <h2 className="mb-3 text-[11px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">Publish Official Tips — Single or Batch (up to 10)</h2>
          <AdminBatchTipForm action={createTipsBatchAction} />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[14px] border border-[var(--th-border)] bg-[var(--th-surface)]">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--th-border)] bg-[var(--th-chip)]/40">
          <h2 className="text-[11px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">Existing Tips — Edit odds, status, or delete</h2>
          <span className="text-[12px] text-[var(--th-sub)]">{tips.length} rows</span>
        </div>
        {tips.length === 0 ? (
          <div className="p-10 text-center text-[13px] text-[var(--th-sub)]">No tips yet — publish above.</div>
        ) : (
          <div className="divide-y divide-[var(--th-border)]">
            {tips.map((t) => (
              <TipRow key={t.id} tip={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
