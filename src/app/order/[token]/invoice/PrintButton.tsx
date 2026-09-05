"use client";

import { Printer } from "lucide-react";

/** The only interactive thing on the invoice, so it is the only client code. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-xl bg-jet-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-jet-primary-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-jet-primary"
    >
      <Printer className="h-4 w-4" aria-hidden /> Print or save as PDF
    </button>
  );
}
