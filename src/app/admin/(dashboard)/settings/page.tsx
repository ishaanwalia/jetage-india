import Link from "next/link";
import { ScrollText } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import PasswordForm from "./PasswordForm";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-jet-primary">Account</span>
        <h1 className="mt-2 text-3xl font-bold text-jet-text">Settings</h1>
      </div>

      <section className="mb-8 rounded-2xl border border-jet-border bg-jet-bg-card p-6">
        <h2 className="mb-4 font-semibold text-jet-text">Signed in as</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-jet-text-muted">Email</dt>
            <dd className="font-medium text-jet-text">{user?.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-jet-text-muted">Name</dt>
            <dd className="font-medium text-jet-text">{user?.name || "—"}</dd>
          </div>
        </dl>
      </section>

      <PasswordForm />

      <Link
        href="/admin/audit"
        className="mt-8 flex items-center gap-2 text-sm font-medium text-jet-primary hover:underline"
      >
        <ScrollText className="h-4 w-4" /> View audit log
      </Link>
    </div>
  );
}
