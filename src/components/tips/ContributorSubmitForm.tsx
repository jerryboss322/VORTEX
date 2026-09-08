"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { AnimatePresence, m } from "motion/react";
import { spring } from "@/lib/motion";

function SubmitButton({ mode }: { mode: "public" | "contributor" }) {
  const { pending } = useFormStatus();
  return (
    <m.button whileTap={{ scale: 0.97 }} transition={spring} disabled={pending} className="w-full rounded-full bg-[var(--th-text)] py-3 text-[13px] font-[600] tracking-[0.02em] text-[#0E1013] hover:bg-[#ddd8cf] disabled:opacity-50 disabled:cursor-not-allowed">
      {pending ? "Submitting…" : mode === "public" ? "Submit as Guest" : "Submit for Review"}
    </m.button>
  );
}

export function ContributorSubmitForm({ action, mode = "contributor" }: { action: (fd: FormData) => Promise<void>; mode?: "public" | "contributor" }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handle(formData: FormData) {
    setError(null);
    setSuccess(false);
    const code = (formData.get("bookingCode") as string)?.trim();
    const bookmaker = (formData.get("bookmaker") as string)?.trim();
    const file = formData.get("image") as File;
    if (!file || file.size === 0) {
      setError("Slip image is required — JPEG, PNG, or WEBP, max 10MB.");
      return;
    }
    if (!code || code.length < 2) {
      setError("Booking code is required.");
      return;
    }
    if (!bookmaker || bookmaker.length < 2) {
      setError("Bookmaker is required.");
      return;
    }
    try {
      await action(formData);
      setSuccess(true);
      const form = document.getElementById("contrib-form") as HTMLFormElement | null;
      form?.reset();
    } catch (e: any) {
      setError(e?.message || "Submission failed — please try again.");
    }
  }

  return (
    <form id="contrib-form" action={handle} className="space-y-5 rounded-[14px] border border-[var(--th-border)] bg-[var(--th-surface)] p-6 sm:p-7">
      <AnimatePresence mode="wait" initial={false}>
        {error && (
          <m.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={spring} className="rounded-[12px] border border-[var(--th-red)]/20 bg-[var(--th-red)]/10 px-3 py-2 text-[13px] text-[var(--th-red)]" role="alert">
            {error}
          </m.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        {success && (
          <m.div initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={spring} className="rounded-[12px] border border-[var(--th-green)]/20 bg-[var(--th-green)]/10 px-3 py-2 text-[13px] text-[var(--th-green)]">
            {mode === "public" ? "Submitted as guest — admin will review shortly. No account needed." : "Submitted for review — admin will approve shortly."}
          </m.div>
        )}
      </AnimatePresence>

      <div>
        <label className="text-[11px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">Betting Slip *</label>
        <p className="mt-1 text-[12px] text-[var(--th-sub)]">Upload a clear screenshot. This is what members will see.</p>
        <div className="mt-3">
          <ImageUploader name="image" required variant="hero" />
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <label htmlFor="bookingCode" className="text-[12px] font-[400] text-[var(--th-sub)]">Booking Code *</label>
          <input id="bookingCode" name="bookingCode" required placeholder="e.g. ABC123XYZ" className="mt-1.5 w-full rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2.5 text-[13px] font-mono uppercase placeholder:text-[var(--th-sub)] focus:border-[var(--th-text)]/20 outline-none" />
        </div>
        <div>
          <label htmlFor="bookmaker" className="text-[12px] font-[400] text-[var(--th-sub)]">Bookmaker *</label>
          <input id="bookmaker" name="bookmaker" required list="bookmakers" placeholder="Bet9ja" className="mt-1.5 w-full rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2.5 text-[13px] placeholder:text-[var(--th-sub)] focus:border-[var(--th-text)]/20 outline-none" />
          <datalist id="bookmakers">
            <option value="Bet9ja" />
            <option value="SportyBet" />
            <option value="1xBet" />
            <option value="Betway" />
            <option value="Melbet" />
          </datalist>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="odds" className="text-[12px] font-[400] text-[var(--th-sub)]">Odds <span className="opacity-60">— optional</span></label>
          <input id="odds" name="odds" type="number" step="0.01" min="1" placeholder="18.40" className="mt-1.5 w-full rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2.5 text-[13px] placeholder:text-[var(--th-sub)] outline-none" />
        </div>
        <div>
          <label htmlFor="confidence" className="text-[12px] font-[400] text-[var(--th-sub)]">Confidence % <span className="opacity-60">— optional</span></label>
          <input id="confidence" name="confidence" type="number" min="0" max="100" placeholder="87" className="mt-1.5 w-full rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2.5 text-[13px] placeholder:text-[var(--th-sub)] outline-none" />
        </div>
      </div>

      {mode === "public" && (
        <div>
          <label htmlFor="guestName" className="text-[12px] font-[400] text-[var(--th-sub)]">Your name <span className="opacity-60">— optional, shown to admin only</span></label>
          <input id="guestName" name="guestName" maxLength={80} placeholder="e.g. Jboss" className="mt-1.5 w-full rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2.5 text-[13px] placeholder:text-[var(--th-sub)] outline-none" />
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        </div>
      )}

      <div>
        <label htmlFor="note" className="text-[12px] font-[400] text-[var(--th-sub)]">Note <span className="opacity-60">— optional, max 500</span></label>
        <textarea id="note" name="note" rows={3} maxLength={500} placeholder="Any context for admin — not shown publicly by default." className="mt-1.5 w-full rounded-[14px] border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2.5 text-[13px] placeholder:text-[var(--th-sub)] outline-none resize-none" />
      </div>

      <SubmitButton mode={mode} />
      <p className="text-center text-[11px] text-[var(--th-sub)]">By submitting you agree admin may approve or reject. Approved slips become Official Tips.</p>
    </form>
  );
}
