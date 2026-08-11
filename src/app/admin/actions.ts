"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { changePassword, getCurrentUser, signIn, signOut } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import {
  CACHE_TAGS,
  adminGetBlog,
  adminGetProduct,
  deleteBlog,
  deleteProduct,
  diffFields,
  recordAudit,
  saveBlog,
  saveProduct,
  type BlogInput,
  type ProductInput,
} from "@/lib/cms";

/**
 * Admin mutations.
 *
 * Two rules hold for everything in this file:
 *
 *  1. Every action re-checks the session itself. A server action is a public
 *     HTTP endpoint — the fact that only a signed-in page renders the form is
 *     not authorisation, so `requireUser()` runs before any write.
 *  2. Every write revalidates the matching cache tag, which is what pushes an
 *     edit onto the live site without a redeploy.
 */

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export type ActionState = { ok: boolean; message: string } | null;

/* ------------------------------------------------------------------ *
 * Session
 * ------------------------------------------------------------------ */

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, message: "Enter your email and password." };
  }

  const user = await signIn(email, password);
  // One message for both "no such account" and "wrong password", so the form
  // cannot be used to discover which emails exist.
  if (!user) return { ok: false, message: "Those credentials did not match." };

  redirect("/admin");
}

export async function logoutAction() {
  await signOut();
  redirect("/admin/login");
}

export async function changePasswordAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next !== confirm) return { ok: false, message: "The new passwords do not match." };

  const result = await changePassword(user.id, current, next);
  if (!result.ok) return { ok: false, message: result.error };

  // changePassword drops every session for this user, including this one.
  redirect("/admin/login?changed=1");
}

/* ------------------------------------------------------------------ *
 * Shared helpers
 * ------------------------------------------------------------------ */

/** Textareas hold one entry per line; blank lines are dropped. */
function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** "Key: value" per line becomes the specifications object. */
function keyValues(value: FormDataEntryValue | null): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of lines(value)) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const val = line.slice(separator + 1).trim();
    if (key) out[key] = val;
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Products
 * ------------------------------------------------------------------ */

export async function saveProductAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();

  const existingId = String(formData.get("existingId") ?? "") || null;
  const before = existingId ? await adminGetProduct(existingId) : null;

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, message: "Name is required." };

  const price = Number(formData.get("price") ?? 0);
  if (!Number.isFinite(price) || price < 0) {
    return { ok: false, message: "Price must be a positive number." };
  }
  const mrp = Number(formData.get("mrp") ?? price);

  // New products derive their id (and URL) from the name; existing products
  // keep their id fixed so published links never break.
  const id = existingId || slugify(String(formData.get("id") ?? "") || name);
  if (!id) return { ok: false, message: "Could not build a URL id from that name." };

  const input: ProductInput = {
    id,
    name,
    shortName: String(formData.get("shortName") ?? "").trim() || name,
    category: String(formData.get("category") ?? ""),
    subCategory: String(formData.get("subCategory") ?? "").trim(),
    price: Math.round(price),
    mrp: Math.round(mrp),
    sku: String(formData.get("sku") ?? "").trim(),
    speed: String(formData.get("speed") ?? "").trim(),
    connectivity: lines(formData.get("connectivity")),
    duplex: formData.get("duplex") === "on",
    dutyCycle: String(formData.get("dutyCycle") ?? "").trim(),
    idealFor: String(formData.get("idealFor") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    features: lines(formData.get("features")),
    image: String(formData.get("image") ?? "").trim(),
    images: lines(formData.get("images")),
    badge: String(formData.get("badge") ?? "").trim() || null,
    specs: keyValues(formData.get("specs")),
    warranty: String(formData.get("warranty") ?? "").trim() || null,
    weight: String(formData.get("weight") ?? "").trim() || null,
    dimensions: String(formData.get("dimensions") ?? "").trim() || null,
    firstPageOut: String(formData.get("firstPageOut") ?? "").trim() || null,
    resolution: String(formData.get("resolution") ?? "").trim() || null,
    paperCapacity: String(formData.get("paperCapacity") ?? "").trim() || null,
    mobilePrinting: lines(formData.get("mobilePrinting")),
    featured: formData.get("featured") === "on",
    status: formData.get("status") === "draft" ? "draft" : "published",
  };

  try {
    await saveProduct(existingId, input);
  } catch (error) {
    console.error("[admin] saveProduct failed", error);
    const duplicate = String(error).includes("products_pkey");
    return {
      ok: false,
      message: duplicate
        ? `The id "${id}" is already used by another product.`
        : "Could not save that product.",
    };
  }

  await recordAudit(
    user.email,
    existingId ? "update" : "create",
    "product",
    id,
    input.name,
    existingId ? diffFields(before as unknown as Record<string, unknown>, input) : null
  );

  updateTag(CACHE_TAGS.products);
  redirect("/admin/products?saved=1");
}

export async function deleteProductAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (id) {
    const product = await adminGetProduct(id);
    await deleteProduct(id);
    await recordAudit(user.email, "delete", "product", id, product?.name ?? id, null);
    updateTag(CACHE_TAGS.products);
  }
  redirect("/admin/products?deleted=1");
}

/* ------------------------------------------------------------------ *
 * Blogs
 * ------------------------------------------------------------------ */

export async function saveBlogAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();

  const existingSlug = String(formData.get("existingSlug") ?? "") || null;
  const before = existingSlug ? await adminGetBlog(existingSlug) : null;

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { ok: false, message: "Title is required." };

  const slug = existingSlug || slugify(String(formData.get("slug") ?? "") || title);
  const content = String(formData.get("content") ?? "");

  // ~200 wpm is the usual reading estimate; derived so it cannot go stale.
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = String(formData.get("readTime") ?? "").trim() || `${Math.max(1, Math.round(words / 200))} min read`;

  const input: BlogInput = {
    slug,
    title,
    metaDescription: String(formData.get("metaDescription") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content,
    category: String(formData.get("category") ?? "").trim(),
    author: String(formData.get("author") ?? "").trim() || "Jetage Team",
    date: String(formData.get("date") ?? "") || new Date().toISOString().slice(0, 10),
    readTime,
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    featured: formData.get("featured") === "on",
    coverImage: String(formData.get("coverImage") ?? "").trim() || null,
    status: formData.get("status") === "draft" ? "draft" : "published",
  };

  try {
    await saveBlog(existingSlug, input);
  } catch (error) {
    console.error("[admin] saveBlog failed", error);
    const duplicate = String(error).includes("blogs_pkey");
    return {
      ok: false,
      message: duplicate
        ? `The slug "${slug}" is already used by another article.`
        : "Could not save that article.",
    };
  }

  await recordAudit(
    user.email,
    existingSlug ? "update" : "create",
    "blog",
    slug,
    input.title,
    existingSlug ? diffFields(before as unknown as Record<string, unknown>, input) : null
  );

  updateTag(CACHE_TAGS.blogs);
  redirect("/admin/blogs?saved=1");
}

export async function deleteBlogAction(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  if (slug) {
    const blog = await adminGetBlog(slug);
    await deleteBlog(slug);
    await recordAudit(user.email, "delete", "blog", slug, blog?.title ?? slug, null);
    updateTag(CACHE_TAGS.blogs);
  }
  redirect("/admin/blogs?deleted=1");
}
