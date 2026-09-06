import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = (session?.user as any)?.role;

  // Public routes
  const publicPrefixes = ["/_next", "/api/auth", "/login", "/api/health"];
  if (publicPrefixes.some((p) => pathname.startsWith(p))) return NextResponse.next();

  // Admin
  if (pathname.startsWith("/admin")) {
    if (pathname.startsWith("/admin/pin")) {
      if (!session) return NextResponse.redirect(new URL("/login?next=" + encodeURIComponent(pathname), req.url));
      if (role !== "ADMIN") return NextResponse.redirect(new URL("/login?error=forbidden", req.url));
      return NextResponse.next();
    }
    if (!session) return NextResponse.redirect(new URL("/login?next=" + encodeURIComponent(pathname), req.url));
    if (role !== "ADMIN") return NextResponse.redirect(new URL("/login?error=forbidden", req.url));
    const pinOk = req.cookies.get("admin_pin_ok")?.value === "1";
    if (!pinOk) return NextResponse.redirect(new URL("/admin/pin?next=" + encodeURIComponent(pathname), req.url));
    return NextResponse.next();
  }

  // Contributor (submit is now public for anon members via guestName)
  if (pathname.startsWith("/contributor")) {
    if (!session) return NextResponse.redirect(new URL("/login?next=" + encodeURIComponent(pathname), req.url));
    if (role !== "ADMIN" && role !== "CONTRIBUTOR") return NextResponse.redirect(new URL("/login?error=forbidden", req.url));
    return NextResponse.next();
  }

  // API admin protection
  if (pathname.startsWith("/api/admin")) {
    if (!session || role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/contributor/:path*", "/api/admin/:path*"],
};
