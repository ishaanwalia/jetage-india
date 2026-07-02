import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal, StaggerReveal } from "@/components/Reveal";
import { Calendar, Clock, ArrowRight, User, Tag } from "lucide-react";
import Link from "next/link";
import { blogPosts } from "@/lib/data/blogs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jetage Blog | HP Buying Guides, Reviews & Tech Tips 2026",
  description: "Expert HP product buying guides, printer comparisons, laptop price guides, and technology insights from Chandigarh's trusted HP dealer since 1989.",
  keywords: "HP blog, HP printer guide, HP laptop price Chandigarh, HP buying guide, Jetage blog",
  alternates: {
    canonical: "https://www.jetageindia.in/blogs/",
  },
  openGraph: {
    title: "Jetage Blog | HP Buying Guides & Tech Tips 2026",
    description: "Expert advice on HP products from Chandigarh's trusted HP dealer since 1989.",
    url: "https://www.jetageindia.in/blogs/",
    type: "website",
  },
};

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-jet-bg">
      <Navbar />

      <div className="pt-28 pb-16 bg-jet-bg-elevated border-b border-jet-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Reveal direction="up">
            <div className="text-center space-y-4">
              <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
                Insights
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-jet-text">
                Jetage <span className="text-gradient-gold">Blog</span>
              </h1>
              <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
                Expert advice on HP products, buying guides, and technology trends from Chandigarh's trusted HP partner since 1989.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <StaggerReveal className="space-y-8" direction="up" stagger={0.15}>
          {blogPosts.map((blog) => (
            <article key={blog.id} className="bg-jet-bg-card rounded-3xl border border-jet-border overflow-hidden hover:border-jet-border-strong hover:shadow-premium transition-all group">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4 flex-wrap">
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

                <h2 className="text-2xl lg:text-3xl font-bold text-jet-text mb-4 group-hover:text-jet-primary transition-colors leading-tight">
                  {blog.title}
                </h2>

                <p className="text-jet-text-dim leading-relaxed mb-6">
                  {blog.excerpt}
                </p>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-jet-primary/10 rounded-full flex items-center justify-center border border-jet-primary/20">
                      <User className="w-4 h-4 text-jet-primary" />
                    </div>
                    <span className="text-sm text-jet-text-muted">{blog.author}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-jet-bg-elevated text-jet-text-dim text-xs rounded-lg border border-jet-border">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-8 pb-8">
                <Link
                  href={`/blogs/${blog.slug}/`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-jet-bg-elevated text-jet-primary border border-jet-primary/20 rounded-full font-semibold hover:bg-jet-primary hover:text-white transition-all group/btn"
                >
                  Read Full Article
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </StaggerReveal>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
