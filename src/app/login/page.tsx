import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const sp = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-xl font-bold">Login</h1>
      <p className="mt-1 text-sm text-zinc-400">Admin and contributors only.</p>
      {sp.error && <div className="mt-4 rounded-md bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">{sp.error}</div>}
      <form
        action={async (formData: FormData) => {
          "use server";
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;
          const next = (formData.get("next") as string) || "/admin";
          try {
            await signIn("credentials", { email, password, redirectTo: next });
          } catch (e: any) {
            // NextAuth throws redirect
            throw e;
          }
        }}
        className="mt-6 space-y-4 rounded-lg border border-[#262626] bg-[#141414] p-6"
      >
        <input type="hidden" name="next" value={sp.next || ""} />
        <div>
          <label className="text-xs text-zinc-400">Email</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-zinc-400">Password</label>
          <input name="password" type="password" required className="mt-1 w-full rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
        </div>
        <button className="w-full rounded-md bg-white py-2 text-sm font-semibold text-black">Sign in</button>
      </form>
    </div>
  );
}
