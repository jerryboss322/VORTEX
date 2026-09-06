import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

const ALLOWED_MIME = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_BYTES = 10 * 1024 * 1024;

function getS3Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKey = process.env.R2_ACCESS_KEY_ID;
  const secretKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKey || !secretKey || accountId === "local") return null;
  const endpoint = process.env.R2_ENDPOINT || `https://${accountId}.r2.cloudflarestorage.com`;
  return new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
  });
}

export function validateImage(file: File) {
  if (!ALLOWED_MIME.has(file.type)) throw new Error("Invalid file type. Allowed: JPEG, PNG, WEBP");
  if (file.size > MAX_BYTES) throw new Error("File too large. Max 10MB");
  const ext = "." + (file.name.split(".").pop()?.toLowerCase() || "");
  if (!ALLOWED_EXT.has(ext) && !ALLOWED_MIME.has(file.type)) throw new Error("Invalid extension");
}

export async function uploadSlipImage(file: File): Promise<{ url: string; key: string }> {
  validateImage(file);
  const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
  const key = `slips/${new Date().getFullYear()}/${nanoid(12)}.${ext}`;
  const bucket = process.env.R2_BUCKET_NAME || "tipshub";
  const publicUrl = process.env.R2_PUBLIC_URL || "";

  const s3 = getS3Client();
  const buffer = Buffer.from(await file.arrayBuffer());

  // Quick magic bytes check
  const header = buffer.subarray(0, 4).toString("hex");
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
  const isPng = header.startsWith("89504e47");
  const isWebp = buffer.subarray(8, 12).toString() === "WEBP";
  if (!isJpeg && !isPng && !isWebp) throw new Error("File signature does not match image type");

  if (!s3) {
    // Local dev fallback: store under public/uploads and return local url
    // We write via filesystem in server action wrapper instead
    // Here we just return a placeholder key; caller handles local write
    return { url: `/uploads/${key}`, key };
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  const url = publicUrl ? `${publicUrl.replace(/\/$/, "")}/${key}` : `/${key}`;
  return { url, key };
}

export async function deleteSlipImage(key: string) {
  if (!key) return;
  const s3 = getS3Client();
  if (!s3) return;
  const bucket = process.env.R2_BUCKET_NAME || "tipshub";
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  } catch {
    // ignore
  }
}

export function isR2Configured() {
  return !!getS3Client();
}
