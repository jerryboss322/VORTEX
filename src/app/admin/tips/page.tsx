import { prisma } from "@/lib/db";
import { createTipAction, deleteTipAction, updateTipStatusAction } from "@/lib/actions";
import { StatusBadge } from "@/components/ui/StatusBadge";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminTipsPage() {
  let tips: any[] = [];
  try { tips = await prisma.tip.findMany({ orderBy: { createdAt: "desc" } }); } catch {}
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold">Manage Tips</h1>
      <form action={createTipAction} className="mt-6 space-y-4 rounded-lg border border-[#262626] bg-[#141414] p-6">
        <h2 className="text-sm font-semibold">Create Tip</h2>
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp" required className="block w-full text-sm" />
        <div className="grid sm:grid-cols-2 gap-4">
          <input name="bookingCode" placeholder="Booking Code *" required className="rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
          <input name="bookmaker" placeholder="Bookmaker *" required className="rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
          <input name="odds" type="number" step="0.01" placeholder="Odds" className="rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
          <input name="confidence" type="number" placeholder="Confidence 0-100" className="rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
        </div>
        <textarea name="note" placeholder="Note" rows={2} className="w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
        <button className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black">Publish</button>
      </form>

      <div className="mt-8 space-y-3">
        {tips.map((t) => (
          <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-[#262626] bg-[#141414] p-3">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.imageUrl} alt={t.bookingCode} className="h-12 w-20 object-cover rounded bg-zinc-900" />
              <div>
                <div className="font-mono text-sm">{t.bookingCode}</div>
                <div className="text-xs text-zinc-500">{t.bookmaker} · Odds {t.odds ?? "—"}</div>
              </div>
              <StatusBadge status={t.status} />
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/tips/${t.id}/edit`} className="rounded-md border border-[#262626] px-3 py-1.5 text-xs">Edit</Link>
              <form action={async () => { "use server"; await deleteTipAction(t.id); }}>
                <button className="rounded-md bg-red-600 px-3 py-1.5 text-xs text-white">Delete</button>
              </form>
              <form action={async (fd: FormData) => { "use server"; const s = fd.get("status") as string; await updateTipStatusAction(t.id, s); }}>
                <select name="status" defaultValue={t.status} className="rounded-md border border-[#262626] bg-[#0a0a0a] px-2 py-1.5 text-xs">
                  <option value="PENDING">PENDING</option><option value="WON">WON</option><option value="LOST">LOST</option><option value="CANCELLED">CANCELLED</option>
                </select>
                <button className="ml-1 rounded-md bg-white px-2 py-1 text-xs text-black">Set</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
