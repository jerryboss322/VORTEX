import { isAdminPinOk } from "@/lib/adminPin";

export async function requireAdmin() {
  if (await isAdminPinOk()) return { user: { id: "pin-admin", role: "ADMIN" } } as any;
  throw new Error("Unauthorized: admin PIN required (1740)");
}
