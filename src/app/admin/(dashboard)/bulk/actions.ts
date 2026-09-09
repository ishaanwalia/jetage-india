"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import { getCurrentUser } from "@/lib/auth";
import { dryRunImport, applyRows, type Change, type SheetRow } from "@/lib/excel";
import { CACHE_TAGS } from "@/lib/cms";

const sql = neon(process.env.DATABASE_URL!);

export type PreviewState =
  | { ok: true; batchId: number; changes: Change[]; summary: Record<string, number> }
  | { ok: false; error: string }
  | null;

/**
 * Parse an upload and store the diff. Writes nothing to the catalogue.
 *
 * The parsed rows are kept in `import_batches` rather than held in memory,
 * because the preview and the apply are two separate requests and there is no
 * server between them holding state.
 */
export async function previewImport(_prev: PreviewState, formData: FormData): Promise<PreviewState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in again." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose a .xlsx file first." };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { ok: false, error: "That file is over 10 MB. Export a fresh copy and edit that." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { changes, rows, summary } = await dryRunImport(buffer);

    if (rows.length === 0 && summary.reject === 0) {
      return { ok: false, error: "Nothing in that sheet is different from what is already live." };
    }

    // The diff is stored, not just returned to the screen: it is what the
    // audit log records on apply, and it has to be the one that was approved.
    const [batch] = (await sql`
      INSERT INTO import_batches (actor_email, rows, summary, changes)
      VALUES (${user.email}, ${JSON.stringify(rows)}::jsonb, ${JSON.stringify(summary)}::jsonb,
              ${JSON.stringify(changes)}::jsonb)
      RETURNING id
    `) as { id: number }[];

    return { ok: true, batchId: batch.id, changes, summary };
  } catch (err) {
    console.error("[bulk] parse failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "That file could not be read as a spreadsheet.",
    };
  }
}

/** Applies a previewed batch. The only thing here that writes. */
export async function applyImport(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const batchId = Number(formData.get("batchId"));
  if (!Number.isInteger(batchId)) redirect("/admin/bulk?error=1");

  const [batch] = (await sql`
    SELECT id, rows, changes, applied_at FROM import_batches WHERE id = ${batchId}
  `) as {
    id: number;
    rows: SheetRow[];
    changes: Change[];
    applied_at: string | null;
  }[];

  if (!batch) redirect("/admin/bulk?error=1");
  // Re-pressing Apply, or a double submit, must not write the batch twice.
  if (batch.applied_at) redirect(`/admin/bulk?already=1`);

  const written = await applyRows(batch.rows, user.email, batch.changes ?? []);

  await sql`
    UPDATE import_batches SET applied_at = now(), applied_by = ${user.email}
    WHERE id = ${batchId} AND applied_at IS NULL
  `;

  // Same tags the single-product editor uses, so the live site and the
  // chatbot's grounding context both pick the changes up immediately.
  updateTag(CACHE_TAGS.products);
  updateTag(CACHE_TAGS.categories);

  redirect(`/admin/bulk?applied=${written}`);
}
