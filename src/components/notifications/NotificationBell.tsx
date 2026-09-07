"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { notificationMeta, timeAgo } from "@/lib/notifications";

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
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#262626] bg-[#141414] hover:bg-[#1a1a1a] transition-colors"
      >
        <span className="text-[16px] leading-none">🔔</span>
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[11px] font-bold text-black">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[380px] max-w-[92vw] overflow-hidden rounded-2xl border border-[#262626] bg-[#0f0f0f] shadow-2xl backdrop-blur z-50">
          {/* header */}
          <div className="flex items-center justify-between border-b border-[#262626] px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-white">Notifications</div>
              <div className="text-xs text-zinc-500">{unread > 0 ? `${unread} unread` : "All caught up"}</div>
            </div>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button onClick={markAll} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-zinc-200">
                  Mark all read
                </button>
              )}
              <button onClick={clearAll} className="rounded-full border border-[#262626] px-3 py-1.5 text-xs text-zinc-400 hover:text-white">
                Clear
              </button>
            </div>
          </div>

          {/* tabs */}
          <div className="flex gap-2 border-b border-[#262626] px-2 py-2">
            {(
              [
                ["all", `All (${items.length})`],
                ["unread", `Unread (${unread})`],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${tab === k ? "bg-white text-black" : "bg-[#1a1a1a] text-zinc-400 hover:text-white"}`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={fetchNotifs}
              className="ml-auto rounded-full border border-[#262626] px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              title="Refresh"
            >
              ↻
            </button>
          </div>

          {/* list */}
          <div className="max-h-[420px] overflow-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1a1a1a] text-lg">{tab === "unread" ? "✨" : "🔕"}</div>
                <div className="text-sm font-medium text-white">{tab === "unread" ? "No unread notifications" : "No notifications yet"}</div>
                <div className="text-xs text-zinc-500">Submissions, approvals, results and tip updates will appear here.</div>
              </div>
            ) : (
              <ul className="divide-y divide-[#1a1a1a]">
                {filtered.map((n) => {
                  const m = notificationMeta(n.type);
                  return (
                    <li key={n.id} className={`group relative flex gap-3 px-4 py-3 hover:bg-[#141414] transition-colors ${!n.read ? "bg-[#141414]/60" : ""}`}>
                      {!n.read && <span className={`absolute left-0 top-0 h-full w-0.5 ${m.dot}`} />}
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${!n.read ? "bg-white text-black" : "bg-[#1e1e1e] text-zinc-300"}`}>{m.icon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-sm font-medium leading-tight text-white line-clamp-1">{n.title}</div>
                          <span className="shrink-0 text-[11px] text-zinc-500">{timeAgo(n.createdAt)}</span>
                        </div>
                        {n.body && <div className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-zinc-400">{n.body}</div>}
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {n.bookingCode && <span className="rounded bg-[#262626] px-1.5 py-0.5 text-[11px] font-mono text-zinc-300">{n.bookingCode}</span>}
                          {n.bookmaker && <span className="text-[11px] text-zinc-500">{n.bookmaker}</span>}
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${!n.read ? "bg-amber-400 text-black" : "bg-[#1e1e1e] text-zinc-400"}`}>{m.label}</span>
                        </div>
                        {n.link && (
                          <Link href={n.link} onClick={() => markOne(n.id)} className="mt-2 inline-flex text-xs font-medium text-cyan-300 hover:text-cyan-200">
                            View →
                          </Link>
                        )}
                      </div>
                      {!n.read ? (
                        <button onClick={() => markOne(n.id)} className="self-center rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-black opacity-0 group-hover:opacity-100 transition-opacity">
                          Read
                        </button>
                      ) : (
                        <span className="self-center h-2 w-2 rounded-full bg-zinc-700" />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-[#262626] bg-[#0f0f0f] px-4 py-2.5 text-xs">
            <span className="text-zinc-500">Auto-refreshes every 15s</span>
            <Link href="/admin/submissions" onClick={() => setOpen(false)} className="font-medium text-white hover:text-zinc-300">
              Go to submissions →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
