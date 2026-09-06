"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageUploader } from "@/components/ui/ImageUploader";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="w-full rounded-lg bg-white py-3 text-sm font-bold text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed">
      {pending ? "Submitting…" : "Submit for Review"}
    </button>
  );
}

export function ContributorSubmitForm({ action }: { action: (fd: FormData) => Promise<void> }) {
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
      // reset form via DOM
      const form = document.getElementById("contrib-form") as HTMLFormElement | null;
      form?.reset();
    } catch (e: any) {
      setError(e?.message || "Submission failed — please try again.");
    }
  }

  return (
    <form id="contrib-form" action={handle} className="space-y-5 rounded-xl border border-[#262626] bg-gradient-to-b from-[#141414] to-[#0f0f0f] p-6 sm:p-7">
      {error && <div className="rounded-md bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400" role="alert">{error}</div>}
      {success && <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-sm text-emerald-400">Submitted for review — admin will approve shortly.</div>}

      <div>
        <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Betting Slip *</label>
        <p className="mt-1 text-xs text-zinc-500">Upload a clear screenshot. This is what members will see.</p>
        <div className="mt-3">
          <ImageUploader name="image" required variant="hero" />
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <label htmlFor="bookingCode" className="text-xs font-medium text-zinc-300">Booking Code *</label>
          <input id="bookingCode" name="bookingCode" required placeholder="e.g. ABC123XYZ" className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-sm font-mono uppercase placeholder:text-zinc-600 focus:border-zinc-500 outline-none" />
        </div>
        <div>
          <label htmlFor="bookmaker" className="text-xs font-medium text-zinc-300">Bookmaker *</label>
          <input id="bookmaker" name="bookmaker" required list="bookmakers" placeholder="Bet9ja" className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-sm placeholder:text-zinc-600 focus:border-zinc-500 outline-none" />
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
          <label htmlFor="odds" className="text-xs font-medium text-zinc-300">Odds <span className="text-zinc-500 font-normal">— optional</span></label>
          <input id="odds" name="odds" type="number" step="0.01" min="1" placeholder="18.40" className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-sm placeholder:text-zinc-600 outline-none" />
        </div>
        <div>
          <label htmlFor="confidence" className="text-xs font-medium text-zinc-300">Confidence % <span className="text-zinc-500 font-normal">— optional</span></label>
          <input id="confidence" name="confidence" type="number" min="0" max="100" placeholder="87" className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-sm placeholder:text-zinc-600 outline-none" />
        </div>
      </div>

      <div>
        <label htmlFor="note" className="text-xs font-medium text-zinc-300">Note <span className="text-zinc-500 font-normal">— optional, max 500</span></label>
        <textarea id="note" name="note" rows={3} maxLength={500} placeholder="Any context for admin — not shown publicly by default." className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-sm placeholder:text-zinc-600 outline-none resize-none" />
      </div>

      <SubmitButton />
      <p className="text-center text-[11px] text-zinc-500">By submitting you agree admin may approve or reject. Approved slips become Official Tips.</p>
    </form>
  );
}
