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
          <div key={t.id} className="rounded-full border border-[var(--th-border)] bg-[var(--th-surface)] px-4 py-2.5 text-[13px] font-[500] text-[var(--th-text)]">
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
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("tipshub-toast", { detail: msg }));
}
