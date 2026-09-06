"use server";
import { prisma } from "@/lib/db";
import { tipSchema, userCreateSchema } from "@/lib/validations";
import { requireAdmin, requireContributor } from "@/lib/permissions";
import { uploadSlipImage, deleteSlipImage } from "@/lib/storage";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import fs from "node:fs/promises";
import path from "node:path";

async function saveLocalFallback(file: File, key: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const full = path.join(process.cwd(), "public", key);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, buffer);
  return `/${key}`;
}

export async function createTipAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const userId = (session.user as any).id;
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
  // Try R2
  try {
    const { url, key } = await uploadSlipImage(file);
    storageKey = key;
    if (url.startsWith("/uploads/")) {
      imageUrl = await saveLocalFallback(file, url.slice(1));
    } else {
      imageUrl = url;
    }
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
    let imageUrl = url;
    if (url.startsWith("/uploads/")) imageUrl = await saveLocalFallback(file, url.slice(1));
    update.imageUrl = imageUrl;
    update.storageKey = key;
    if (existing?.storageKey) await deleteSlipImage(existing.storageKey);
  }
  await prisma.tip.update({ where: { id }, data: update });
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
  await prisma.tip.update({ where: { id }, data: { status: status as any } });
  revalidatePath("/");
  revalidatePath("/results");
  revalidatePath(`/tips/${id}`);
}

// Submissions
const submitTimestamps: Map<string, number[]> = new Map();

export async function createSubmissionAction(formData: FormData): Promise<void> {
  const session = await requireContributor();
  const userId = (session.user as any).id;
  // rate limit 10/hour
  const now = Date.now();
  const arr = submitTimestamps.get(userId) || [];
  const recent = arr.filter((t) => now - t < 3600000);
  if (recent.length >= 10) throw new Error("Rate limited: max 10 submissions per hour");
  recent.push(now);
  submitTimestamps.set(userId, recent);

  const data = tipSchema.parse({
    bookingCode: formData.get("bookingCode"),
    bookmaker: formData.get("bookmaker"),
    odds: formData.get("odds") || null,
    confidence: formData.get("confidence") || null,
    note: formData.get("note") || null,
  });
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) throw new Error("Slip screenshot is required");
  let imageUrl = "";
  let storageKey = "";
  const { url, key } = await uploadSlipImage(file);
  storageKey = key;
  if (url.startsWith("/uploads/")) imageUrl = await saveLocalFallback(file, url.slice(1));
  else imageUrl = url;

  await prisma.submission.create({
    data: {
      imageUrl,
      storageKey,
      bookingCode: data.bookingCode.toUpperCase().trim(),
      bookmaker: data.bookmaker.trim(),
      odds: data.odds ?? null,
      confidence: data.confidence ?? null,
      note: data.note || null,
      submittedById: userId,
    },
  });
  revalidatePath("/admin/submissions");
}

export async function approveSubmissionAction(id: string): Promise<void> {
  const session = await requireAdmin();
  const reviewerId = (session.user as any).id;
  const sub = await prisma.submission.findUnique({ where: { id } });
  if (!sub) throw new Error("Not found");
  if (sub.status !== "PENDING") throw new Error("Already reviewed");
  await prisma.$transaction(async (tx) => {
    await tx.submission.update({ where: { id }, data: { status: "APPROVED", reviewedById: reviewerId, reviewedAt: new Date() } });
    await tx.tip.create({
      data: {
        imageUrl: sub.imageUrl,
        storageKey: sub.storageKey,
        bookingCode: sub.bookingCode,
        bookmaker: sub.bookmaker,
        odds: sub.odds,
        confidence: sub.confidence,
        note: sub.note,
        status: "PENDING",
        createdById: sub.submittedById,
      },
    });
    await tx.activityLog.create({ data: { userId: reviewerId, action: "TIP_APPROVED", targetType: "Submission", targetId: id } });
  });
  revalidatePath("/");
  revalidatePath("/tips");
  revalidatePath("/admin/submissions");
}

export async function rejectSubmissionAction(id: string): Promise<void> {
  const session = await requireAdmin();
  const reviewerId = (session.user as any).id;
  await prisma.submission.update({ where: { id }, data: { status: "REJECTED", reviewedById: reviewerId, reviewedAt: new Date() } });
  revalidatePath("/admin/submissions");
}

export async function createContributorAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const data = userCreateSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role") || "CONTRIBUTOR",
  });
  const hash = await bcrypt.hash(data.password, 10);
  await prisma.user.create({
    data: { name: data.name, email: data.email.toLowerCase(), passwordHash: hash, role: data.role as any },
  });
  revalidatePath("/admin/contributors");
}

export async function toggleContributorAction(id: string): Promise<void> {
  await requireAdmin();
  const u = await prisma.user.findUnique({ where: { id } });
  if (!u) throw new Error("Not found");
  await prisma.user.update({ where: { id }, data: { isActive: !u.isActive } });
  revalidatePath("/admin/contributors");
}
