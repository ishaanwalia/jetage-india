"use client";

import { useActionState } from "react";
import { Download, Upload, AlertTriangle, Plus, Pencil, Loader2 } from "lucide-react";
import { previewImport, applyImport, type PreviewState } from "./actions";

/**
 * Bulk catalogue editing.
 *
 * Two deliberate frictions, both there because this screen can change every
 * price on the site at once:
 *
 * 1. The upload only ever produces a preview. Applying is a second, separate
 *    press, after the diff is on screen.
 * 2. The diff is per field, not per product. "17 products updated" tells you
 *    nothing; "price: 25227 → 2522" tells you a decimal slipped.
 */

const KIND_STYLE: Record<string, string> = {
  create: "bg-green-50 text-green-800 border-green-200",
  update: "bg-blue-50 text-blue-800 border-blue-200",
  reject: "bg-red-50 text-red-700 border-red-200",
};

export function BulkClient({ applied, already }: { applied?: string; already?: string }) {
  const [state, formAction, pending] = useActionState<PreviewState, FormData>(previewImport, null);

  const rejects = state?.ok ? state.changes.filter((c) => c.kind === "reject") : [];
  const writes = state?.ok ? state.changes.filter((c) => c.kind !== "reject") : [];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-jet-primary">Catalogue</span>
        <h1 className="mt-2 text-3xl font-bold text-jet-text">Bulk edit in Excel</h1>
        <p className="mt-2 max-w-2xl text-jet-text-muted">
          Download the catalogue, edit it in Excel, upload it back. You see every change before
          anything is saved. Product images are not in the sheet — those stay here in the CMS.
        </p>
      </div>

      {applied && (
        <p role="status" className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Applied. {applied} product{applied === "1" ? "" : "s"} written, and the live site is
          already showing them.
        </p>
      )}
      {already && (
        <p role="status" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          That upload had already been applied — nothing was written a second time.
        </p>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <a
          href="/admin/catalogue-export/"
          className="flex items-start gap-3 rounded-2xl border border-jet-border bg-jet-bg-card p-5 transition-colors hover:border-jet-primary/40"
        >
          <Download className="mt-0.5 h-5 w-5 shrink-0 text-jet-primary" aria-hidden />
          <span>
            <span className="block font-semibold text-jet-text">1. Download the catalogue</span>
            <span className="mt-1 block text-sm text-jet-text-muted">
              Every product, every field, with dropdowns and a How-to-use sheet.
            </span>
          </span>
        </a>

        <form action={formAction} className="rounded-2xl border border-jet-border bg-jet-bg-card p-5">
          <div className="flex items-start gap-3">
            <Upload className="mt-0.5 h-5 w-5 shrink-0 text-jet-primary" aria-hidden />
            <div className="min-w-0 flex-1">
              <label htmlFor="file" className="block font-semibold text-jet-text">
                2. Upload the edited file
              </label>
              <input
                id="file"
                name="file"
                type="file"
                required
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="mt-2 block w-full text-sm text-jet-text-dim file:mr-3 file:rounded-lg file:border-0 file:bg-jet-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-jet-primary hover:file:bg-jet-primary/20"
              />
              <button
                type="submit"
                disabled={pending}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-jet-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-jet-primary-dim disabled:opacity-60"
              >
                {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                {pending ? "Reading…" : "Preview changes"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {state && !state.ok && (
        <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      {state?.ok && (
        <section className="rounded-2xl border border-jet-border bg-jet-bg-card p-6">
          <h2 className="text-lg font-bold text-jet-text">3. Check, then apply</h2>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-green-800">
              <Plus className="h-3.5 w-3.5" aria-hidden /> {state.summary.create} new
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-blue-800">
              <Pencil className="h-3.5 w-3.5" aria-hidden /> {state.summary.update} changed
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-jet-border px-3 py-1.5 text-jet-text-muted">
              {state.summary.unchanged} untouched
            </span>
            {state.summary.reject > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-red-700">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden /> {state.summary.reject} rejected
              </span>
            )}
          </div>

          {rejects.length > 0 && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="mb-2 text-sm font-semibold text-red-800">
                These rows will be skipped. Everything else still applies.
              </p>
              <ul className="space-y-1 text-sm text-red-700">
                {rejects.map((c, i) => (
                  <li key={i}>
                    <strong>Row {c.rowNo}</strong> {c.name && `(${c.name})`} — {c.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {writes.length > 0 && (
            <div className="mt-5 max-h-[28rem] overflow-auto rounded-xl border border-jet-border">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-jet-bg-elevated text-left">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-semibold text-jet-text">Row</th>
                    <th scope="col" className="px-3 py-2 font-semibold text-jet-text">Product</th>
                    <th scope="col" className="px-3 py-2 font-semibold text-jet-text">Field</th>
                    <th scope="col" className="px-3 py-2 font-semibold text-jet-text">Was</th>
                    <th scope="col" className="px-3 py-2 font-semibold text-jet-text">Becomes</th>
                  </tr>
                </thead>
                <tbody>
                  {writes.map((c, i) => (
                    <tr key={i} className="border-t border-jet-border align-top">
                      <td className="px-3 py-2 text-jet-text-muted">{c.rowNo}</td>
                      <td className="px-3 py-2">
                        <span className={`mr-2 inline-block rounded border px-1.5 py-0.5 text-[11px] font-medium ${KIND_STYLE[c.kind]}`}>
                          {c.kind}
                        </span>
                        <span className="text-jet-text">{c.name}</span>
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-jet-text-dim">{c.field ?? "—"}</td>
                      <td className="max-w-[16rem] px-3 py-2 text-jet-text-muted">
                        <span className="line-clamp-3 break-words">{c.before || "—"}</span>
                      </td>
                      <td className="max-w-[16rem] px-3 py-2 font-medium text-jet-text">
                        <span className="line-clamp-3 break-words">{c.after || "—"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {writes.length > 0 ? (
            <form action={applyImport} className="mt-5">
              <input type="hidden" name="batchId" value={state.batchId} />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-jet-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-jet-primary-dim"
              >
                Apply {state.summary.create + state.summary.update} change
                {state.summary.create + state.summary.update === 1 ? "" : "s"}
              </button>
              <p className="mt-2 text-xs text-jet-text-muted">
                This writes to the live site straight away. Every change is recorded in the audit log.
              </p>
            </form>
          ) : (
            <p className="mt-5 text-sm text-jet-text-muted">
              Nothing here can be applied — fix the rejected rows and upload again.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
