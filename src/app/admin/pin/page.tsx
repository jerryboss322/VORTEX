import { verifyPin, setPinCookie } from "@/lib/adminPin";
import { redirect } from "next/navigation";
import { PinSubmitButton } from "@/components/admin/PinSubmitButton";

export const dynamic = "force-dynamic";

export default async function AdminPinPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const sp = await searchParams;
  const next = sp.next || "/admin";

  async function submit(formData: FormData) {
    "use server";
    const pin = (formData.get("pin") as string)?.trim() || "";
    const nextUrl = (formData.get("next") as string) || "/admin";
    const ok = await verifyPin(pin);
    if (!ok) redirect(`/admin/pin?next=${encodeURIComponent(nextUrl)}&error=1`);
    await setPinCookie();
    redirect(nextUrl);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-[25px] font-[500] tracking-[-0.02em] text-[var(--th-text)]">Admin PIN</h1>
      <p className="mt-1.5 text-[13px] text-[var(--th-sub)]">Enter the 4-digit admin PIN to continue.</p>
      {sp.error && <div className="mt-4 rounded-[12px] border border-[var(--th-red)]/20 bg-[var(--th-red)]/10 px-3 py-2 text-[13px] text-[var(--th-red)]">Wrong PIN — try again.</div>}
      <form action={submit} className="mt-6 space-y-4 rounded-[14px] border border-[var(--th-border)] bg-[var(--th-surface)] p-6">
        <input type="hidden" name="next" value={next} />
        <div>
          <label htmlFor="pin" className="text-[11px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">
            4-digit PIN
          </label>
          <input
            id="pin"
            name="pin"
            inputMode="numeric"
            pattern="\d{4}"
            maxLength={4}
            required
            placeholder="••••"
            className="mt-2 w-full rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-3 py-3 text-center text-[18px] tracking-[0.5em] font-mono outline-none focus:border-[var(--th-gold)]/40 text-[var(--th-text)] placeholder:text-[var(--th-sub)]"
            autoFocus
          />
        </div>
        <PinSubmitButton />
      </form>
    </div>
  );
}
