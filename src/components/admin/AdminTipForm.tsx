"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageUploader } from "@/components/ui/ImageUploader";

function PublishButton({ isEdit }: { isEdit?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="rounded-full bg-[var(--th-text)] px-6 py-2.5 text-[12px] font-[600] tracking-[0.02em] text-[#0E1013] hover:bg-[#ddd8cf] disabled:opacity-50">
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
    <form id="admin-tip-form" action={handle} className="space-y-4 rounded-[14px] border border-[var(--th-border)] bg-[var(--th-bg)]/40 p-5">
      {error && <div className="rounded-[12px] border border-[var(--th-red)]/20 bg-[var(--th-red)]/10 px-3 py-2 text-[13px] text-[var(--th-red)]" role="alert">{error}</div>}
      {success && <div className="rounded-[12px] border border-[var(--th-green)]/20 bg-[var(--th-green)]/10 px-3 py-2 text-[13px] text-[var(--th-green)]">{isEdit ? "Tip updated." : "Tip published — visible on homepage."}</div>}

      <div className="grid gap-5 lg:grid-cols-[1.1fr_1.9fr]">
        <div>
          <label className="text-[11px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">Slip {isEdit ? "(replace to update)" : "* required"}</label>
          <div className="mt-2">
            <ImageUploader name="image" required={!isEdit} variant="compact" initialUrl={defaults?.imageUrl || null} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="abooking" className="text-[12px] font-[400] text-[var(--th-sub)]">Booking Code *</label>
              <input id="abooking" name="bookingCode" defaultValue={defaults?.bookingCode || ""} required placeholder="ABC123XYZ" className="mt-1.5 w-full rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2.5 text-[13px] font-mono uppercase placeholder:text-[var(--th-sub)] outline-none focus:border-[var(--th-text)]/20" />
            </div>
            <div>
              <label htmlFor="abookmaker" className="text-[12px] font-[400] text-[var(--th-sub)]">Bookmaker *</label>
              <input id="abookmaker" name="bookmaker" defaultValue={defaults?.bookmaker || ""} required list="bookmakers-admin" placeholder="Bet9ja" className="mt-1.5 w-full rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2.5 text-[13px] outline-none focus:border-[var(--th-text)]/20" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="aodds" className="text-[12px] font-[400] text-[var(--th-sub)]">Odds</label>
              <input id="aodds" name="odds" type="number" step="0.01" min="1" defaultValue={defaults?.odds ?? ""} placeholder="18.40" className="mt-1.5 w-full rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2.5 text-[13px] outline-none" />
            </div>
            <div>
              <label htmlFor="aconf" className="text-[12px] font-[400] text-[var(--th-sub)]">Confidence %</label>
              <input id="aconf" name="confidence" type="number" min="0" max="100" defaultValue={defaults?.confidence ?? ""} placeholder="87" className="mt-1.5 w-full rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2.5 text-[13px] outline-none" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="astatus" className="text-[12px] font-[400] text-[var(--th-sub)]">Status</label>
              <select id="astatus" name="status" defaultValue={defaults?.status || "PENDING"} className="mt-1.5 w-full rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2.5 text-[13px] outline-none">
                <option value="PENDING">Pending</option>
                <option value="WON">Won</option>
                <option value="LOST">Lost</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="anote" className="text-[12px] font-[400] text-[var(--th-sub)]">Note / Analysis <span className="opacity-60">— optional, 500 max</span></label>
            <textarea id="anote" name="note" rows={2} maxLength={500} defaultValue={defaults?.note || ""} placeholder="Optional admin note…" className="mt-1.5 w-full rounded-[14px] border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2.5 text-[13px] outline-none resize-none" />
          </div>

          <div className="flex items-center gap-3">
            <PublishButton isEdit={isEdit} />
            <span className="text-[12px] text-[var(--th-sub)]">Image → R2 · Code → uppercase · Instant on homepage</span>
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
