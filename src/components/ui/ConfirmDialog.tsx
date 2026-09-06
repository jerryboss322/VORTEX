"use client";
import { useState } from "react";

export function ConfirmDialog({ title, description, confirmLabel = "Delete", onConfirm, children }: { title: string; description?: string; confirmLabel?: string; onConfirm: () => void | Promise<void>; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm rounded-lg border border-[#262626] bg-[#141414] p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold">{title}</h3>
            {description && <p className="mt-1 text-sm text-zinc-400">{description}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-[#262626] px-4 py-2 text-sm">Cancel</button>
              <button
                type="button"
                disabled={pending}
                onClick={async () => {
                  setPending(true);
                  try {
                    await onConfirm();
                    setOpen(false);
                  } finally {
                    setPending(false);
                  }
                }}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {pending ? "Deleting…" : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
