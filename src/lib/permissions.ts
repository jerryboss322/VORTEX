import { isAdminPinOk } from "@/lib/adminPin";
import { prisma } from "@/lib/db";

export async function requireAdmin() {
  if (await isAdminPinOk()) {
    // Resolve to a real User row to satisfy FK constraints (Tip.createdById, Submission.reviewedById)
    try {
      const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
      if (admin) return { user: { id: admin.id, role: "ADMIN", email: admin.email, name: admin.name } } as any;
    } catch {}
    // No ADMIN row yet — create fallback so FKs succeed (matches prisma/seed.ts)
    try {
      const fallback = await prisma.user.upsert({
        where: { email: "admin@tipshub.local" },
        update: {},
        create: { email: "admin@tipshub.local", name: "Admin", passwordHash: "pin-1740", role: "ADMIN", isActive: true },
      });
      return { user: { id: fallback.id, role: "ADMIN", email: fallback.email, name: fallback.name } } as any;
    } catch {}
    // Last resort: legacy pin-admin id — try to ensure it exists as a User row
    try {
      const pinUser = await prisma.user.upsert({
        where: { email: "admin@pin.local" },
        update: {},
        create: { id: "pin-admin", email: "admin@pin.local", name: "PIN Admin", passwordHash: "pin-1740", role: "ADMIN", isActive: true },
      });
      return { user: { id: pinUser.id, role: "ADMIN", email: pinUser.email } } as any;
    } catch {}
    // If DB is unreachable, return pin-admin anyway (will surface as DB error, not FK silent fail)
    return { user: { id: "pin-admin", role: "ADMIN", email: "admin@pin.local" } } as any;
  }
  throw new Error("Unauthorized: admin PIN required (1740)");
}
