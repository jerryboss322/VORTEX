"use client";
import { useRef, useState, useCallback } from "react";
import { AnimatePresence, m } from "motion/react";
import { spring } from "@/lib/motion";

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;

type Props = {
  name?: string;
  required?: boolean;
  initialUrl?: string | null;
  variant?: "hero" | "compact";
  onFileChange?: (file: File | null) => void;
};

export function ImageUploader({ name = "image", required, initialUrl, variant = "hero", onFileChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const validate = useCallback((f: File): string | null => {
    if (!ALLOWED.includes(f.type)) return "Invalid type — use JPEG, PNG, or WEBP.";
    if (f.size > MAX_BYTES) return "File too large — max 10MB.";
    return null;
  }, []);

  const set = useCallback(
    (f: File | null) => {
      if (!f) {
        setFile(null);
        if (!initialUrl) setPreview(null);
        else setPreview(initialUrl);
        setError(null);
        onFileChange?.(null);
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
      const err = validate(f);
      if (err) {
        setError(err);
        return;
      }
      setError(null);
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreview(url);
      onFileChange?.(f);
      if (inputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(f);
        inputRef.current.files = dt.files;
      }
    },
    [validate, onFileChange, initialUrl]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) set(f);
    },
    [set]
  );

  const height = variant === "hero" ? "min-h-[180px]" : "min-h-[120px]";

  return (
    <div>
      <m.div
        role="button"
        tabIndex={0}
        aria-label="Upload slip image"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        animate={{
          borderColor: error ? "rgba(201,125,116,0.5)" : dragOver ? "var(--th-gold)" : "rgba(255,255,255,0.08)",
          backgroundColor: dragOver ? "rgba(201,161,90,0.06)" : "rgba(255,255,255,0.05)",
        }}
        transition={{ duration: 0.18 }}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed p-4 text-center ${height}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {preview ? (
            <m.div key="preview" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={spring} className="flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="max-h-40 w-auto rounded object-contain" />
              {file && <span className="mt-2 text-[12px] text-[var(--th-sub)]">{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</span>}
              {!file && initialUrl && <span className="mt-2 text-[12px] text-[var(--th-sub)]">Current image — click or drop to replace</span>}
            </m.div>
          ) : (
            <m.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="flex flex-col items-center">
              <span className="text-[13px] font-[500] text-[var(--th-text)]">Drop slip here or click to browse</span>
              <span className="mt-1 text-[12px] text-[var(--th-sub)]">JPEG, PNG, WEBP · Max 10MB</span>
            </m.div>
          )}
        </AnimatePresence>
        <input ref={inputRef} name={name} type="file" accept="image/jpeg,image/png,image/webp" required={required && !preview} className="hidden" onChange={(e) => set(e.target.files?.[0] || null)} />
      </m.div>
      <AnimatePresence>
        {preview && (
          <m.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} type="button" onClick={() => set(null)} className="mt-2 text-[12px] text-[var(--th-sub)] hover:text-[var(--th-text)] underline">
            {file ? "Remove selection" : "Clear"}
          </m.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {error && (
          <m.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }} className="mt-2 text-[12px] text-[var(--th-red)]" role="alert">
            {error}
          </m.p>
        )}
      </AnimatePresence>
      {!error && <p className="mt-2 text-[11px] text-[var(--th-sub)]">Tip: crop tightly, keep text sharp.</p>}
    </div>
  );
}
