import { blogPosts } from "@/lib/data/blogs";
import { notFound } from "next/navigation";
import BlogDetailClient from "./BlogDetailClient";
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
  return <BlogDetailClient blog={post} />;
}