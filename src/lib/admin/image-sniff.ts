/**
 * What a file actually is, read from its own bytes — not from `file.type`,
 * which is just whatever Content-Type the uploading browser claimed for the
 * form field, and a crafted multipart request can set that to anything
 * regardless of the real content. Checked against the same five magic
 * numbers browsers themselves use for content sniffing, so this can only
 * ever agree with one of the five image types the CMS upload route allows —
 * never "recognize" some other type it doesn't handle.
 */
export async function sniffImageType(file: Blob): Promise<string | null> {
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const at = (offset: number, ...bytes: number[]) => bytes.every((b, i) => head[offset + i] === b);

  if (at(0, 0xff, 0xd8, 0xff)) return "image/jpeg";
  if (at(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (at(0, 0x47, 0x49, 0x46, 0x38)) return "image/gif";
  if (at(0, 0x52, 0x49, 0x46, 0x46) && at(8, 0x57, 0x45, 0x42, 0x50)) return "image/webp";
  if (at(4, 0x66, 0x74, 0x79, 0x70) && (at(8, 0x61, 0x76, 0x69, 0x66) || at(8, 0x61, 0x76, 0x69, 0x73))) {
    return "image/avif";
  }
  return null;
}
