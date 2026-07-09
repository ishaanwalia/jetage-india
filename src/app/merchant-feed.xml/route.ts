import { products } from "@/lib/data/products";

const BASE_URL = "https://www.jetageindia.in";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Google Merchant Center product feed (RSS 2.0 with g: namespace).
// Register at https://merchants.google.com and add this URL as a scheduled fetch feed.
export async function GET() {
  const items = products
    .map((product) => {
      const brand = product.id.startsWith("hyperx") ? "HyperX" : "HP";
      const category =
        product.category === "printer"
          ? "Electronics > Print, Copy, Scan & Fax > Printers, Copiers & Fax Machines"
          : "Electronics > Electronics Accessories";
      return `    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.description)}</g:description>
      <g:link>${BASE_URL}/products/${product.id}/</g:link>
      <g:image_link>${BASE_URL}${product.image}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${product.price}.00 INR</g:price>
      <g:brand>${brand}</g:brand>
      <g:mpn>${escapeXml(product.sku)}</g:mpn>
      <g:condition>new</g:condition>
      <g:google_product_category>${escapeXml(category)}</g:google_product_category>
      <g:identifier_exists>yes</g:identifier_exists>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Jetage India Product Feed</title>
    <link>${BASE_URL}</link>
    <description>Genuine HP printers and accessories from Jetage India, Authorized HP World Partner in Chandigarh since 1989.</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
