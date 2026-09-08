"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import { notificationMeta, timeAgo } from "@/lib/notifications";
import { spring, playfulSpring } from "@/lib/motion";

type Notif = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  bookingCode: string | null;
  bookmaker: string | null;
  imageUrl: string | null;
  read: boolean;
  createdAt: string;
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [items, setItems] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifs = useCallback(async () => {
    try {
      const r = await fetch("/api/notifications", { cache: "no-store" });
      if (!r.ok) return;
      const j = await r.json();
      setItems(j.items ?? []);
      setUnread(j.unread ?? 0);
    } catch {}
  }, []);

  useEffect(() => {
    fetchNotifs();
    const id = setInterval(fetchNotifs, 15000);
    const onFocus = () => fetchNotifs();
    const onVis = () => document.visibilityState === "visible" && fetchNotifs();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [fetchNotifs]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function markAll() {
    await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ all: true }) });
    setItems((v) => v.map((n) => ({ ...n, read: true })));
    setUnread(0);
  }

  async function markOne(id: string) {
    setItems((v) => v.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnread((u) => Math.max(0, u - 1));
    await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
  }

  async function clearAll() {
    await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clear: true }) });
    setItems([]);
    setUnread(0);
  }

  const filtered = tab === "unread" ? items.filter((i) => !i.read) : items;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] hover:bg-[var(--th-surface)] transition-colors"
      >
        <span className="text-[14px] leading-none text-[var(--th-sub)]">◯</span>
        <AnimatePresence>
          {unread > 0 && (
            <m.span
              key={unread}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: unread > 0 ? [0, -12, 12, -6, 0] as any : 0 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={unread > 0 ? playfulSpring : spring}
              className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--th-gold)] px-1 text-[10px] font-[600] text-[#0E1013]"
            >
              {unread > 99 ? "99+" : unread}
            </m.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={spring}
            style={{ originX: 1, originY: 0 }}
            className="absolute right-0 mt-3 w-[380px] max-w-[92vw] overflow-hidden rounded-[14px] border border-[var(--th-border)] bg-[var(--th-surface)] z-50"
          >
            <div className="flex items-center justify-between border-b border-[var(--th-border)] px-4 py-3">
              <div>
                <div className="text-[13px] font-[500] text-[var(--th-text)]">Notifications</div>
                <div className="text-[12px] text-[var(--th-sub)]">{unread > 0 ? `${unread} unread` : "All caught up"}</div>
              </div>
              <div className="flex items-center gap-1.5">
                {unread > 0 && (
                  <button onClick={markAll} className="rounded-full bg-[var(--th-text)] px-3 py-1.5 text-[12px] font-[500] text-[#0E1013] hover:bg-[#ddd8cf]">
                    Mark all read
                  </button>
                )}
                <button onClick={clearAll} className="rounded-full border border-[var(--th-border)] px-3 py-1.5 text-[12px] text-[var(--th-sub)] hover:text-[var(--th-text)]">
                  Clear
                </button>
              </div>
            </div>

            <div className="flex gap-2 border-b border-[var(--th-border)] px-2 py-2">
              {(
                [
                  ["all", `All (${items.length})`],
                  ["unread", `Unread (${unread})`],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-[500] transition-colors ${tab === k ? "bg-[var(--th-text)] text-[#0E1013]" : "bg-[var(--th-chip)] text-[var(--th-sub)] hover:text-[var(--th-text)]"}`}
                >
                  {label}
                </button>
              ))}
              <button onClick={fetchNotifs} className="ml-auto rounded-full border border-[var(--th-border)] px-3 py-1.5 text-[12px] text-[var(--th-sub)] hover:text-[var(--th-text)]" title="Refresh">
                ↻
              </button>
            </div>

            <div className="max-h-[420px] overflow-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[var(--th-chip)] border border-[var(--th-border)] text-[var(--th-sub)] text-[14px]">{tab === "unread" ? "✦" : "○"}</div>
                  <div className="text-[13px] font-[500] text-[var(--th-text)]">{tab === "unread" ? "No unread notifications" : "No notifications yet"}</div>
                  <div className="text-[12px] text-[var(--th-sub)]">Submissions, approvals, results and tip updates will appear here.</div>
                </div>
              ) : (
                <ul className="divide-y divide-[var(--th-border)]/60">
                  <AnimatePresence initial={false}>
                    {filtered.map((n) => {
                      const meta = notificationMeta(n.type);
                      return (
                        <m.li
                          key={n.id}
                          layout
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.18 }}
                          className={`group relative flex gap-3 px-4 py-3 hover:bg-[var(--th-chip)]/50 transition-colors ${!n.read ? "bg-[var(--th-chip)]/30" : ""}`}
                        >
                          {!n.read && <span className={`absolute left-0 top-0 h-full w-0.5 ${meta.dot}`} />}
                          <div className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] border border-[var(--th-border)] text-[13px] ${!n.read ? "bg-[var(--th-chip)] text-[var(--th-text)]" : "bg-transparent text-[var(--th-sub)]"}`}>{meta.icon}</div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="text-[13px] font-[500] leading-tight text-[var(--th-text)] line-clamp-1">{n.title}</div>
                              <span className="shrink-0 text-[11px] text-[var(--th-sub)]">{timeAgo(n.createdAt)}</span>
                            </div>
                            {n.body && <div className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-[var(--th-sub)]">{n.body}</div>}
                            <div className="mt-1.5 flex flex-wrap items-center gap-2">
                              {n.bookingCode && <span className="rounded-[9px] border border-[var(--th-border)] bg-[var(--th-chip)] px-1.5 py-0.5 text-[11px] font-mono text-[var(--th-text)]">{n.bookingCode}</span>}
                              {n.bookmaker && <span className="text-[11px] text-[var(--th-sub)]">{n.bookmaker}</span>}
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-[400] ${!n.read ? "bg-[var(--th-gold)] text-[#3A2E14]" : "bg-[var(--th-chip)] text-[var(--th-sub)]"}`}>{meta.label}</span>
                            </div>
                            {n.link && (
                              <Link href={n.link} onClick={() => markOne(n.id)} className="mt-2 inline-flex text-[12px] font-[500] text-[var(--th-sub)] hover:text-[var(--th-text)] underline underline-offset-4 decoration-[var(--th-border)]">
                                View →
                              </Link>
                            )}
                          </div>
                          {!n.read ? (
                            <button onClick={() => markOne(n.id)} className="self-center rounded-full bg-[var(--th-text)] px-2.5 py-1 text-[11px] font-[600] text-[#0E1013] opacity-0 group-hover:opacity-100 transition-opacity">
                              Read
                            </button>
                          ) : (
                            <span className="self-center h-1.5 w-1.5 rounded-full bg-[var(--th-border)]" />
                          )}
                        </m.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-[var(--th-border)] bg-[var(--th-chip)]/30 px-4 py-2.5 text-[12px]">
              <span className="text-[var(--th-sub)]">Auto-refreshes every 15s</span>
              <Link href="/admin/submissions" onClick={() => setOpen(false)} className="font-[500] text-[var(--th-text)] hover:text-[var(--th-sub)] underline underline-offset-4 decoration-[var(--th-border)]">
                Go to submissions →
              </Link>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
