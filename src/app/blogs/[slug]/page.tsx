import { blogPosts } from "@/lib/data/blogs";
import { notFound } from "next/navigation";
import BlogDetailClient from "./BlogDetailClient";
import type { Metadata } from "next";

const BASE_URL = "https://www.jetageindia.in";

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
    alternates: {
      canonical: `${BASE_URL}/blogs/${post.slug}/`,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `${BASE_URL}/blogs/${post.slug}/`,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((b) => b.slug === slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    author: {
      "@type": "Organization",
      name: post.author,
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Jetage India",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/LogoJ.png`,
      },
    },
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blogs/${post.slug}/`,
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    inLanguage: "en-IN",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blogs", item: `${BASE_URL}/blogs/` },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${BASE_URL}/blogs/${post.slug}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogDetailClient blog={post} />
    </>
  );
}
