import { auth } from "@/lib/auth";
import { isAdminPinOk } from "@/lib/adminPin";
import { prisma } from "@/lib/db";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

export async function requireAdmin() {
  // PIN 1740 grants admin (no email needed) — resolve to real ADMIN user for FK
  if (await isAdminPinOk()) {
    const session = await auth();
    if (session?.user && (session.user as any).role === "ADMIN") return session;
    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (admin) return { user: { id: admin.id, role: "ADMIN", email: admin.email, name: admin.name } } as any;
    return { user: { id: "pin-admin", role: "ADMIN", email: "admin@pin.local" } } as any;
  }
  const session = await requireAuth();
  if ((session.user as any).role !== "ADMIN") throw new Error("Forbidden: Admin only");
  return session;
}

export async function requireContributor() {
  const session = await requireAuth();
  const role = (session.user as any).role;
  if (role !== "ADMIN" && role !== "CONTRIBUTOR") throw new Error("Forbidden");
  return session;
}

export function isAdmin(session: any) {
  return session?.user?.role === "ADMIN";
}
