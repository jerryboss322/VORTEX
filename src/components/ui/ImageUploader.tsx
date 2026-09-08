"use client";
import { useRef, useState, useCallback } from "react";

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
      // set hidden input file list via DataTransfer
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
      <div
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
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed bg-[var(--th-chip)] p-4 text-center transition-colors ${height} ${dragOver ? "border-[var(--th-gold)] bg-[var(--th-gold)]/5" : "border-[var(--th-border)] hover:border-[var(--th-text)]/20"} ${error ? "border-[var(--th-red)]/50" : ""}`}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="max-h-40 w-auto rounded object-contain" />
            {file && <span className="mt-2 text-[12px] text-[var(--th-sub)]">{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</span>}
            {!file && initialUrl && <span className="mt-2 text-[12px] text-[var(--th-sub)]">Current image — click or drop to replace</span>}
          </>
        ) : (
          <>
            <span className="text-[13px] font-[500] text-[var(--th-text)]">Drop slip here or click to browse</span>
            <span className="mt-1 text-[12px] text-[var(--th-sub)]">JPEG, PNG, WEBP · Max 10MB</span>
          </>
        )}
        <input ref={inputRef} name={name} type="file" accept="image/jpeg,image/png,image/webp" required={required && !preview} className="hidden" onChange={(e) => set(e.target.files?.[0] || null)} />
      </div>
      {preview && (
        <button type="button" onClick={() => set(null)} className="mt-2 text-[12px] text-[var(--th-sub)] hover:text-[var(--th-text)] underline">
          {file ? "Remove selection" : "Clear"}
        </button>
      )}
      {error && <p className="mt-2 text-[12px] text-[var(--th-red)]" role="alert">{error}</p>}
      {!error && <p className="mt-2 text-[11px] text-[var(--th-sub)]">Tip: crop tightly, keep text sharp.</p>}
    </div>
  );
}
