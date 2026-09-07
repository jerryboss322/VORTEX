import { NextResponse } from "next/server";
import { getNotifications, markAllRead, markOneRead, clearAll } from "@/lib/notifications";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  // Allow both admin and public to fetch — notifications are global for now
  // If Notification table doesn't exist yet (migration pending), return empty
  try {
    await prisma.$queryRaw`SELECT 1`;
    const data = await getNotifications(40);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ items: [], unread: 0 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id, all, clear } = body as { id?: string; all?: boolean; clear?: boolean };

    if (clear) {
      await clearAll();
      return NextResponse.json({ ok: true });
    }
    if (all) {
      await markAllRead();
      return NextResponse.json({ ok: true });
    }
    if (id) {
      await markOneRead(id);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
