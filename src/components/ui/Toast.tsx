"use client";
import { createContext, useContext, useState, useCallback } from "react";

type Toast = { id: number; message: string };
const Ctx = createContext<{ toast: (m: string) => void } | null>(null);

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2500);
  }, []);
  return (
    <Ctx.Provider value={{ toast }}>
      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black shadow-lg border">
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) return { toast: (_: string) => {} };
  return ctx;
}

export function showToast(msg: string) {
  // fallback for server actions via custom event
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("tipshub-toast", { detail: msg }));
}
