import { auth } from "@/lib/auth";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

export async function requireAdmin() {
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
