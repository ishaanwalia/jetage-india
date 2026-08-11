"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import { changePasswordAction } from "../../actions";

export default function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, null);

  return (
    <section className="rounded-2xl border border-jet-border bg-jet-bg-card p-6">
      <h2 className="mb-1 font-semibold text-jet-text">Change password</h2>
      <p className="mb-5 text-sm text-jet-text-muted">
        Changing your password signs out every device, including this one.
      </p>

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="current" className="mb-1.5 block text-sm font-medium text-jet-text">
            Current password
          </label>
          <input
            id="current"
            name="current"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-jet-border px-4 py-2.5 text-sm focus:border-jet-primary focus:outline-none focus:ring-2 focus:ring-jet-primary/20"
          />
        </div>

        <div>
          <label htmlFor="next" className="mb-1.5 block text-sm font-medium text-jet-text">
            New password
          </label>
          <input
            id="next"
            name="next"
            type="password"
            required
            minLength={12}
            autoComplete="new-password"
            aria-describedby="next-hint"
            className="w-full rounded-xl border border-jet-border px-4 py-2.5 text-sm focus:border-jet-primary focus:outline-none focus:ring-2 focus:ring-jet-primary/20"
          />
          <p id="next-hint" className="mt-1.5 text-xs text-jet-text-muted">
            At least 12 characters. A passphrase of a few unrelated words works well.
          </p>
        </div>

        <div>
          <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-jet-text">
            Confirm new password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            minLength={12}
            autoComplete="new-password"
            className="w-full rounded-xl border border-jet-border px-4 py-2.5 text-sm focus:border-jet-primary focus:outline-none focus:ring-2 focus:ring-jet-primary/20"
          />
        </div>

        {state && !state.ok && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-jet-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-jet-primary-dim disabled:opacity-60"
        >
          <KeyRound className="h-4 w-4" />
          {pending ? "Updating…" : "Update password"}
        </button>
      </form>
    </section>
  );
}
