"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { AnimatePresence, m } from "motion/react";
import { spring } from "@/lib/motion";

type GameRow = {
  id: string;
  bookingCode: string;
  bookmaker: string;
  odds: string;
  confidence: string;
  note: string;
  status: string;
  file: File | null;
};

function PublishBatchButton({ count }: { count: number }) {
  const { pending } = useFormStatus();
  return (
    <m.button whileTap={{ scale: 0.97 }} transition={spring} disabled={pending} className="rounded-full bg-[var(--th-text)] px-6 py-2.5 text-[12px] font-[600] tracking-[0.02em] text-[#0E1013] hover:bg-[#ddd8cf] disabled:opacity-50">
      {pending ? `Publishing ${count}…` : count === 1 ? "Publish Tip" : `Publish ${count} Tips`}
    </m.button>
  );
}

function RowUploader({ name, onFile, required }: { name: string; onFile: (f: File | null) => void; required?: boolean }) {
  return <ImageUploader name={name} required={required} variant="compact" onFileChange={onFile} />;
}

export function AdminBatchTipForm({ action }: { action: (fd: FormData) => Promise<void> }) {
  const [rows, setRows] = useState<GameRow[]>([
    { id: "0", bookingCode: "", bookmaker: "", odds: "", confidence: "", note: "", status: "PENDING", file: null },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const addRow = () => {
    if (rows.length >= 10) return;
    setRows((r) => [...r, { id: String(Date.now() + Math.random()), bookingCode: "", bookmaker: "", odds: "", confidence: "", note: "", status: "PENDING", file: null }]);
  };
  const removeRow = (id: string) => {
    if (rows.length === 1) return;
    setRows((r) => r.filter((x) => x.id !== id));
  };
  const updateRow = (id: string, patch: Partial<GameRow>) => setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  async function handle(formData: FormData) {
    setError(null);
    setSuccess(null);
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.file) {
        setError(`Game ${i + 1}: slip image is required.`);
        return;
      }
      if (!r.bookingCode.trim() || r.bookingCode.trim().length < 2) {
        setError(`Game ${i + 1}: booking code required.`);
        return;
      }
      if (!r.bookmaker.trim() || r.bookmaker.trim().length < 2) {
        setError(`Game ${i + 1}: bookmaker required.`);
        return;
      }
    }
    const fd = new FormData();
    fd.set("count", String(rows.length));
    rows.forEach((r, i) => {
      if (r.file) fd.set(`image_${i}`, r.file);
      fd.set(`bookingCode_${i}`, r.bookingCode);
      fd.set(`bookmaker_${i}`, r.bookmaker);
      fd.set(`odds_${i}`, r.odds);
      fd.set(`confidence_${i}`, r.confidence);
      fd.set(`note_${i}`, r.note);
      fd.set(`status_${i}`, r.status);
    });
    try {
      await action(fd);
      setSuccess(`Published ${rows.length} tip${rows.length > 1 ? "s" : ""} — visible on homepage.`);
      setRows([{ id: String(Date.now()), bookingCode: "", bookmaker: "", odds: "", confidence: "", note: "", status: "PENDING", file: null }]);
    } catch (e: any) {
      setError(e?.message || "Failed — please try again.");
    }
  }

  return (
    <form action={handle} className="space-y-4 rounded-[14px] border border-[var(--th-border)] bg-[var(--th-bg)]/40 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-[14px] font-[500] tracking-[-0.01em] text-[var(--th-text)]">Publish Batch — 1 to 10 independent slips</h3>
          <p className="mt-1 text-[12px] leading-relaxed text-[var(--th-sub)]">Each row is an independent tip with its own image + booking code + Won/Lost tracking.</p>
        </div>
        <span className="shrink-0 rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-3 py-1 text-[12px] font-mono text-[var(--th-sub)]">{rows.length}/10</span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {error && (
          <m.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={spring} className="rounded-[12px] border border-[var(--th-red)]/20 bg-[var(--th-red)]/10 px-3 py-2 text-[13px] text-[var(--th-red)]" role="alert">
            {error}
          </m.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        {success && (
          <m.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring} className="rounded-[12px] border border-[var(--th-green)]/20 bg-[var(--th-green)]/10 px-3 py-2 text-[13px] text-[var(--th-green)]">
            {success}
          </m.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {rows.map((row, idx) => (
            <m.div
              key={row.id}
              layout="position"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={spring}
              className="rounded-[14px] border border-[var(--th-border)] bg-[var(--th-surface)] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">Game {idx + 1}</div>
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${row.status === "WON" ? "bg-[var(--th-green)]" : row.status === "LOST" ? "bg-[var(--th-red)]" : "bg-[var(--th-gold)]"}`} />
                  <select
                    value={row.status}
                    onChange={(e) => updateRow(row.id, { status: e.target.value })}
                    className="rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-3 py-1.5 text-[12px] text-[var(--th-text)] outline-none"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="WON">Won</option>
                    <option value="LOST">Lost</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  {rows.length > 1 && (
                    <button type="button" onClick={() => removeRow(row.id)} className="rounded-full border border-[var(--th-border)] px-3 py-1.5 text-[12px] text-[var(--th-sub)] hover:text-[var(--th-text)] hover:border-[var(--th-text)]/15">
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3 grid gap-4 lg:grid-cols-[1.1fr_1.9fr]">
                <div>
                  <label className="text-[11px] font-[400] tracking-[0.08em] uppercase text-[var(--th-sub)]">Slip *</label>
                  <div className="mt-2">
                    <RowUploader name={`image_${idx}`} onFile={(f) => updateRow(row.id, { file: f })} required />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[12px] font-[400] text-[var(--th-sub)]">Booking Code *</label>
                      <input
                        value={row.bookingCode}
                        onChange={(e) => updateRow(row.id, { bookingCode: e.target.value })}
                        placeholder="ABC123XYZ"
                        className="mt-1.5 w-full rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2.5 text-[13px] font-mono uppercase outline-none focus:border-[var(--th-text)]/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[12px] font-[400] text-[var(--th-sub)]">Bookmaker *</label>
                      <input
                        value={row.bookmaker}
                        onChange={(e) => updateRow(row.id, { bookmaker: e.target.value })}
                        list="bookmakers-batch"
                        placeholder="Bet9ja"
                        className="mt-1.5 w-full rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2.5 text-[13px] outline-none focus:border-[var(--th-text)]/20"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[12px] font-[400] text-[var(--th-sub)]">Odds</label>
                      <input
                        value={row.odds}
                        onChange={(e) => updateRow(row.id, { odds: e.target.value })}
                        type="number"
                        step="0.01"
                        min="1"
                        placeholder="18.40"
                        className="mt-1.5 w-full rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2.5 text-[13px] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] font-[400] text-[var(--th-sub)]">Confidence %</label>
                      <input
                        value={row.confidence}
                        onChange={(e) => updateRow(row.id, { confidence: e.target.value })}
                        type="number"
                        min="0"
                        max="100"
                        placeholder="87"
                        className="mt-1.5 w-full rounded-full border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2.5 text-[13px] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[12px] font-[400] text-[var(--th-sub)]">Note <span className="opacity-70">— optional, 500 max</span></label>
                    <textarea
                      value={row.note}
                      onChange={(e) => updateRow(row.id, { note: e.target.value })}
                      rows={2}
                      maxLength={500}
                      placeholder="Optional note…"
                      className="mt-1.5 w-full rounded-[14px] border border-[var(--th-border)] bg-[var(--th-chip)] px-4 py-2.5 text-[13px] outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </m.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <m.button whileTap={{ scale: 0.97 }} transition={spring} type="button" onClick={addRow} disabled={rows.length >= 10} className="rounded-full border border-[var(--th-border)] bg-transparent px-4 py-2 text-[12px] font-[500] text-[var(--th-text)] hover:bg-[var(--th-chip)] disabled:opacity-40">
          + Add Game {rows.length >= 10 ? "(max 10)" : `(${rows.length}/10)`}
        </m.button>
        <div className="flex items-center gap-3 ml-auto">
          <span className="hidden sm:inline text-[12px] text-[var(--th-sub)]">Each row publishes as independent tip</span>
          <PublishBatchButton count={rows.length} />
        </div>
      </div>

      <datalist id="bookmakers-batch">
        <option value="Bet9ja" />
        <option value="SportyBet" />
        <option value="1xBet" />
        <option value="Betway" />
        <option value="Melbet" />
        <option value="22Bet" />
      </datalist>
    </form>
  );
}
