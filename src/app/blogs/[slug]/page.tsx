import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";
import { Calendar, Clock, User, Tag, ArrowLeft, Share2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/data/blogs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";

// ✅ REQUIRED for static export — tells Next.js which slugs to pre-render
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find((b) => b.slug === params.slug);
  if (!post) return { title: "Not Found | Jetage Blog" };

  return {
    title: `${post.title} | Jetage Blog`,
    description: post.metaDescription,
    keywords: post.tags.join(", "),
    alternates: {
      canonical: `https://www.jetageindia.in/blogs/${post.slug}/`,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `https://www.jetageindia.in/blogs/${post.slug}/`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((b) => b.slug === params.slug);
  if (!post) notFound();

  const currentIndex = blogPosts.findIndex((b) => b.slug === params.slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-jet-bg">
      <Navbar />

      {/* Hero */}
      <div className="pt-28 pb-16 bg-jet-bg-elevated border-b border-jet-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Reveal direction="up">
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href="/blogs/"
                  className="inline-flex items-center gap-1 text-sm text-jet-text-muted hover:text-jet-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>
                <span className="text-jet-border-strong">|</span>
                <span className="px-3 py-1 bg-jet-primary/10 text-jet-primary text-xs font-semibold rounded-full border border-jet-primary/20">
                  {post.category}
                </span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-jet-text leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 flex-wrap text-sm text-jet-text-muted">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Reveal direction="up">
              <article className="prose prose-invert prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children }) => (
                      <h2 className="text-2xl lg:text-3xl font-bold text-jet-text mt-12 mb-6 leading-tight">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl lg:text-2xl font-bold text-jet-text mt-8 mb-4">
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
                    ul: ({ children }) => (
                      <ul className="space-y-3 mb-6 list-none">
                        {children}
                      </ul>
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
                  {post.content}
                </ReactMarkdown>
              </article>
            </Reveal>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-jet-border">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-jet-text-muted" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-jet-bg-elevated text-jet-text-dim text-xs rounded-lg border border-jet-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Share */}
            <div className="bg-jet-bg-card rounded-2xl border border-jet-border p-6">
              <h3 className="font-bold text-jet-text mb-4">Share Article</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: post.title,
                        text: post.metaDescription,
                        url: window.location.href,
                      });
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-jet-bg-elevated text-jet-text rounded-xl text-sm font-medium border border-jet-border hover:border-jet-border-strong transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${post.title} - https://www.jetageindia.in/blogs/${post.slug}/`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-jet-whatsapp text-white rounded-xl text-sm font-medium hover:bg-[#128C7E] transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Related Posts */}
            <div className="bg-jet-bg-card rounded-2xl border border-jet-border p-6">
              <h3 className="font-bold text-jet-text mb-4">More Articles</h3>
              <div className="space-y-4">
                {blogPosts
                  .filter((b) => b.slug !== post.slug)
                  .slice(0, 3)
                  .map((related) => (
                    <Link
                      key={related.slug}
                      href={`/blogs/${related.slug}/`}
                      className="block group"
                    >
                      <p className="text-sm font-medium text-jet-text group-hover:text-jet-primary transition-colors leading-snug">
                        {related.title}
                      </p>
                      <p className="text-xs text-jet-text-muted mt-1">{related.readTime}</p>
                    </Link>
                  ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-jet-primary/10 to-jet-primary/5 rounded-2xl border border-jet-primary/20 p-6">
              <h3 className="font-bold text-jet-text mb-2">Need Help Choosing?</h3>
              <p className="text-sm text-jet-text-dim mb-4">
                Get personalized HP product recommendations from our experts.
              </p>
              <a
                href="https://wa.me/919814958295"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-jet-whatsapp text-white rounded-xl text-sm font-bold hover:bg-[#128C7E] transition-all w-full justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Prev/Next Navigation */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pb-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-jet-border">
          {prevPost ? (
            <Link
              href={`/blogs/${prevPost.slug}/`}
              className="group flex items-center gap-3 text-left"
            >
              <ArrowLeft className="w-4 h-4 text-jet-text-muted group-hover:text-jet-primary transition-colors" />
              <div>
                <p className="text-xs text-jet-text-muted mb-1">Previous</p>
                <p className="text-sm font-medium text-jet-text group-hover:text-jet-primary transition-colors line-clamp-2">
                  {prevPost.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link
              href={`/blogs/${nextPost.slug}/`}
              className="group flex items-center gap-3 text-right"
            >
              <div>
                <p className="text-xs text-jet-text-muted mb-1">Next</p>
                <p className="text-sm font-medium text-jet-text group-hover:text-jet-primary transition-colors line-clamp-2">
                  {nextPost.title}
                </p>
              </div>
              <ArrowLeft className="w-4 h-4 text-jet-text-muted group-hover:text-jet-primary transition-colors rotate-180" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}