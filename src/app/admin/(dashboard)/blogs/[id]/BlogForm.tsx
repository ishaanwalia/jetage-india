"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, Pencil, Save, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { saveBlogAction, deleteBlogAction } from "../../../actions";
import { CheckboxField, Field, Fieldset, ImageField, SubmitBar, TextareaField } from "../../form-parts";
import type { BlogPost } from "@/lib/cms";

export default function BlogForm({ blog }: { blog: BlogPost | null }) {
  const [state, formAction, pending] = useActionState(saveBlogAction, null);
  const [content, setContent] = useState(blog?.content ?? "");
  const [tab, setTab] = useState<0 | 1>(0);
  const isNew = !blog;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/blogs"
        className="mb-6 inline-flex items-center gap-2 text-sm text-jet-text-muted transition-colors hover:text-jet-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to articles
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-jet-text">
        {isNew ? "New article" : blog.title}
      </h1>

      <form action={formAction} className="space-y-8">
        {blog && <input type="hidden" name="existingSlug" value={blog.slug} />}

        <Fieldset legend="Article">
          <Field label="Title" name="title" defaultValue={blog?.title} required />
          {isNew && (
            <Field label="URL slug" name="slug" hint="Leave blank to generate from the title. Cannot be changed later." />
          )}
          <Field
            label="Meta description"
            name="metaDescription"
            defaultValue={blog?.metaDescription}
            hint="Shown in search results — aim for one clear sentence."
          />
          <TextareaField
            label="Excerpt"
            name="excerpt"
            rows={3}
            defaultValue={blog?.excerpt}
            hint="Shown on the blog index."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" name="category" defaultValue={blog?.category} />
            <Field label="Author" name="author" defaultValue={blog?.author ?? "Jetage Team"} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Publish date"
              name="date"
              type="date"
              defaultValue={blog?.date ?? new Date().toISOString().slice(0, 10)}
            />
            <Field
              label="Read time"
              name="readTime"
              defaultValue={blog?.readTime}
              hint="Leave blank to calculate from the content."
            />
          </div>
          <Field label="Tags" name="tags" defaultValue={blog?.tags?.join(", ")} hint="Comma separated." />
        </Fieldset>

        <Fieldset legend="Content" hint="Markdown — headings, lists, tables, links and code.">
          <div role="tablist" aria-label="Editor mode" className="mb-3 flex gap-1">
            {[
              { label: "Write", icon: Pencil },
              { label: "Preview", icon: Eye },
            ].map(({ label, icon: Icon }, i) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={tab === i}
                onClick={() => setTab(i as 0 | 1)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  tab === i ? "bg-jet-primary/10 text-jet-primary" : "text-jet-text-muted hover:bg-jet-bg-elevated"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          {tab === 0 ? (
            <div>
              <label htmlFor="content" className="sr-only">
                Article content
              </label>
              <textarea
                id="content"
                name="content"
                rows={22}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-xl border border-jet-border px-4 py-3 font-mono text-[13px] leading-relaxed focus:border-jet-primary focus:outline-none focus:ring-2 focus:ring-jet-primary/20"
              />
            </div>
          ) : (
            <>
              {/* Preview only — the textarea above stays mounted so its value keeps posting. */}
              <input type="hidden" name="content" value={content} />
              <div className="admin-article-preview min-h-[400px] rounded-xl border border-jet-border bg-jet-bg-card p-6 text-sm leading-relaxed text-jet-text">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            </>
          )}
        </Fieldset>

        <Fieldset legend="Publishing">
          <ImageField label="Cover image (optional)" name="coverImage" defaultValue={blog?.coverImage ?? ""} />
          <div className="flex flex-wrap items-center gap-6">
            <CheckboxField label="Feature on the blog index" name="featured" defaultChecked={blog?.featured} />

            <div className="flex items-center gap-2">
              <label htmlFor="status" className="text-sm text-jet-text">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={blog?.status ?? "published"}
                className="rounded-xl border border-jet-border px-3 py-2 text-sm focus:border-jet-primary focus:outline-none"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </Fieldset>

        <SubmitBar
          pending={pending}
          error={state && !state.ok ? state.message : null}
          submitLabel={isNew ? "Create article" : "Save changes"}
          icon={<Save className="h-4 w-4" />}
        />
      </form>

      {blog && (
        <form action={deleteBlogAction} className="mt-10 border-t border-jet-border pt-6">
          <input type="hidden" name="slug" value={blog.slug} />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Delete this article
          </button>
        </form>
      )}
    </div>
  );
}
