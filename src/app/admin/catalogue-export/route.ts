import { getCurrentUser } from "@/lib/auth";
import { buildCatalogueWorkbook } from "@/lib/excel";

/** The catalogue as .xlsx. Admin only — it is the whole price list. */
export async function GET() {
  if (!(await getCurrentUser())) return new Response("Unauthorized", { status: 401 });

  const buffer = await buildCatalogueWorkbook();
  const date = new Date().toISOString().slice(0, 10);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="jetage-catalogue-${date}.xlsx"`,
      "cache-control": "no-store",
    },
  });
}
