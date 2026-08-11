import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { adminListBlogs } from "@/lib/cms";

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const blogs = await adminListBlogs();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-jet-primary">Editorial</span>
          <h1 className="mt-2 text-3xl font-bold text-jet-text">Articles</h1>
          <p className="mt-2 text-jet-text-muted">{blogs.length} total</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 rounded-xl bg-jet-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-jet-primary-dim"
        >
          <Plus className="h-4 w-4" /> New article
        </Link>
      </div>

      {(saved || deleted) && (
        <p
          role="status"
          className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {saved ? "Article saved and published to the live site." : "Article deleted."}
        </p>
      )}

      <ul className="divide-y divide-jet-border overflow-hidden rounded-2xl border border-jet-border bg-jet-bg-card">
        {blogs.map((blog) => (
          <li key={blog.slug}>
            <Link
              href={`/admin/blogs/${blog.slug}`}
              className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-jet-bg-elevated"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium text-jet-text">{blog.title}</span>
                <span className="mt-0.5 block truncate text-xs text-jet-text-muted">
                  {blog.category} · {blog.date} · {blog.readTime}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                {blog.featured && <Star className="h-3.5 w-3.5 fill-jet-primary text-jet-primary" />}
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    blog.status === "draft"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {blog.status === "draft" ? "Draft" : "Live"}
                </span>
              </span>
            </Link>
          </li>
        ))}
        {blogs.length === 0 && (
          <li className="px-5 py-10 text-center text-jet-text-muted">No articles yet.</li>
        )}
      </ul>
    </div>
  );
}
