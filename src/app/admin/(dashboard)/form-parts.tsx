"use client";

import { useId, useState } from "react";
import Image from "next/image";

/**
 * Form primitives shared by the product and article editors.
 *
 * Every control is a real label bound to a real input via id — the CMS is
 * where a wrong `htmlFor` actually costs someone time, and hint text is wired
 * through aria-describedby rather than left as decorative small print.
 */

export function Fieldset({
  legend,
  hint,
  children,
}: {
  legend: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl border border-jet-border bg-jet-bg-card p-6">
      <legend className="px-2 text-sm font-semibold uppercase tracking-wider text-jet-primary">
        {legend}
      </legend>
      {hint && <p className="mb-4 text-xs text-jet-text-muted">{hint}</p>}
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  hint?: string;
  required?: boolean;
  type?: string;
  min?: string;
};

export function Field({ label, name, defaultValue, hint, required, type = "text", min }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-jet-text">
        {label}
        {required && <span className="ml-1 text-jet-primary">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        min={min}
        required={required}
        defaultValue={defaultValue ?? ""}
        aria-describedby={hint ? hintId : undefined}
        className="w-full rounded-xl border border-jet-border px-4 py-2.5 text-sm focus:border-jet-primary focus:outline-none focus:ring-2 focus:ring-jet-primary/20"
      />
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-jet-text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-jet-text">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-jet-border text-jet-primary focus:ring-jet-primary"
      />
      {label}
    </label>
  );
}

export function TextareaField({
  label,
  name,
  defaultValue,
  hint,
  rows = 4,
  required,
  mono,
}: FieldProps & { rows?: number; mono?: boolean }) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-jet-text">
        {label}
        {required && <span className="ml-1 text-jet-primary">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue ?? ""}
        aria-describedby={hint ? hintId : undefined}
        className={`w-full rounded-xl border border-jet-border px-4 py-2.5 text-sm focus:border-jet-primary focus:outline-none focus:ring-2 focus:ring-jet-primary/20 ${
          mono ? "font-mono text-[13px] leading-relaxed" : ""
        }`}
      />
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-jet-text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export function SubmitBar({
  pending,
  error,
  submitLabel,
  icon,
}: {
  pending: boolean;
  error: string | null;
  submitLabel: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="sticky bottom-0 -mx-4 border-t border-jet-border bg-jet-bg-card/90 px-4 py-4 backdrop-blur-lg sm:mx-0 sm:rounded-2xl sm:border sm:px-6">
      {error && (
        <p role="alert" className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-xl bg-jet-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-jet-primary-dim disabled:opacity-60"
      >
        {icon}
        {pending ? "Saving…" : submitLabel}
      </button>
    </div>
  );
}

/** Longest edge of a stored picture. Nothing on the site renders larger. */
const MAX_EDGE = 2000;

/**
 * Re-encode a picture to WebP before uploading it.
 *
 * A canvas does this on the editor's machine, so a multi-MB photo off a
 * phone leaves as a few hundred KB and never crosses the connection at full
 * size. If anything here fails — an animated GIF, a browser without WebP
 * encoding — the original file is uploaded untouched, which still works.
 */
async function toWebp(file: File): Promise<File> {
  if (file.type === "image/gif") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.82)
    );
    if (!blob || blob.type !== "image/webp") return file;

    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", await toWebp(file));
  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const result = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !result.url) throw new Error(result.error ?? "Upload failed.");
  return result.url;
}

/** A URL box you can also drop a file into — pasting an existing path still works. */
export function ImageField({ label, name, defaultValue, hint }: FieldProps) {
  const id = useId();
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setBusy(true);
    setError("");
    try {
      setUrl(await uploadImage(file));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-jet-text">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          id={id}
          name={name}
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="/products/example.webp or https://…"
          className="w-full rounded-xl border border-jet-border px-4 py-2.5 text-sm focus:border-jet-primary focus:outline-none focus:ring-2 focus:ring-jet-primary/20"
        />
        {url && (
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-jet-border bg-jet-bg-elevated">
            <Image src={url} alt="" fill sizes="44px" className="object-cover" unoptimized />
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <label className="cursor-pointer rounded-full border border-jet-border px-3 py-1 text-xs text-jet-text-muted hover:text-jet-primary">
          {busy ? "Uploading…" : "Upload a picture"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />
        </label>
        {hint && <p className="text-xs text-jet-text-muted">{hint}</p>}
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/** Same idea as ImageField, but for a one-path-per-line gallery textarea — an upload appends a line. */
export function ImageListField({ label, name, defaultValue, hint, rows = 3 }: FieldProps & { rows?: number }) {
  const id = useId();
  const [value, setValue] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setBusy(true);
    setError("");
    try {
      const url = await uploadImage(file);
      setValue((prev) => (prev.trim() ? `${prev.replace(/\n+$/, "")}\n${url}` : url));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-jet-text">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border border-jet-border px-4 py-2.5 text-sm focus:border-jet-primary focus:outline-none focus:ring-2 focus:ring-jet-primary/20"
      />
      <div className="mt-2 flex items-center gap-3">
        <label className="cursor-pointer rounded-full border border-jet-border px-3 py-1 text-xs text-jet-text-muted hover:text-jet-primary">
          {busy ? "Uploading…" : "Upload a picture"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />
        </label>
        {hint && <p className="text-xs text-jet-text-muted">{hint}</p>}
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
