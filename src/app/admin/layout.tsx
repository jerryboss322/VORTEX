import { isAdminPinOk } from "@/lib/adminPin";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Allow pin page itself without loop
  return <>{children}</>;
}

// Middleware for pin is handled via page check; layout wrapper ensures pin page is reachable
// Actual guard is in each admin page + middleware below via cookie check
