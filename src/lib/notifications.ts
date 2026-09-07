import { prisma } from "@/lib/db";
import type { NotificationType } from "@prisma/client";

type CreateOpts = {
  type: NotificationType;
  title: string;
  body?: string | null;
  link?: string | null;
  bookingCode?: string | null;
  bookmaker?: string | null;
  imageUrl?: string | null;
  targetId?: string | null;
};

export async function createNotification(opts: CreateOpts) {
  try {
    return await prisma.notification.create({ data: opts as any });
  } catch (e) {
    // table may not exist yet if migration not run — don't break main flow
    console.warn("createNotification failed", e);
    return null;
  }
}

export async function getNotifications(limit = 30) {
  try {
    const [items, unread] = await Promise.all([
      prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: limit }),
      prisma.notification.count({ where: { read: false } }),
    ]);
    return { items, unread };
  } catch {
    return { items: [], unread: 0 };
  }
}

export async function markAllRead() {
  try {
    await prisma.notification.updateMany({ where: { read: false }, data: { read: true } });
  } catch {}
}

export async function markOneRead(id: string) {
  try {
    await prisma.notification.update({ where: { id }, data: { read: true } });
  } catch {}
}

export async function clearAll() {
  try {
    await prisma.notification.deleteMany({});
  } catch {}
}

export function notificationMeta(type: string) {
  switch (type) {
    case "SUBMISSION_NEW":
      return { icon: "📥", color: "bg-amber-400", label: "New submission", dot: "bg-amber-400" };
    case "SUBMISSION_APPROVED":
      return { icon: "✅", color: "bg-emerald-500", label: "Approved", dot: "bg-emerald-500" };
    case "SUBMISSION_REJECTED":
      return { icon: "❌", color: "bg-red-500", label: "Rejected", dot: "bg-red-500" };
    case "TIP_CREATED":
      return { icon: "📌", color: "bg-cyan-400", label: "Tip published", dot: "bg-cyan-400" };
    case "TIP_WON":
      return { icon: "🏆", color: "bg-emerald-500", label: "Won", dot: "bg-emerald-500" };
    case "TIP_LOST":
      return { icon: "💔", color: "bg-red-500", label: "Lost", dot: "bg-red-500" };
    case "TIP_UPDATED":
      return { icon: "✏️", color: "bg-zinc-400", label: "Updated", dot: "bg-zinc-400" };
    default:
      return { icon: "🔔", color: "bg-violet-500", label: type, dot: "bg-violet-500" };
  }
}

export function timeAgo(d: Date | string) {
  const ms = Date.now() - new Date(d).getTime();
  const s = Math.floor(ms / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(d).toLocaleDateString();
}
