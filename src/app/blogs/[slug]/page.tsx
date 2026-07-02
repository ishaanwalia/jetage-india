import { blogPosts } from "@/lib/data/blogs";
import { notFound } from "next/navigation";
import BlogDetailClient from "./BlogDetailClient";
import type { Metadata } from "next";

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find((b) => b.slug === params.slug);
  if (!post) return { title: "Not Found | Jetage Blog" };

  return {
    title: `${post.title} | Jetage Blog`,
    description: post.metaDescription,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((b) => b.slug === params.slug);
  if (!post) notFound();
  return <BlogDetailClient blog={post} />;
}