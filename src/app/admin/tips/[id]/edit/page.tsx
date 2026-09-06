import { prisma } from "@/lib/db";
import { updateTipAction } from "@/lib/actions";
import { notFound } from "next/navigation";

export default async function EditTipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let tip: any = null;
  try { tip = await prisma.tip.findUnique({ where: { id } }); } catch {}
  if (!tip) notFound();
  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold">Edit Tip</h1>
      <form action={async (fd: FormData) => { "use server"; await updateTipAction(id, fd); }} className="mt-6 space-y-4 rounded-lg border border-[#262626] bg-[#141414] p-6">
        <div>
          <label className="text-xs text-zinc-400">Replace Slip (leave empty to keep)</label>
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 block w-full text-sm" />
          <div className="mt-2 text-xs text-zinc-500">Current: {tip.imageUrl}</div>
        </div>
        <input name="bookingCode" defaultValue={tip.bookingCode} required className="w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
        <input name="bookmaker" defaultValue={tip.bookmaker} required className="w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
        <div className="grid grid-cols-2 gap-4">
          <input name="odds" type="number" step="0.01" defaultValue={tip.odds ?? ""} placeholder="Odds" className="rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
          <input name="confidence" type="number" defaultValue={tip.confidence ?? ""} placeholder="Confidence" className="rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
        </div>
        <textarea name="note" defaultValue={tip.note ?? ""} rows={3} className="w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
        <select name="status" defaultValue={tip.status} className="w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm">
          <option value="PENDING">PENDING</option><option value="WON">WON</option><option value="LOST">LOST</option><option value="CANCELLED">CANCELLED</option>
        </select>
        <button className="w-full rounded-md bg-white py-2 text-sm font-semibold text-black">Save</button>
      </form>
    </div>
  );
}
