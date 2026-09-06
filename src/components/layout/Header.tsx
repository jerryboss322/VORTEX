import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { MobileToggle } from "./MobileToggle";

export async function Header() {
  const session = await auth();
  const role = (session?.user as any)?.role as string | undefined;
  const isAuthed = !!session?.user;

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#262626] bg-[#0a0a0a]/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-sm font-bold tracking-tight">
          TipsHub
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-6 text-sm sm:flex">
          <Link href="/tips" className="text-zinc-400 hover:text-white transition-colors">
            Tips
          </Link>
          <Link href="/results" className="text-zinc-400 hover:text-white transition-colors">
            Results
          </Link>
          {!isAuthed && (
            <Link href="/admin" className="rounded-md border border-[#262626] px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white">
              Admin
            </Link>
          )}
          {isAuthed && role === "CONTRIBUTOR" && (
            <>
              <Link href="/submit" className="text-zinc-400 hover:text-white">
                Submit Tip
              </Link>
              <Link href="/contributor" className="text-zinc-400 hover:text-white">
                My Submissions
              </Link>
            </>
          )}
          {isAuthed && role === "ADMIN" && (
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
            </>
          )}
          {isAuthed ? (
            <form action={logout}>
              <button className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-zinc-200">Logout</button>
            </form>
          ) : null}
        </nav>

        <MobileToggle>
          <nav className="flex flex-col px-4 py-3 gap-3 text-sm">
            <Link href="/tips" className="text-zinc-300">Tips</Link>
            <Link href="/results" className="text-zinc-300">Results</Link>
            {!isAuthed && (
              <Link href="/admin" className="rounded-md border border-[#262626] px-3 py-2 text-center text-zinc-300">
                Admin
              </Link>
            )}
            {isAuthed && role === "CONTRIBUTOR" && (
              <>
                <Link href="/submit" className="text-zinc-300">Submit Tip</Link>
                <Link href="/contributor" className="text-zinc-300">My Submissions</Link>
              </>
            )}
            {isAuthed && role === "ADMIN" && (
              <>
                <Link href="/admin" className="text-zinc-300">Dashboard</Link>
                <Link href="/admin/tips" className="text-zinc-300">Manage Tips</Link>
                <Link href="/admin/submissions" className="text-zinc-300">Submissions</Link>
                <Link href="/admin/contributors" className="text-zinc-300">Contributors</Link>
              </>
            )}
            {isAuthed && (
              <form action={logout}>
                <button className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-black">Logout</button>
              </form>
            )}
          </nav>
        </MobileToggle>
      </div>
    </header>
  );
}
