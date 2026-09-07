import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public prefixes
  if (pathname.startsWith("/_next") || pathname.startsWith("/api/health")) {
    return NextResponse.next();
  }

  // Admin — PIN 1740 only, allow /admin/pin always
  if (pathname.startsWith("/admin")) {
    if (pathname.startsWith("/admin/pin")) return NextResponse.next();
    const pinOk = req.cookies.get("admin_pin_ok")?.value === "1";
    if (!pinOk) return NextResponse.redirect(new URL("/admin/pin?next=" + encodeURIComponent(pathname), req.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
