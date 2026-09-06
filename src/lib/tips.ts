import { prisma } from "@/lib/db";

export async function getTipsGrouped(filters?: { status?: string; bookmaker?: string; search?: string; page?: number }) {
  const page = filters?.page || 1;
  const take = 20;
  const skip = (page - 1) * take;
  const where: any = {};
  if (filters?.status) where.status = filters.status;
  if (filters?.bookmaker) where.bookmaker = { contains: filters.bookmaker, mode: "insensitive" };
  if (filters?.search) {
    where.OR = [
      { bookingCode: { contains: filters.search, mode: "insensitive" } },
      { bookmaker: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  const [tips, total] = await Promise.all([
    prisma.tip.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
    prisma.tip.count({ where }),
  ]);
  return { tips, total, page, totalPages: Math.ceil(total / take) };
}

export function groupByDate(tips: any[]) {
  const map = new Map<string, any[]>();
  for (const t of tips) {
    const d = new Date(t.createdAt);
    const key = d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  }
  return Array.from(map.entries()).map(([date, tips]) => ({ date, tips }));
}
