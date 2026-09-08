"use client";
import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { spring } from "@/lib/motion";

export function SlipViewer({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="block w-full overflow-hidden bg-[#0E1013]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="h-auto w-full object-contain max-h-[420px]" loading="lazy" decoding="async" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
      </button>
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <m.div
              initial={{ scale: 0.96, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: 6, opacity: 0 }}
              transition={spring}
              className="relative max-h-[90vh] max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute -top-2 -right-2 rounded-full bg-[var(--th-text)] px-3 py-1.5 text-[12px] font-[500] text-[#0E1013]"
                aria-label="Close"
              >
                ✕
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} className="w-full h-auto max-h-[90vh] object-contain rounded-[14px] bg-black" decoding="async" />
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
