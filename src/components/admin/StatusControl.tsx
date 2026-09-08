"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { AnimatePresence, m } from "motion/react";
import { updateTipStatusAction } from "@/lib/actions";
import { spring, playfulSpring } from "@/lib/motion";
import { RollingSpinner } from "@/components/ui/Skeleton";

const OPTIONS = [
  { value: "PENDING", label: "Pending", dot: "bg-[var(--th-gold)]" },
  { value: "WON", label: "Won", dot: "bg-[var(--th-green)]" },
  { value: "LOST", label: "Lost", dot: "bg-[var(--th-red)]" },
  { value: "CANCELLED", label: "Cancelled", dot: "bg-[var(--th-sub)]" },
] as const;

function dotFor(v: string) {
  return OPTIONS.find((o) => o.value === v)?.dot || "bg-[var(--th-sub)]";
}
function labelFor(v: string) {
  return OPTIONS.find((o) => o.value === v)?.label || v;
}

export function StatusControl({ id, status }: { id: string; status: string }) {
  const [current, setCurrent] = useState(status);
  const [pendingValue, setPendingValue] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, start] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  const dirty = pendingValue !== null && pendingValue !== current;
  const display = dirty ? pendingValue! : current;

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function pick(v: string) {
    setPendingValue(v);
    setOpen(false);
  }

  function save() {
    if (!pendingValue) return;
    const v = pendingValue;
    start(async () => {
      try {
        await updateTipStatusAction(id, v);
        setCurrent(v);
        setPendingValue(null);
      } catch (e: any) {
        alert(e?.message || "Failed to update status.");
      }
    });
  }

  return (
    <div ref={ref} className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-3 py-1.5 text-[12px] font-[400] text-[var(--th-sub)] hover:border-[var(--th-text)]/15 hover:text-[var(--th-text)]"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dotFor(display)}`} aria-hidden />
        {labelFor(display)}
        <m.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          className="ml-0.5"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </m.svg>
      </button>

      <AnimatePresence>
        {dirty && (
          <m.button
            key="save"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={playfulSpring}
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--th-gold)] px-3.5 py-1.5 text-[12px] font-[500] tracking-[0.02em] text-[#3A2E14] hover:bg-[#b98f45] disabled:opacity-50"
          >
            {saving && <RollingSpinner size={11} className="text-[#3A2E14]" />}
            {saving ? "Saving…" : "Save"}
          </m.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={spring}
            style={{ originX: 0, originY: 0 }}
            className="absolute left-0 top-[calc(100%+8px)] z-20 min-w-[160px] overflow-hidden rounded-[12px] border border-[var(--th-border)] bg-[var(--th-surface)] py-1 shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
          >
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => pick(opt.value)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[13px] hover:bg-[var(--th-chip)]"
              >
                <span className="inline-flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${opt.dot}`} aria-hidden />
                  <span className={display === opt.value ? "text-[var(--th-text)] font-[500]" : "text-[var(--th-sub)]"}>{opt.label}</span>
                </span>
                {display === opt.value && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="text-[var(--th-gold)]">
                    <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
