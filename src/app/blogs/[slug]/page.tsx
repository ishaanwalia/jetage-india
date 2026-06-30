import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";
import BlogDetailClient from "./BlogDetailClient";
import { notFound } from "next/navigation";
import { blogPosts, getBlogBySlug } from "@/lib/data/blogs";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return blogPosts.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) return { title: "Blog | Jetage India" };

  return {
    title: `${blog.title} | Jetage Blog`,
    description: blog.metaDescription,
    keywords: blog.tags.join(", "),
    alternates: {
      canonical: `https://www.jetageindia.in/blogs/${blog.slug}/`,
    },
    openGraph: {
      title: blog.title,
      description: blog.metaDescription,
      url: `https://www.jetageindia.in/blogs/${blog.slug}/`,
      type: "article",
      publishedTime: blog.date,
      authors: [blog.author],
      tags: blog.tags,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <BlogDetailClient blog={blog} />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
