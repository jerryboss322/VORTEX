import { prisma } from "@/lib/db";
import { createContributorAction, toggleContributorAction } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function ContributorsPage() {
  let users: any[] = [];
  try { users = await prisma.user.findMany({ where: { role: "CONTRIBUTOR" }, orderBy: { createdAt: "desc" } }); } catch {}
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold">Contributors</h1>
      <form action={createContributorAction} className="mt-6 grid sm:grid-cols-4 gap-3 rounded-lg border border-[#262626] bg-[#141414] p-4">
        <input name="name" placeholder="Name" required className="rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
        <input name="email" type="email" placeholder="Email" required className="rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
        <input name="password" type="password" placeholder="Password (min 8)" required className="rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm" />
        <button className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black">Create</button>
      </form>
      <div className="mt-6 space-y-2">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between rounded-lg border border-[#262626] bg-[#141414] px-4 py-3 text-sm">
            <div><div className="font-medium">{u.name} — {u.email}</div><div className="text-xs text-zinc-500">{u.isActive ? "Active" : "Disabled"} · {new Date(u.createdAt).toLocaleDateString()}</div></div>
            <form action={async () => { "use server"; await toggleContributorAction(u.id); }}>
              <button className={`rounded-md px-3 py-1.5 text-xs font-semibold ${u.isActive ? "bg-amber-600 text-white" : "bg-emerald-600 text-white"}`}>{u.isActive ? "Disable" : "Enable"}</button>
            </form>
          </div>
        ))}
        {users.length === 0 && <p className="text-sm text-zinc-500">No contributors yet.</p>}
      </div>
    </div>
  );
}
