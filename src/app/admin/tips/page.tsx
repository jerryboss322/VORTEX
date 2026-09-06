import { prisma } from "@/lib/db";
import { createTipAction } from "@/lib/actions";
import { AdminTipForm } from "@/components/admin/AdminTipForm";
import { TipRow } from "@/components/admin/TipRow";

export const dynamic = "force-dynamic";

export default async function AdminTipsPage() {
  let tips: any[] = [];
  try { tips = await prisma.tip.findMany({ orderBy: { createdAt: "desc" } }); } catch {}
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="flex items-baseline justify-between">
        <h1 className="text-xl font-bold">Manage Tips</h1>
        <span className="text-xs text-zinc-500">{tips.length} total · R2 storage</span>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-xs font-semibold tracking-widest text-zinc-500 uppercase">Publish New Official Tip</h2>
        <AdminTipForm action={createTipAction} />
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-xs font-semibold tracking-widest text-zinc-500 uppercase">Existing Tips — Edit Odds, Status, or Delete</h2>
        {tips.length === 0 ? (
          <div className="rounded-lg border border-[#262626] bg-[#141414] p-8 text-center text-sm text-zinc-500">No tips yet — publish above.</div>
        ) : (
          <div className="space-y-3">
            {tips.map((t) => (
              <TipRow key={t.id} tip={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
