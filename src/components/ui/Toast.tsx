"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, m } from "motion/react";
import { spring } from "@/lib/motion";

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
        <AnimatePresence>
          {toasts.map((t) => (
            <m.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92, y: 4 }}
              transition={spring}
              className="rounded-full border border-[var(--th-border)] bg-[var(--th-surface)] px-4 py-2.5 text-[13px] font-[500] text-[var(--th-text)]"
            >
              {t.message}
            </m.div>
          ))}
        </AnimatePresence>
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
