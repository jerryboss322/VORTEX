import { isAdminPinOk } from "@/lib/adminPin";
import { prisma } from "@/lib/db";

export async function requireAdmin() {
  if (!(await isAdminPinOk())) throw new Error("Unauthorized: admin PIN required (1740)");

  // Resolve to a real User row to satisfy FK constraints (Tip.createdById, Submission.reviewedById)
  // Retry with logging — never return fake id without DB row
  let lastErr: any = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
      if (admin) return { user: { id: admin.id, role: "ADMIN", email: admin.email, name: admin.name } } as any;
      // no admin yet — create canonical fallback
      const fallback = await prisma.user.upsert({
        where: { email: "admin@tipshub.local" },
        update: {},
        create: { email: "admin@tipshub.local", name: "Admin", passwordHash: "pin-1740", role: "ADMIN", isActive: true },
      });
      // verify it exists
      const verify = await prisma.user.findUnique({ where: { id: fallback.id } });
      if (verify) return { user: { id: verify.id, role: "ADMIN", email: verify.email, name: verify.name } } as any;
      return { user: { id: fallback.id, role: "ADMIN", email: fallback.email, name: fallback.name } } as any;
    } catch (e: any) {
      lastErr = e;
      console.error(`requireAdmin attempt ${attempt} failed:`, e?.message || e);
      // wait briefly for Neon pooler transient
      if (attempt < 3) await new Promise((r) => setTimeout(r, 200 * attempt));
    }
  }
  // final fallback: try legacy pin-admin row
  try {
    const pinUser = await prisma.user.upsert({
      where: { email: "admin@pin.local" },
      update: {},
      create: { id: "pin-admin", email: "admin@pin.local", name: "PIN Admin", passwordHash: "pin-1740", role: "ADMIN", isActive: true },
    });
    const v = await prisma.user.findUnique({ where: { id: pinUser.id } });
    if (v) return { user: { id: v.id, role: "ADMIN", email: v.email } } as any;
  } catch (e) {
    console.error("requireAdmin pin fallback failed:", (e as any)?.message);
  }
  throw new Error(`Admin user not available (DB unreachable): ${lastErr?.message || "please check DATABASE_URL and run prisma migrate deploy"}`);
}
