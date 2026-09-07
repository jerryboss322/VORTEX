import { verifyPin, setPinCookie } from "@/lib/adminPin";
import { redirect } from "next/navigation";

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
      <h1 className="text-xl font-bold">Admin PIN</h1>
      <p className="mt-1 text-sm text-zinc-400">Enter the 4-digit admin PIN to continue.</p>
      {sp.error && <div className="mt-4 rounded-md bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">Wrong PIN — try again.</div>}
      <form action={submit} className="mt-6 space-y-4 rounded-xl border border-[#262626] bg-[#141414] p-6">
        <input type="hidden" name="next" value={next} />
        <div>
          <label htmlFor="pin" className="text-xs font-medium text-zinc-300">
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
            className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-3 text-center text-lg tracking-[0.5em] font-mono outline-none focus:border-violet-500"
            autoFocus
          />
        </div>
        <button className="w-full rounded-lg bg-white py-2.5 text-sm font-bold text-black hover:bg-zinc-200">Unlock</button>
      </form>
    </div>
  );
}
