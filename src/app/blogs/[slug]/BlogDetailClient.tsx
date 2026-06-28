"use client";

import { Calendar, Clock, User, ArrowLeft, MessageCircle, Share2, Tag } from "lucide-react";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
}

interface BlogDetailClientProps {
  blog: Blog;
}

function formatContent(content: string) {
  return content.split("\n\n").map((paragraph, i) => {
    if (paragraph.startsWith("## ")) {
      return (
        <h2 key={i} className="text-2xl font-bold text-jet-text mt-10 mb-4">
          {paragraph.replace("## ", "")}
        </h2>
      );
    }
    if (paragraph.startsWith("- ")) {
      const items = paragraph.split("\n").filter((line) => line.startsWith("- "));
      return (
        <ul key={i} className="space-y-2 mb-6 ml-4">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-jet-text-dim">
              <span className="w-1.5 h-1.5 bg-jet-primary rounded-full mt-2 flex-shrink-0" />
              {item.replace("- ", "")}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="text-jet-text-dim leading-relaxed mb-6">
        {paragraph}
      </p>
    );
  });
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
        <article className="prose prose-lg max-w-none">
          {formatContent(blog.content)}
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