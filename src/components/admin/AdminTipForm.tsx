"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageUploader } from "@/components/ui/ImageUploader";

function PublishButton({ isEdit }: { isEdit?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-zinc-200 disabled:opacity-50">
      {pending ? (isEdit ? "Saving…" : "Publishing…") : isEdit ? "Save Changes" : "Publish Tip"}
    </button>
  );
}

type Defaults = {
  bookingCode?: string;
  bookmaker?: string;
  odds?: number | null;
  confidence?: number | null;
  note?: string | null;
  status?: string;
  imageUrl?: string | null;
};

export function AdminTipForm({
  action,
  defaults,
  isEdit,
}: {
  action: (fd: FormData) => Promise<void>;
  defaults?: Defaults;
  isEdit?: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handle(fd: FormData) {
    setError(null);
    setSuccess(false);
    const code = (fd.get("bookingCode") as string)?.trim();
    const book = (fd.get("bookmaker") as string)?.trim();
    const file = fd.get("image") as File;
    if (!isEdit && (!file || file.size === 0)) {
      setError("Slip image is required.");
      return;
    }
    if (!code || code.length < 2) {
      setError("Booking code is required.");
      return;
    }
    if (!book || book.length < 2) {
      setError("Bookmaker is required.");
      return;
    }
    try {
      await action(fd);
      setSuccess(true);
      if (!isEdit) {
        const f = document.getElementById("admin-tip-form") as HTMLFormElement | null;
        f?.reset();
      }
    } catch (e: any) {
      setError(e?.message || "Failed — please try again.");
    }
  }

  return (
    <form id="admin-tip-form" action={handle} className="space-y-4 rounded-xl border border-[#262626] bg-[#141414] p-5">
      {error && <div className="rounded-md bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400" role="alert">{error}</div>}
      {success && <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-sm text-emerald-400">{isEdit ? "Tip updated." : "Tip published — visible on homepage."}</div>}

      <div className="grid gap-5 lg:grid-cols-[1.1fr_1.9fr]">
        <div>
          <label className="text-[11px] font-semibold tracking-widest text-zinc-400 uppercase">Slip {isEdit ? "(replace to update)" : "* required"}</label>
          <div className="mt-2">
            <ImageUploader name="image" required={!isEdit} variant="compact" initialUrl={defaults?.imageUrl || null} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="abooking" className="text-xs font-medium text-zinc-300">Booking Code *</label>
              <input id="abooking" name="bookingCode" defaultValue={defaults?.bookingCode || ""} required placeholder="ABC123XYZ" className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-sm font-mono uppercase outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label htmlFor="abookmaker" className="text-xs font-medium text-zinc-300">Bookmaker *</label>
              <input id="abookmaker" name="bookmaker" defaultValue={defaults?.bookmaker || ""} required list="bookmakers-admin" placeholder="Bet9ja" className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-sm outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="aodds" className="text-xs font-medium text-zinc-300">Odds</label>
              <input id="aodds" name="odds" type="number" step="0.01" min="1" defaultValue={defaults?.odds ?? ""} placeholder="18.40" className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label htmlFor="aconf" className="text-xs font-medium text-zinc-300">Confidence %</label>
              <input id="aconf" name="confidence" type="number" min="0" max="100" defaultValue={defaults?.confidence ?? ""} placeholder="87" className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-sm outline-none" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="astatus" className="text-xs font-medium text-zinc-300">Status</label>
              <select id="astatus" name="status" defaultValue={defaults?.status || "PENDING"} className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-sm outline-none">
                <option value="PENDING">PENDING</option>
                <option value="WON">WON</option>
                <option value="LOST">LOST</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="anote" className="text-xs font-medium text-zinc-300">Note / Analysis <span className="text-zinc-500 font-normal">— optional, 500 max, private unless you publish</span></label>
            <textarea id="anote" name="note" rows={2} maxLength={500} defaultValue={defaults?.note || ""} placeholder="Optional admin note…" className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-sm outline-none resize-none" />
          </div>

          <div className="flex items-center gap-3">
            <PublishButton isEdit={isEdit} />
            <span className="text-xs text-zinc-500">Image → R2 · Code → uppercase · Instant on homepage</span>
          </div>
        </div>
      </div>

      <datalist id="bookmakers-admin">
        <option value="Bet9ja" />
        <option value="SportyBet" />
        <option value="1xBet" />
        <option value="Betway" />
        <option value="Melbet" />
        <option value="22Bet" />
      </datalist>
    </form>
  );
}
