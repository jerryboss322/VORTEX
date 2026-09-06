import { cookies } from "next/headers";

const PIN_COOKIE = "admin_pin_ok";
const ADMIN_PIN = process.env.ADMIN_PIN || "1740";

export async function isAdminPinOk(): Promise<boolean> {
  const c = await cookies();
  return c.get(PIN_COOKIE)?.value === "1";
}

export async function verifyPin(pin: string): Promise<boolean> {
  return pin === ADMIN_PIN;
}

export async function setPinCookie() {
  const c = await cookies();
  c.set(PIN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  });
}

export async function clearPinCookie() {
  const c = await cookies();
  c.delete(PIN_COOKIE);
}

export const PIN_COOKIE_NAME = PIN_COOKIE;
