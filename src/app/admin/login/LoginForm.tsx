"use client";

import { useActionState } from "react";
import { Lock, LogIn } from "lucide-react";
import { loginAction } from "../actions";

export default function LoginForm({ passwordChanged }: { passwordChanged: boolean }) {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-3xl bg-jet-bg-card border border-jet-border p-8 shadow-premium-hover">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-jet-primary">
            <Lock className="h-5 w-5 text-white" />
          </span>
          <h1 className="text-xl font-semibold text-jet-text">Jetage India CMS</h1>
          <p className="mt-2 text-sm text-jet-text-muted">Sign in to manage products and articles</p>
        </div>

        {passwordChanged && (
          <p
            role="status"
            className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600"
          >
            Password updated. Sign in again with your new password.
          </p>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-jet-text-muted">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              defaultValue="info@jetageindia.in"
              className="w-full rounded-xl border border-jet-border bg-jet-bg px-4 py-3 text-sm text-jet-text placeholder-jet-text-muted focus:border-jet-primary focus:outline-none focus:ring-2 focus:ring-jet-primary/30"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-jet-text-muted">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-jet-border bg-jet-bg px-4 py-3 text-sm text-jet-text placeholder-jet-text-muted focus:border-jet-primary focus:outline-none focus:ring-2 focus:ring-jet-primary/30"
            />
          </div>

          {state && !state.ok && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500"
            >
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-jet-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-jet-primary-dim disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
