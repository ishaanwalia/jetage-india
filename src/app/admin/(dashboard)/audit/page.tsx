import { getAuditLog } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata = { title: "Audit log | Jetage India CMS" };

const ACTION_STYLE: Record<string, string> = {
  create: "text-green-600",
  update: "text-amber-600",
  delete: "text-red-600",
};

function preview(value: unknown): string {
  if (value === null || value === undefined || value === "") return "empty";
  const text = String(value);
  return text.length > 70 ? `${text.slice(0, 67)}…` : text;
}

export default async function AuditPage() {
  const logs = await getAuditLog();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-jet-primary">History</span>
        <h1 className="mt-2 text-3xl font-bold text-jet-text">Audit log</h1>
        <p className="mt-2 text-jet-text-muted">
          Every change made through this dashboard, newest first. Nothing here can be edited or removed.
        </p>
      </div>

      {logs.length === 0 ? (
        <p className="rounded-2xl border border-jet-border bg-jet-bg-card px-5 py-8 text-center text-sm text-jet-text-muted">
          No changes have been made yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {logs.map((log) => (
            <li key={log.id} className="rounded-2xl border border-jet-border bg-jet-bg-card px-5 py-4">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                <span className={`font-semibold capitalize ${ACTION_STYLE[log.action] ?? "text-jet-text"}`}>
                  {log.action}
                </span>
                <span className="text-jet-text-muted">{log.resource}</span>
                <strong className="font-medium text-jet-text">{log.record_label}</strong>
              </div>

              <p className="mt-1 text-xs text-jet-text-muted">
                {log.actor_email} · {new Date(log.created_at).toLocaleString("en-IN")}
              </p>

              {log.changes && Object.keys(log.changes).length > 0 && (
                <dl className="mt-3 space-y-1.5 border-t border-jet-border pt-3 text-xs">
                  {Object.entries(log.changes).map(([name, change]) => (
                    <div key={name} className="sm:flex sm:gap-3">
                      <dt className="shrink-0 text-jet-text-muted sm:w-32">{name}</dt>
                      <dd className="text-jet-text">
                        <span className="text-jet-text-muted line-through">{preview(change.from)}</span>
                        <span className="mx-2 text-jet-text-muted">→</span>
                        <span>{preview(change.to)}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
