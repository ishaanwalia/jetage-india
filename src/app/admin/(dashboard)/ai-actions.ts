"use server";

import { getCurrentUser } from "@/lib/auth";
import { draft, type DraftKind } from "@/lib/ai-draft";

/**
 * Drafting, exposed to the CMS forms.
 *
 * The session is re-checked here rather than relying on the layout guard: a
 * server action is reachable directly, and this one spends money.
 */
export async function draftAction(
  kind: DraftKind,
  facts: string,
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  if (!(await getCurrentUser())) return { ok: false, error: "Please sign in again." };
  return draft(kind, facts);
}
