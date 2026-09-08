import { prisma } from "@/lib/db";
import { toggleContributorAction } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function ContributorsPage() {
  let users: any[] = [];
  try { users = await prisma.user.findMany({ where: { role: "CONTRIBUTOR" }, orderBy: { createdAt: "desc" } }); } catch {}
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-8">
      <div className="rounded-[20px] border border-[var(--th-border)] bg-[var(--th-surface)] p-7 sm:p-8">
        <h1 className="font-display text-[25px] font-[500] tracking-[-0.02em] text-[var(--th-text)]">Contributors</h1>
        <p className="mt-1.5 text-[13px] text-[var(--th-sub)]">Simple mode: guest submissions via Submit Tip — no separate accounts needed.</p>
      </div>
      <div className="mt-6 overflow-hidden rounded-[14px] border border-[var(--th-border)] bg-[var(--th-surface)] divide-y divide-[var(--th-border)]/60">
        {users.length === 0 ? (
          <div className="p-10 text-center text-[13px] text-[var(--th-sub)]">No contributors yet — guest submissions are used.</div>
        ) : (
          users.map((u) => (
            <div key={u.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <div className="text-[13px] font-[500] text-[var(--th-text)]">{u.name} — {u.email}</div>
                <div className="text-[11px] tracking-[0.04em] text-[var(--th-sub)]">{u.isActive ? "Active" : "Disabled"} · {new Date(u.createdAt).toLocaleDateString()}</div>
              </div>
              <form action={async () => { "use server"; await toggleContributorAction(u.id); }}>
                <button
                  className={`rounded-full px-4 py-1.5 text-[12px] font-[500] border ${u.isActive ? "border-[var(--th-border)] text-[var(--th-sub)] hover:text-[var(--th-text)] bg-transparent" : "border-[var(--th-green)] bg-[var(--th-green)] text-[#0E1013]"}`}
                >
                  {u.isActive ? "Disable" : "Enable"}
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
