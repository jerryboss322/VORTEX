import { createSubmissionAction } from "@/lib/actions";

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold">Submit a Tip</h1>
      <p className="text-sm text-zinc-400">Your submission will be reviewed by admin.</p>
      <form action={createSubmissionAction} className="mt-6 space-y-4 rounded-lg border border-[#262626] bg-[#141414] p-6">
        <div>
          <label className="text-xs text-zinc-400">Upload Slip *</label>
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" required className="mt-1 block w-full text-sm" />
        </div>
        <div>
          <label className="text-xs text-zinc-400">Booking Code *</label>
          <input name="bookingCode" required className="mt-1 w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-zinc-400">Bookmaker *</label>
          <input name="bookmaker" required placeholder="Bet9ja" className="mt-1 w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-400">Odds</label>
            <input name="odds" type="number" step="0.01" placeholder="18.40" className="mt-1 w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-zinc-400">Confidence %</label>
            <input name="confidence" type="number" placeholder="87" className="mt-1 w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="text-xs text-zinc-400">Note</label>
          <textarea name="note" rows={3} className="mt-1 w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
        </div>
        <button className="w-full rounded-md bg-white py-2 text-sm font-semibold text-black">Submit for Review</button>
      </form>
    </div>
  );
}
