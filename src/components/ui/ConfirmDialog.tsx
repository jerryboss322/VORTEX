"use client";
import { useState } from "react";

export function ConfirmDialog({ title, description, confirmLabel = "Delete", onConfirm, children }: { title: string; description?: string; confirmLabel?: string; onConfirm: () => void | Promise<void>; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm rounded-[14px] border border-[var(--th-border)] bg-[var(--th-surface)] p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[14px] font-[500] text-[var(--th-text)]">{title}</h3>
            {description && <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--th-sub)]">{description}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-[var(--th-border)] px-4 py-2 text-[12px] font-[500] text-[var(--th-sub)] hover:text-[var(--th-text)] hover:border-[var(--th-text)]/15">
                Cancel
              </button>
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
                className="rounded-full bg-[var(--th-red)] px-4 py-2 text-[12px] font-[600] text-white hover:bg-[#b96a62] disabled:opacity-50"
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
