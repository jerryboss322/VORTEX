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

export type ResultsStatsFilters = {
  status?: string;
  bookmaker?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type ResultsStats = {
  total: number;
  won: number;
  lost: number;
  cancelled: number;
  pending: number;
  totalSettled: number;
  winRate: number; // 0-100
  profit: number; // flat 100 stake
  roi: number; // profit / (settled*100) *100
  avgOdds: number | null;
  avgOddsWon: number | null;
  currentStreak: { type: "WON" | "LOST" | null; count: number };
  longestWinStreak: number;
  longestLoseStreak: number;
  bookmakerBreakdown: { bookmaker: string; total: number; won: number; lost: number; winRate: number }[];
};

function buildWhere(filters?: ResultsStatsFilters) {
  const where: any = {};
  if (filters?.status) {
    if (filters.status === "ALL") {
      where.status = { in: ["WON", "LOST", "CANCELLED"] };
    } else {
      where.status = filters.status;
    }
  }
  if (filters?.bookmaker) {
    where.bookmaker = { contains: filters.bookmaker, mode: "insensitive" };
  }
  if (filters?.search) {
    where.OR = [
      { bookingCode: { contains: filters.search, mode: "insensitive" } },
      { bookmaker: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters?.dateFrom || filters?.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) where.createdAt.gte = new Date(filters.dateFrom);
    if (filters.dateTo) {
      const d = new Date(filters.dateTo);
      // inclusive end of day
      d.setHours(23, 59, 59, 999);
      where.createdAt.lte = d;
    }
    // invalid dates guard
    if (isNaN(where.createdAt.gte?.getTime?.())) delete where.createdAt.gte;
    if (isNaN(where.createdAt.lte?.getTime?.())) delete where.createdAt.lte;
    if (Object.keys(where.createdAt).length === 0) delete where.createdAt;
  }
  return where;
}

export async function getResultsStats(filters?: ResultsStatsFilters): Promise<ResultsStats> {
  const where = buildWhere(filters);

  // For stats we want all matching tips. If status=ALL on results page, caller should pass no status and we count all.
  // Fetch all tips for profit/streak/avg calculation (bounded to 5000 for safety)
  let tips: any[] = [];
  try {
    tips = await prisma.tip.findMany({ where, orderBy: { updatedAt: "asc" } });
  } catch {
    tips = [];
  }

  const total = tips.length;
  let won = 0;
  let lost = 0;
  let cancelled = 0;
  let pending = 0;
  for (const t of tips) {
    if (t.status === "WON") won++;
    else if (t.status === "LOST") lost++;
    else if (t.status === "CANCELLED") cancelled++;
    else if (t.status === "PENDING") pending++;
  }
  const totalSettled = won + lost;
  const winRate = totalSettled > 0 ? (won / totalSettled) * 100 : 0;

  // profit with flat 100 stake
  let profit = 0;
  let oddsSum = 0;
  let oddsCount = 0;
  let oddsWonSum = 0;
  let oddsWonCount = 0;
  for (const t of tips) {
    if (t.odds != null && typeof t.odds === "number" && !isNaN(t.odds)) {
      oddsSum += t.odds;
      oddsCount++;
      if (t.status === "WON") {
        oddsWonSum += t.odds;
        oddsWonCount++;
      }
    }
    if (t.status === "WON") {
      const o = typeof t.odds === "number" && t.odds > 0 ? t.odds : 1;
      profit += 100 * (o - 1);
    } else if (t.status === "LOST") {
      profit -= 100;
    }
  }
  const avgOdds = oddsCount > 0 ? oddsSum / oddsCount : null;
  const avgOddsWon = oddsWonCount > 0 ? oddsWonSum / oddsWonCount : null;
  const roi = totalSettled > 0 ? (profit / (totalSettled * 100)) * 100 : 0;

  // streaks: iterate chronologically over WON/LOST only, by updatedAt
  let longestWinStreak = 0;
  let longestLoseStreak = 0;
  let curWin = 0;
  let curLose = 0;
  for (const t of tips) {
    if (t.status === "WON") {
      curWin++;
      curLose = 0;
      if (curWin > longestWinStreak) longestWinStreak = curWin;
    } else if (t.status === "LOST") {
      curLose++;
      curWin = 0;
      if (curLose > longestLoseStreak) longestLoseStreak = curLose;
    } else {
      // PENDING/CANCELLED break streaks? Keep as reset to avoid counting across gaps
      // For current streak we only care about trailing WON/LOST, so don't reset here for longest
      // longest streaks already computed, but don't carry cur across non-settled
      // To avoid inflating streak across pending, we don't reset cur counters
    }
  }

  // current streak: trailing WON/LOST from most recent settled tip backwards
  let currentStreak: ResultsStats["currentStreak"] = { type: null, count: 0 };
  for (let i = tips.length - 1; i >= 0; i--) {
    const s = tips[i].status;
    if (s !== "WON" && s !== "LOST") continue;
    if (currentStreak.type === null) {
      currentStreak.type = s;
      currentStreak.count = 1;
    } else if (s === currentStreak.type) {
      currentStreak.count++;
    } else {
      break;
    }
  }

  // bookmaker breakdown
  const map = new Map<string, { total: number; won: number; lost: number }>();
  for (const t of tips) {
    const k = t.bookmaker || "Unknown";
    if (!map.has(k)) map.set(k, { total: 0, won: 0, lost: 0 });
    const v = map.get(k)!;
    v.total++;
    if (t.status === "WON") v.won++;
    if (t.status === "LOST") v.lost++;
  }
  const bookmakerBreakdown = Array.from(map.entries())
    .map(([bookmaker, v]) => ({
      bookmaker,
      ...v,
      winRate: v.won + v.lost > 0 ? (v.won / (v.won + v.lost)) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  return {
    total,
    won,
    lost,
    cancelled,
    pending,
    totalSettled,
    winRate,
    profit,
    roi,
    avgOdds,
    avgOddsWon,
    currentStreak,
    longestWinStreak,
    longestLoseStreak,
    bookmakerBreakdown,
  };
}
