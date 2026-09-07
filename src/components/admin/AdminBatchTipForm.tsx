"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageUploader } from "@/components/ui/ImageUploader";

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
    <button disabled={pending} className="rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-zinc-200 disabled:opacity-50">
      {pending ? `Publishing ${count}…` : count === 1 ? "Publish Tip" : `Publish ${count} Tips`}
    </button>
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
    // validate
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
    // Build FormData for server action (count + image_i, bookingCode_i etc)
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
      // reset to one empty row
      setRows([{ id: String(Date.now()), bookingCode: "", bookmaker: "", odds: "", confidence: "", note: "", status: "PENDING", file: null }]);
      // also reset any ImageUploader previews via key change
    } catch (e: any) {
      setError(e?.message || "Failed — please try again.");
    }
  }

  return (
    <form action={handle} className="space-y-4 rounded-xl border border-[#262626] bg-[#141414] p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Publish Batch — 1 to 10 independent slips</h3>
          <p className="text-xs text-zinc-500">Admin only · each row is an independent tip with its own image + booking code + WON/LOST tracking.</p>
        </div>
        <span className="rounded-full bg-[#262626] px-3 py-1 text-xs font-mono text-zinc-300">{rows.length}/10</span>
      </div>

      {error && <div className="rounded-md bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400" role="alert">{error}</div>}
      {success && <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-sm text-emerald-400">{success}</div>}

      <div className="space-y-4">
        {rows.map((row, idx) => (
          <div key={row.id} className="rounded-lg border border-[#262626] bg-[#0f0f0f] p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Game {idx + 1}</div>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${row.status === "WON" ? "bg-emerald-500" : row.status === "LOST" ? "bg-red-500" : "bg-zinc-600"}`} />
                <select
                  value={row.status}
                  onChange={(e) => updateRow(row.id, { status: e.target.value })}
                  className="rounded-md border border-[#262626] bg-[#0a0a0a] px-2 py-1 text-xs outline-none"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="WON">WON</option>
                  <option value="LOST">LOST</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
                {rows.length > 1 && (
                  <button type="button" onClick={() => removeRow(row.id)} className="rounded-md border border-[#262626] px-2 py-1 text-xs text-zinc-400 hover:text-white hover:border-zinc-600">
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="mt-3 grid gap-4 lg:grid-cols-[1.1fr_1.9fr]">
              <div>
                <label className="text-[11px] font-semibold tracking-widest text-zinc-400 uppercase">Slip *</label>
                <div className="mt-2">
                  <RowUploader name={`image_${idx}`} onFile={(f) => updateRow(row.id, { file: f })} required />
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-300">Booking Code *</label>
                    <input
                      value={row.bookingCode}
                      onChange={(e) => updateRow(row.id, { bookingCode: e.target.value })}
                      placeholder="ABC123XYZ"
                      className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-sm font-mono uppercase outline-none focus:border-zinc-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-300">Bookmaker *</label>
                    <input
                      value={row.bookmaker}
                      onChange={(e) => updateRow(row.id, { bookmaker: e.target.value })}
                      list="bookmakers-batch"
                      placeholder="Bet9ja"
                      className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-sm outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-300">Odds</label>
                    <input
                      value={row.odds}
                      onChange={(e) => updateRow(row.id, { odds: e.target.value })}
                      type="number"
                      step="0.01"
                      min="1"
                      placeholder="18.40"
                      className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-300">Confidence %</label>
                    <input
                      value={row.confidence}
                      onChange={(e) => updateRow(row.id, { confidence: e.target.value })}
                      type="number"
                      min="0"
                      max="100"
                      placeholder="87"
                      className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-sm outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-300">Note <span className="text-zinc-500 font-normal">— optional, 500 max</span></label>
                  <textarea
                    value={row.note}
                    onChange={(e) => updateRow(row.id, { note: e.target.value })}
                    rows={2}
                    maxLength={500}
                    placeholder="Optional note…"
                    className="mt-1 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-sm outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={addRow}
          disabled={rows.length >= 10}
          className="rounded-lg border border-[#262626] bg-[#1a1a1a] px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 disabled:opacity-40"
        >
          + Add Game {rows.length >= 10 ? "(max 10)" : `(${rows.length}/10)`}
        </button>
        <div className="flex items-center gap-3 ml-auto">
          <span className="hidden sm:inline text-xs text-zinc-500">Each row publishes as independent tip with its own WON/LOST</span>
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
