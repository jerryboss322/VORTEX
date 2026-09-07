import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold">Admin</h1>
      <p className="mt-1 text-sm text-zinc-400">PIN 1740 — simple controls.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/tips" className="rounded-xl border border-[#262626] bg-[#141414] p-5 hover:bg-zinc-900">
          <div className="h-2 w-8 rounded bg-cyan-500/70 mb-3" />
          <div className="text-sm font-semibold">Manage Tips</div>
          <div className="text-xs text-zinc-500 mt-1">Publish, edit odds, delete, set WON/LOST</div>
        </Link>
        <Link href="/admin/submissions" className="rounded-xl border border-[#262626] bg-[#141414] p-5 hover:bg-zinc-900">
          <div className="h-2 w-8 rounded bg-amber-400/70 mb-3" />
          <div className="text-sm font-semibold">Submissions</div>
          <div className="text-xs text-zinc-500 mt-1">Review guest tips → Approve/Reject</div>
        </Link>
        <Link href="/tips" className="rounded-xl border border-[#262626] bg-[#141414] p-5 hover:bg-zinc-900">
          <div className="h-2 w-8 rounded bg-violet-400/70 mb-3" />
          <div className="text-sm font-semibold">View Site</div>
          <div className="text-xs text-zinc-500 mt-1">See what members see</div>
        </Link>
      </div>

      <div className="mt-6 rounded-lg border border-[#262626] bg-[#141414] p-4 text-sm text-zinc-400">
        Tip: Go to <span className="text-white font-mono">/admin</span> directly, enter <span className="text-white font-bold">1740</span>, then use the cards above. No extra env needed.
      </div>
    </div>
  );
}
