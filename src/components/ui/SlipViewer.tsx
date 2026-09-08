"use client";
import { useState } from "react";

export function SlipViewer({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="block w-full overflow-hidden bg-[#0E1013]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="h-auto w-full object-contain max-h-[380px]" loading="lazy" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="relative max-h-[90vh] max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-2 -right-2 rounded-full bg-[var(--th-text)] px-3 py-1.5 text-[12px] font-[500] text-[#0E1013]"
              aria-label="Close"
            >
              ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="w-full h-auto max-h-[90vh] object-contain rounded-[14px] bg-black" />
          </div>
        </div>
      )}
    </>
  );
}
