"use client";

import { Calendar, Clock, User, ArrowLeft, Share2, MessageCircle, Tag } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  metaDescription: string;
}

interface BlogDetailClientProps {
  blog: Blog;
}

// ✅ FIX: Clean escaped Markdown from blog content
function cleanMarkdown(content: string): string {
  return content
    .replace(/\\\\\\*\\*/g, '**')
    .replace(/\\\\\\*/g, '*')
    .replace(/\\\\\\|/g, '|')
    .replace(/\\\\\\-/g, '-')
    .replace(/\\\\\\[/g, '[')
    .replace(/\\\\\\]/g, ']')
    .replace(/\\\\\\(/g, '(')
    .replace(/\\\\\\)/g, ')');
}

export default function BlogDetailClient({ blog }: BlogDetailClientProps) {
  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <main className="min-h-screen bg-jet-bg">
      <div className="pt-28 pb-12 bg-jet-bg-elevated border-b border-jet-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-6">
            <Link
              href="/blogs/"
              className="inline-flex items-center gap-2 text-sm text-jet-text-muted hover:text-jet-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            <div className="flex items-center gap-4 flex-wrap">
              <span className="px-3 py-1 bg-jet-primary/10 text-jet-primary text-xs font-semibold rounded-full border border-jet-primary/20">
                {blog.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-jet-text-muted">
                <Calendar className="w-3.5 h-3.5" />
                {blog.date}
              </span>
              <span className="flex items-center gap-1 text-xs text-jet-text-muted">
                <Clock className="w-3.5 h-3.5" />
                {blog.readTime}
              </span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold text-jet-text leading-tight">
              {blog.title}
            </h1>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-jet-primary/10 rounded-full flex items-center justify-center border border-jet-primary/20">
                <User className="w-5 h-5 text-jet-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-jet-text">{blog.author}</p>
                <p className="text-xs text-jet-text-muted">Jetage India</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <article className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => (
                <h2 className="text-2xl lg:text-3xl font-bold text-jet-text mt-10 mb-4 leading-tight">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl lg:text-2xl font-bold text-jet-text mt-8 mb-3">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-jet-text-dim leading-relaxed mb-6">
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <strong className="text-jet-text font-bold">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="text-jet-text italic">
                  {children}
                </em>
              ),
              ul: ({ children }) => (
                <ul className="space-y-3 mb-6 list-none">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-3 mb-6 list-decimal list-inside">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="flex items-start gap-3 text-jet-text-dim">
                  <span className="w-1.5 h-1.5 bg-jet-primary rounded-full mt-2.5 flex-shrink-0" />
                  <span>{children}</span>
                </li>
              ),
              a: ({ href, children }) => (
                <Link
                  href={href || "#"}
                  className="text-jet-primary hover:text-jet-accent underline underline-offset-4 transition-colors"
                >
                  {children}
                </Link>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-8">
                  <table className="w-full text-sm border border-jet-border rounded-xl overflow-hidden">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-jet-bg-elevated">
                  {children}
                </thead>
              ),
              th: ({ children }) => (
                <th className="px-4 py-3 text-left font-bold text-jet-text border-b border-jet-border">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 text-jet-text-dim border-b border-jet-border">
                  {children}
                </td>
              ),
              tr: ({ children }) => (
                <tr className="hover:bg-jet-bg-elevated/50 transition-colors">
                  {children}
                </tr>
              ),
              hr: () => (
                <hr className="border-jet-border my-8" />
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-jet-primary pl-6 py-2 my-6 bg-jet-bg-elevated/50 rounded-r-xl">
                  <p className="text-jet-text italic mb-0">{children}</p>
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-jet-bg-elevated text-jet-primary px-2 py-1 rounded-lg text-sm font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-jet-bg-elevated p-4 rounded-xl overflow-x-auto mb-6 border border-jet-border">
                  {children}
                </pre>
              ),
            }}
          >
            {/* ✅ FIXED: Clean the escaped Markdown before rendering */}
            {cleanMarkdown(blog.content)}
          </ReactMarkdown>
        </article>

        <div className="mt-12 pt-8 border-t border-jet-border">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-jet-text-muted" />
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-jet-bg-elevated text-jet-text-dim text-xs rounded-full border border-jet-border"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <div className="bg-jet-bg-card rounded-2xl border border-jet-border p-8 text-center">
            <h3 className="text-xl font-bold text-jet-text mb-3">
              Need Help Choosing the Right Product?
            </h3>
            <p className="text-jet-text-dim mb-6">
              Our experts at SCO-12, Sector-17-E, Chandigarh are ready to help. 
              Get personalized recommendations via WhatsApp.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://wa.me/919814958295"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-jet-whatsapp text-white rounded-full font-bold hover:bg-[#128C7E] transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-6 py-3 bg-jet-bg-elevated text-jet-text border border-jet-border rounded-full font-bold hover:border-jet-primary/40 transition-all"
              >
                <Share2 className="w-5 h-5" />
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}