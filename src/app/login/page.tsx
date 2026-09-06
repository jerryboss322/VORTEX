import { signIn, auth } from "@/lib/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const session = await auth();
  if (session?.user) {
    const role = (session.user as any).role;
    redirect(role === "ADMIN" ? "/admin" : "/contributor");
  }
  const sp = await searchParams;
  const isAdminNext = (sp.next || "/admin").startsWith("/admin");
  const errorMessage =
    sp.error === "CredentialsSignin"
      ? "Invalid email or password."
      : sp.error === "CallbackRouteError"
        ? "Login failed — please try again. If this persists, the database may be unreachable."
        : sp.error || null;

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-xl font-bold">{isAdminNext ? "Admin sign in" : "Sign in"}</h1>
      <p className="mt-1 text-sm text-zinc-400">{isAdminNext ? "Admin access — you arrived via /admin." : "Contributor access."}</p>
      {errorMessage && <div className="mt-4 rounded-md bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">{errorMessage}</div>}
      <form
        action={async (formData: FormData) => {
          "use server";
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;
          const next = (formData.get("next") as string) || "/admin";
          try {
            await signIn("credentials", { email, password, redirectTo: next });
          } catch (e) {
            if (isRedirectError(e)) throw e;
            if (e instanceof AuthError) {
              const { redirect } = await import("next/navigation");
              redirect(`/login?error=${encodeURIComponent(e.type)}&next=${encodeURIComponent(next)}`);
            }
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
