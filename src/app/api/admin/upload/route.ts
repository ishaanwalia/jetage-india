import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { sniffImageType } from "@/lib/admin/image-sniff";
import { slugify } from "@/lib/slugify";

/**
 * CMS image upload.
 *
 * The picture is converted to WebP **in the browser** before it gets here —
 * see the ImageField component in the admin product/blog forms. That is
 * deliberate: next/image already re-encodes to AVIF/WebP on delivery, so a
 * server-side pass would only be saving blob storage — and a canvas does
 * that for free, on the editor's machine, before a multi-MB phone photo ever
 * crosses a slow connection.
 *
 * Everything below is the trust boundary: signed-in admin, known image type,
 * capped size, and a filename we generate rather than one the client picked.
 */

const MAX_BYTES = 8 * 1024 * 1024;

// No SVG: next/image refuses to optimize it without dangerouslyAllowSVG, so an
// uploaded image would render broken even though the upload "worked".
const ALLOWED = new Set(["image/webp", "image/jpeg", "image/png", "image/gif", "image/avif"]);

const EXTENSIONS: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/avif": "avif",
};

export async function POST(request: Request): Promise<NextResponse> {
  const admin = await getCurrentUser();
  if (!admin) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No picture was sent." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "That file isn't a picture we can use." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "That picture is over 8 MB. Try a smaller one." }, { status: 413 });
  }

  // The declared type only decides what error message to show if it's
  // obviously wrong. What actually gets stored, and the Content-Type it's
  // served with, comes from the real bytes.
  const actualType = await sniffImageType(file);
  if (!actualType || !ALLOWED.has(actualType)) {
    return NextResponse.json({ error: "That file isn't a picture we can use." }, { status: 415 });
  }

  const stem = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
  const blob = await put(`cms/${stem}.${EXTENSIONS[actualType]}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: actualType,
  });

  return NextResponse.json({ url: blob.url });
}
