"use server";
import { prisma } from "@/lib/db";
import { tipSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/permissions";
import { uploadSlipImage, deleteSlipImage } from "@/lib/storage";
import { createNotification } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

export async function createTipAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const userId = (session.user as any).id;
  const u = await prisma.user.findUnique({ where: { id: userId } });
  if (!u) throw new Error(`Admin user ${userId} not found — run prisma migrate deploy`);
  const data = tipSchema.parse({
    bookingCode: formData.get("bookingCode"),
    bookmaker: formData.get("bookmaker"),
    odds: formData.get("odds") || null,
    confidence: formData.get("confidence") || null,
    note: formData.get("note") || null,
    status: formData.get("status") || "PENDING",
  });
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) throw new Error("Slip screenshot is required");
  let imageUrl = "";
  let storageKey = "";
  try {
    const { url, key } = await uploadSlipImage(file);
    storageKey = key;
    imageUrl = url;
  } catch (e: any) {
    throw new Error(e.message || "Upload failed");
  }

  const tip = await prisma.tip.create({
    data: {
      imageUrl,
      storageKey,
      bookingCode: data.bookingCode.toUpperCase().trim(),
      bookmaker: data.bookmaker.trim(),
      odds: data.odds ?? null,
      confidence: data.confidence ?? null,
      note: data.note || null,
      status: (data.status as any) || "PENDING",
      createdById: userId,
    },
  });
  await prisma.activityLog.create({ data: { userId, action: "TIP_CREATED", targetType: "Tip", targetId: tip.id } });
  await createNotification({
    type: "TIP_CREATED",
    title: `New tip published — ${data.bookingCode.toUpperCase()}`,
    body: `${data.bookmaker} · ${data.odds ? `Odds ${data.odds}` : "Odds —"}${data.note ? ` · ${data.note.slice(0, 80)}` : ""}`,
    link: `/tips/${tip.id}`,
    bookingCode: data.bookingCode.toUpperCase().trim(),
    bookmaker: data.bookmaker.trim(),
    imageUrl,
    targetId: tip.id,
  });
  revalidatePath("/");
  revalidatePath("/tips");
}

export async function createTipsBatchAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const userId = (session.user as any).id;
  const u = await prisma.user.findUnique({ where: { id: userId } });
  if (!u) throw new Error(`Admin user ${userId} not found — run prisma migrate deploy`);
  const count = Math.min(10, Math.max(1, Number(formData.get("count") || 0)));
  if (!count || count < 1) throw new Error("No games in batch");
  if (count > 10) throw new Error("Max 10 games per batch");

  type Game = { bookingCode: string; bookmaker: string; odds: number | null; confidence: number | null; note: string | null; status: string; image: File };
  const games: Game[] = [];
  for (let i = 0; i < count; i++) {
    const file = formData.get(`image_${i}`) as File | null;
    if (!file || file.size === 0) throw new Error(`Game ${i + 1}: slip screenshot is required`);
    const raw = {
      bookingCode: formData.get(`bookingCode_${i}`),
      bookmaker: formData.get(`bookmaker_${i}`),
      odds: formData.get(`odds_${i}`) || null,
      confidence: formData.get(`confidence_${i}`) || null,
      note: formData.get(`note_${i}`) || null,
      status: formData.get(`status_${i}`) || "PENDING",
    };
    const data = tipSchema.parse(raw);
    games.push({ bookingCode: data.bookingCode, bookmaker: data.bookmaker, odds: data.odds ?? null, confidence: data.confidence ?? null, note: data.note ?? null, status: data.status ?? "PENDING", image: file });
  }

  // upload all images (concurrency 3)
  const uploaded: { url: string; key: string }[] = [];
  for (const g of games) {
    const { url, key } = await uploadSlipImage(g.image);
    uploaded.push({ url, key });
  }

  const ids: string[] = [];
  const codes: string[] = [];
  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < games.length; i++) {
      const g = games[i];
      const up = uploaded[i];
      const tip = await tx.tip.create({
        data: {
          imageUrl: up.url,
          storageKey: up.key,
          bookingCode: g.bookingCode.toUpperCase().trim(),
          bookmaker: g.bookmaker.trim(),
          odds: g.odds ?? null,
          confidence: g.confidence ?? null,
          note: g.note || null,
          status: (g.status as any) || "PENDING",
          createdById: userId,
        },
      });
      ids.push(tip.id);
      codes.push(tip.bookingCode);
      await tx.activityLog.create({ data: { userId, action: "TIP_CREATED_BATCH", targetType: "Tip", targetId: tip.id, metadata: { batchIndex: i, batchCount: games.length } as any } });
    }
  });

  const preview = codes.slice(0, 3).join(", ") + (codes.length > 3 ? ` +${codes.length - 3} more` : "");
  await createNotification({
    type: "TIP_CREATED",
    title: `Published ${ids.length} tip${ids.length > 1 ? "s" : ""} — ${preview}`,
    body: games.map((g) => `${g.bookingCode.toUpperCase()} · ${g.bookmaker}`).join(" · ").slice(0, 200),
    link: ids.length === 1 ? `/tips/${ids[0]}` : "/tips",
    bookingCode: codes[0] || null,
    bookmaker: games[0]?.bookmaker || null,
    imageUrl: uploaded[0]?.url || null,
    targetId: ids[0] || null,
  });

  revalidatePath("/");
  revalidatePath("/tips");
}

export async function updateTipAction(id: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const data = tipSchema.parse({
    bookingCode: formData.get("bookingCode"),
    bookmaker: formData.get("bookmaker"),
    odds: formData.get("odds") || null,
    confidence: formData.get("confidence") || null,
    note: formData.get("note") || null,
    status: formData.get("status") || "PENDING",
  });
  const file = formData.get("image") as File | null;
  let update: any = {
    bookingCode: data.bookingCode.toUpperCase().trim(),
    bookmaker: data.bookmaker.trim(),
    odds: data.odds ?? null,
    confidence: data.confidence ?? null,
    note: data.note || null,
    status: data.status as any,
  };
  if (file && file.size > 0) {
    const existing = await prisma.tip.findUnique({ where: { id } });
    const { url, key } = await uploadSlipImage(file);
    update.imageUrl = url;
    update.storageKey = key;
    if (existing?.storageKey) await deleteSlipImage(existing.storageKey);
  }
  await prisma.tip.update({ where: { id }, data: update });
  await createNotification({
    type: "TIP_UPDATED",
    title: `Tip updated — ${data.bookingCode.toUpperCase()}`,
    body: `${data.bookmaker} · ${data.status}`,
    link: `/tips/${id}`,
    bookingCode: data.bookingCode.toUpperCase().trim(),
    bookmaker: data.bookmaker.trim(),
    targetId: id,
  });
  revalidatePath("/");
  revalidatePath("/tips");
  revalidatePath(`/tips/${id}`);
}

export async function deleteTipAction(id: string): Promise<void> {
  await requireAdmin();
  const tip = await prisma.tip.findUnique({ where: { id } });
  await prisma.tip.delete({ where: { id } });
  if (tip?.storageKey) await deleteSlipImage(tip.storageKey);
  revalidatePath("/");
  revalidatePath("/tips");
}

export async function updateTipStatusAction(id: string, status: string): Promise<void> {
  await requireAdmin();
  const tip = await prisma.tip.update({ where: { id }, data: { status: status as any } });
  const t = status as string;
  if (t === "WON" || t === "LOST") {
    await createNotification({
      type: t === "WON" ? "TIP_WON" : "TIP_LOST",
      title: `Tip ${t.toLowerCase()} — ${tip.bookingCode}`,
      body: `${tip.bookmaker} · ${tip.odds ? `Odds ${tip.odds}` : ""}`.trim(),
      link: `/tips/${id}`,
      bookingCode: tip.bookingCode,
      bookmaker: tip.bookmaker,
      imageUrl: tip.imageUrl,
      targetId: id,
    });
  } else {
    await createNotification({
      type: "TIP_UPDATED",
      title: `Tip ${t.toLowerCase()} — ${tip.bookingCode}`,
      body: `${tip.bookmaker}`,
      link: `/tips/${id}`,
      bookingCode: tip.bookingCode,
      bookmaker: tip.bookmaker,
      targetId: id,
    });
  }
  revalidatePath("/");
  revalidatePath("/results");
  revalidatePath(`/tips/${id}`);
}

// Submissions — simple public (guestName + IP limit)
const anonTimestamps: Map<string, number[]> = new Map();

export async function createSubmissionAction(formData: FormData): Promise<void> {
  // honeypot
  if ((formData.get("website") as string)?.trim()) throw new Error("Invalid submission");
  const { headers } = await import("next/headers");
  const h = await headers();
  const rawIp = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "anon";
  const ipHash = rawIp.slice(0, 64);
  const now = Date.now();
  const arr = anonTimestamps.get(ipHash) || [];
  const recent = arr.filter((t) => now - t < 3600000);
  if (recent.length >= 5) throw new Error("Rate limited: max 5 submissions per hour per IP");
  recent.push(now);
  anonTimestamps.set(ipHash, recent);

  const data = tipSchema.parse({
    bookingCode: formData.get("bookingCode"),
    bookmaker: formData.get("bookmaker"),
    odds: formData.get("odds") || null,
    confidence: formData.get("confidence") || null,
    note: formData.get("note") || null,
  });
  const guestName = (formData.get("guestName") as string)?.trim().slice(0, 80) || null;
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) throw new Error("Slip screenshot is required");
  const { url, key } = await uploadSlipImage(file);
  const sub = await prisma.submission.create({
    data: {
      imageUrl: url,
      storageKey: key,
      bookingCode: data.bookingCode.toUpperCase().trim(),
      bookmaker: data.bookmaker.trim(),
      odds: data.odds ?? null,
      confidence: data.confidence ?? null,
      note: data.note || null,
      submittedById: null,
      guestName,
      ipHash,
      source: "member",
    },
  });
  await createNotification({
    type: "SUBMISSION_NEW",
    title: `New submission — ${data.bookingCode.toUpperCase()}`,
    body: `${guestName ? `${guestName} · ` : ""}${data.bookmaker} · ${data.odds ? `Odds ${data.odds} · ` : ""}${data.note ? data.note.slice(0, 80) : "Awaiting review"}`,
    link: "/admin/submissions",
    bookingCode: data.bookingCode.toUpperCase().trim(),
    bookmaker: data.bookmaker.trim(),
    imageUrl: url,
    targetId: sub.id,
  });
  revalidatePath("/admin/submissions");
}

export const createPublicSubmissionAction = createSubmissionAction;

export async function approveSubmissionAction(id: string): Promise<void> {
  const session = await requireAdmin();
  const reviewerId = (session.user as any).id;
  // verify reviewer exists before FK — prevents Submission_reviewedById_fkey
  const reviewer = await prisma.user.findUnique({ where: { id: reviewerId } });
  if (!reviewer) throw new Error(`Reviewer not found in DB (${reviewerId}). Run: npx prisma migrate deploy && npm run seed`);
  const sub = await prisma.submission.findUnique({ where: { id } });
  if (!sub) throw new Error("Not found");
  if (sub.status !== "PENDING") throw new Error("Already reviewed");
  let newTipId: string | null = null;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.submission.update({ where: { id }, data: { status: "APPROVED", reviewedById: reviewerId, reviewedAt: new Date() } });
      const tip = await tx.tip.create({
        data: {
          imageUrl: sub.imageUrl,
          storageKey: sub.storageKey,
          bookingCode: sub.bookingCode,
          bookmaker: sub.bookmaker,
          odds: sub.odds,
          confidence: sub.confidence,
          note: sub.note,
          status: "PENDING",
          createdById: sub.submittedById ?? reviewerId,
        },
      });
      newTipId = tip.id;
      await tx.activityLog.create({ data: { userId: reviewerId, action: "TIP_APPROVED", targetType: "Submission", targetId: id } });
    });
  } catch (e: any) {
    if (e?.code === "P2003" || String(e?.message || "").includes("Foreign key")) {
      throw new Error(`FK violated — reviewer ${reviewerId} missing. ${e.message}`);
    }
    throw e;
  }
  await createNotification({
    type: "SUBMISSION_APPROVED",
    title: `Submission approved — ${sub.bookingCode}`,
    body: `${sub.bookmaker} · published as tip${sub.guestName ? ` · by ${sub.guestName}` : ""}`,
    link: newTipId ? `/tips/${newTipId}` : "/tips",
    bookingCode: sub.bookingCode,
    bookmaker: sub.bookmaker,
    imageUrl: sub.imageUrl,
    targetId: id,
  });
  revalidatePath("/");
  revalidatePath("/tips");
  revalidatePath("/admin/submissions");
}

export async function rejectSubmissionAction(id: string): Promise<void> {
  const session = await requireAdmin();
  const reviewerId = (session.user as any).id;
  const reviewer = await prisma.user.findUnique({ where: { id: reviewerId } });
  if (!reviewer) throw new Error(`Reviewer not found in DB (${reviewerId})`);
  const sub = await prisma.submission.findUnique({ where: { id } });
  try {
    await prisma.submission.update({ where: { id }, data: { status: "REJECTED", reviewedById: reviewerId, reviewedAt: new Date() } });
  } catch (e: any) {
    if (e?.code === "P2003") throw new Error(`FK violated — reviewer ${reviewerId} missing. ${e.message}`);
    throw e;
  }
  if (sub) {
    await createNotification({
      type: "SUBMISSION_REJECTED",
      title: `Submission rejected — ${sub.bookingCode}`,
      body: `${sub.bookmaker}${sub.guestName ? ` · by ${sub.guestName}` : ""} · not published`,
      link: "/admin/submissions",
      bookingCode: sub.bookingCode,
      bookmaker: sub.bookmaker,
      imageUrl: sub.imageUrl,
      targetId: id,
    });
  }
  revalidatePath("/admin/submissions");
}

export async function toggleContributorAction(id: string): Promise<void> {
  await requireAdmin();
  const u = await prisma.user.findUnique({ where: { id } });
  if (!u) throw new Error("Not found");
  await prisma.user.update({ where: { id }, data: { isActive: !u.isActive } });
  revalidatePath("/admin/contributors");
}
