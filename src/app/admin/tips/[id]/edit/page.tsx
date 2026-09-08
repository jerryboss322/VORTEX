import { prisma } from "@/lib/db";
import { updateTipAction } from "@/lib/actions";
import { AdminTipForm } from "@/components/admin/AdminTipForm";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditTipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let tip: any = null;
  try { tip = await prisma.tip.findUnique({ where: { id } }); } catch {}
  if (!tip) notFound();
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8 py-8">
      <Link href="/admin/tips" className="text-xs text-zinc-400 hover:text-white">← Back to tips</Link>
      <h1 className="mt-2 text-xl font-bold">Edit Tip — Odds Editable</h1>
      <p className="text-sm text-zinc-500">Update booking code, odds, confidence, or replace slip. R2 image will be replaced on upload.</p>
      <div className="mt-6">
        <AdminTipForm
          isEdit
          defaults={{
            bookingCode: tip.bookingCode,
            bookmaker: tip.bookmaker,
            odds: tip.odds,
            confidence: tip.confidence,
            note: tip.note,
            status: tip.status,
            imageUrl: tip.imageUrl,
          }}
          action={async (fd: FormData) => {
            "use server";
            await updateTipAction(id, fd);
          }}
        />
      </div>
    </div>
  );
}
