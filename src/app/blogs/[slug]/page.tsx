import { blogPosts } from "@/lib/data/blogs";
import { notFound } from "next/navigation";
import BlogDetailClient from "./BlogDetailClient";
import type { Metadata } from "next";

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((b) => b.slug === slug);
  if (!post) {
    return {
      title: "Not Found | Jetage Blog",
      description: "Blog post not found.",
    };
  }

  return {
    title: `${post.title} | Jetage Blog`,
    description: post.metaDescription,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((b) => b.slug === slug);
  if (!post) notFound();
  return <BlogDetailClient blog={post} />;
}
