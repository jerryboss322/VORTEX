import Link from "next/link";
import { headers } from "next/headers";
import { isAdminPinOk, clearPinCookie } from "@/lib/adminPin";
import { MobileToggle } from "./MobileToggle";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { AnimatedNavLink } from "./HeaderNav";

function TicketIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="3" y="6" width="18" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.35" />
      <path d="M8 6v12M16 6v12" stroke="currentColor" strokeWidth="1.15" strokeDasharray="1.5 1.5" opacity="0.55" />
      <circle cx="3" cy="12" r="1.4" fill="var(--th-bg)" stroke="currentColor" strokeWidth="1.15" />
      <circle cx="21" cy="12" r="1.4" fill="var(--th-bg)" stroke="currentColor" strokeWidth="1.15" />
    </svg>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`relative py-1 text-[13px] font-[400] tracking-[0.01em] transition-colors ${
        active ? "text-[var(--th-text)]" : "text-[var(--th-sub)] hover:text-[var(--th-text)]"
      }`}
    >
      {label}
      {active && <span className="absolute inset-x-0 -bottom-[9px] h-[1.5px] bg-[var(--th-gold)]" aria-hidden />}
    </Link>
  );
}

export async function Header() {
  const isAdmin = await isAdminPinOk();
  const h = await headers();
  const pathname = h.get("x-pathname") || h.get("next-url") || "";
  // fallback: read from header injected by middleware if available, otherwise approximate via referer not needed
  // We use simple path detection inside client would be better, but async header gives us url when available.
  // If not available, active state falls back to no underline — still classy.
  const isActive = (p: string) => pathname.startsWith(p);

  async function logout() {
    "use server";
    await clearPinCookie();
    const { redirect } = await import("next/navigation");
    redirect("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--th-border)] bg-[var(--th-bg)]/85 backdrop-blur-[12px]">
      <div className="mx-auto flex h-[56px] max-w-6xl items-center justify-between gap-6 px-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--th-chip)] border border-[var(--th-border)] text-[var(--th-gold)]">
            <TicketIcon />
          </span>
          <span className="font-display text-[19px] font-[600] tracking-[-0.02em] text-[var(--th-text)]">TipsHub</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-6 sm:flex">
          <AnimatedNavLink href="/tips" label="Tips" />
          <AnimatedNavLink href="/results" label="Results" />
          <Link
            href="/submit"
            className="rounded-full border border-[var(--th-border)] bg-transparent px-3.5 py-1.5 text-[12px] font-[500] tracking-[0.02em] text-[var(--th-text)] hover:border-[var(--th-text)]/20 hover:bg-[var(--th-chip)] transition-colors"
          >
            Submit tip
          </Link>
          {isAdmin ? (
            <>
              <Link href="/admin" className={`text-[13px] ${isActive("/admin") && !isActive("/admin/tips") && !isActive("/admin/submissions") ? "text-[var(--th-text)] underline decoration-[var(--th-gold)] underline-offset-[10px] decoration-[1.5px]" : "text-[var(--th-sub)] hover:text-[var(--th-text)]"}`}>
                Dashboard
              </Link>
              <Link href="/admin/tips" className={`text-[13px] ${isActive("/admin/tips") ? "text-[var(--th-text)] underline decoration-[var(--th-gold)] underline-offset-[10px] decoration-[1.5px]" : "text-[var(--th-sub)] hover:text-[var(--th-text)]"}`}>
                Tips
              </Link>
              <Link href="/admin/submissions" className={`text-[13px] ${isActive("/admin/submissions") ? "text-[var(--th-text)] underline decoration-[var(--th-gold)] underline-offset-[10px] decoration-[1.5px]" : "text-[var(--th-sub)] hover:text-[var(--th-text)]"}`}>
                Submissions
              </Link>
              <span className="h-4 w-px bg-[var(--th-border)]" aria-hidden />
              <NotificationBell />
              <form action={logout}>
                <button className="rounded-full border border-[var(--th-border)] bg-transparent px-3 py-1.5 text-[12px] font-[500] text-[var(--th-sub)] hover:text-[var(--th-text)] hover:border-[var(--th-text)]/15 transition-colors">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <span className="h-4 w-px bg-[var(--th-border)] hidden lg:block" aria-hidden />
              <NotificationBell />
            </>
          )}
        </nav>

        <div className="flex items-center gap-3 sm:hidden">
          <NotificationBell />
          <MobileToggle>
            <nav className="flex flex-col px-4 py-3 gap-1 text-sm">
              <Link href="/tips" className="rounded-full px-3 py-2 text-[var(--th-text)] hover:bg-[var(--th-chip)]">Tips</Link>
              <Link href="/results" className="rounded-full px-3 py-2 text-[var(--th-text)] hover:bg-[var(--th-chip)]">Results</Link>
              <Link href="/submit" className="rounded-full px-3 py-2 text-[var(--th-text)] hover:bg-[var(--th-chip)]">Submit Tip</Link>
              {isAdmin ? (
                <>
                  <Link href="/admin" className="rounded-full px-3 py-2 text-[var(--th-text)] hover:bg-[var(--th-chip)]">Dashboard</Link>
                  <Link href="/admin/tips" className="rounded-full px-3 py-2 text-[var(--th-text)] hover:bg-[var(--th-chip)]">Manage Tips</Link>
                  <Link href="/admin/submissions" className="rounded-full px-3 py-2 text-[var(--th-text)] hover:bg-[var(--th-chip)]">Submissions</Link>
                  <form action={logout}>
                    <button className="w-full rounded-full border border-[var(--th-border)] px-3 py-2 text-sm font-medium text-[var(--th-text)]">Logout</button>
                  </form>
                </>
              ) : null}
            </nav>
          </MobileToggle>
        </div>
      </div>
    </header>
  );
}
