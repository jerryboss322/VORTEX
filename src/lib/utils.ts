import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  // lightweight clsx without tailwind-merge to avoid extra dep; clsx already handles conditionals
  return clsx(inputs);
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function bookingCodeDisplay(code: string) {
  return code.trim().toUpperCase();
}
