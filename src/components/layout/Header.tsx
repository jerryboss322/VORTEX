import Link from "next/link";
import { isAdminPinOk, clearPinCookie } from "@/lib/adminPin";
import { MobileToggle } from "./MobileToggle";

export async function Header() {
  const isAdmin = await isAdminPinOk();

  async function logout() {
    "use server";
    await clearPinCookie();
    const { redirect } = await import("next/navigation");
    redirect("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#262626] bg-[#0a0a0a]/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-sm font-bold tracking-tight">
          TipsHub
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-6 text-sm sm:flex">
          <Link href="/tips" className="text-cyan-300/80 hover:text-cyan-300 underline decoration-cyan-500/20 underline-offset-4 transition-colors">
            Tips
          </Link>
          <Link href="/results" className="text-violet-300/80 hover:text-violet-300 underline decoration-violet-500/20 underline-offset-4 transition-colors">
            Results
          </Link>
          <Link href="/submit" className="rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-black hover:bg-amber-300">
            Submit Tip
          </Link>
          {isAdmin ? (
            <>
              <Link href="/admin" className="text-white font-medium">
                Dashboard
              </Link>
              <Link href="/admin/tips" className="text-zinc-400 hover:text-white">
                Tips
              </Link>
              <Link href="/admin/submissions" className="text-zinc-400 hover:text-white">
                Submissions
              </Link>
              <form action={logout}>
                <button className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-zinc-200">Logout</button>
              </form>
            </>
          ) : null}
        </nav>

        <MobileToggle>
          <nav className="flex flex-col px-4 py-3 gap-3 text-sm">
            <Link href="/tips" className="text-zinc-300">Tips</Link>
            <Link href="/results" className="text-zinc-300">Results</Link>
            <Link href="/submit" className="text-zinc-300">Submit Tip</Link>
            {isAdmin ? (
              <>
                <Link href="/admin" className="text-zinc-300">Dashboard</Link>
                <Link href="/admin/tips" className="text-zinc-300">Manage Tips</Link>
                <Link href="/admin/submissions" className="text-zinc-300">Submissions</Link>
                <form action={logout}>
                  <button className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-black">Logout</button>
                </form>
              </>
            ) : null}
          </nav>
        </MobileToggle>
      </div>
    </header>
  );
}
