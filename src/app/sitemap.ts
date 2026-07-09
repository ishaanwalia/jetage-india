import type { MetadataRoute } from "next";
import { products } from "@/lib/data/products";
import { blogPosts } from "@/lib/data/blogs";

const BASE_URL = "https://www.jetageindia.in";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/products/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/category/printer/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/category/accessory/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/blogs/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about/`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/showroom/`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact/`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/shipping/`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/warranty/`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/privacy/`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms/`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/products/${product.id}/`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blogs/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
