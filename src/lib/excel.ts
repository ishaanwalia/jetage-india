import "server-only";
import ExcelJS from "exceljs";
import { neon } from "@neondatabase/serverless";
import { slugify } from "./slugify";
import { cellText, paragraph, rupees, yesNo, list, specMap, specText } from "./excel-cells";

/**
 * The catalogue, as a spreadsheet round trip.
 *
 * **An upload never writes straight to the catalogue.** It is parsed into a
 * diff, a person reads the diff, and only then is it applied. One sheet with
 * the price column shifted by a row would otherwise reprice all 47 products
 * silently, and nobody would find out until a customer queried an invoice.
 *
 * Images are deliberately not in the sheet. A file path is not something
 * anyone can usefully type into Excel, and pasting the wrong one silently
 * swaps a product photo. Pictures stay in the CMS, where there is an uploader
 * and a preview.
 */

const sql = neon(process.env.DATABASE_URL!);

/** Column A is the id. It is what makes a row an edit rather than a new
 *  product, and why a blank id means "create". */
export const COLUMNS = [
  { key: "id", header: "id (do not edit)", width: 34 },
  { key: "sku", header: "SKU", width: 14 },
  { key: "hsn", header: "HSN", width: 12 },
  { key: "name", header: "Name", width: 44 },
  { key: "shortName", header: "Short name", width: 22 },
  { key: "category", header: "Category", width: 14 },
  { key: "subCategory", header: "Sub-category", width: 16 },
  { key: "price", header: "Price ₹", width: 11 },
  { key: "mrp", header: "MRP ₹", width: 11 },
  { key: "description", header: "Description", width: 60 },
  { key: "speed", header: "Speed", width: 24 },
  { key: "connectivity", header: "Connectivity (a | b)", width: 30 },
  { key: "duplex", header: "Duplex (yes/no)", width: 14 },
  { key: "dutyCycle", header: "Duty cycle", width: 18 },
  { key: "idealFor", header: "Ideal for", width: 16 },
  { key: "features", header: "Features (a | b)", width: 52 },
  { key: "specs", header: "Specs (Label: value | ...)", width: 70 },
  { key: "badge", header: "Badge", width: 16 },
  { key: "warranty", header: "Warranty", width: 12 },
  { key: "weight", header: "Weight", width: 12 },
  { key: "dimensions", header: "Dimensions", width: 22 },
  { key: "firstPageOut", header: "First page out", width: 20 },
  { key: "resolution", header: "Resolution", width: 22 },
  { key: "paperCapacity", header: "Paper capacity", width: 26 },
  { key: "mobilePrinting", header: "Mobile printing (a | b)", width: 30 },
  { key: "featured", header: "Featured (yes/no)", width: 15 },
  { key: "status", header: "Status", width: 12 },
] as const;

/** The fields a row can change. `id` is the key, not a value. */
type Field = Exclude<(typeof COLUMNS)[number]["key"], "id">;

export interface SheetRow {
  id: string | null;
  sku: string;
  hsn: string;
  name: string;
  shortName: string;
  category: string;
  subCategory: string;
  price: number | null;
  mrp: number | null;
  description: string;
  speed: string;
  connectivity: string[];
  duplex: boolean;
  dutyCycle: string;
  idealFor: string;
  features: string[];
  specs: Record<string, string>;
  badge: string;
  warranty: string;
  weight: string;
  dimensions: string;
  firstPageOut: string;
  resolution: string;
  paperCapacity: string;
  mobilePrinting: string[];
  featured: boolean;
  status: string;
}

/* ----------------------------------------------------------------- export -- */

export async function buildCatalogueWorkbook(): Promise<Buffer> {
  const [products, categories] = await Promise.all([
    sql`SELECT id, sku, hsn, name, short_name, category_id, sub_category, price, mrp, description,
               speed, connectivity, duplex, duty_cycle, ideal_for, features, specs, badge,
               warranty, weight, dimensions, first_page_out, resolution, paper_capacity,
               mobile_printing, featured, status, sort_order
        FROM products ORDER BY category_id, sort_order, name`,
    sql`SELECT id FROM categories ORDER BY sort_order`,
  ]);
  const rows = products as Record<string, never>[];
  const catIds = (categories as { id: string }[]).map((c) => c.id);

  const wb = new ExcelJS.Workbook();
  wb.creator = "Jetage India";
  wb.created = new Date();

  const ws = wb.addWorksheet("Catalogue", {
    // Freeze the header and the id column, so scrolling right across 26
    // columns still shows which product the row belongs to.
    views: [{ state: "frozen", ySplit: 1, xSplit: 1 }],
  });
  ws.columns = COLUMNS.map((c) => ({ key: c.key, header: c.header, width: c.width }));

  const header = ws.getRow(1);
  header.font = { bold: true, size: 10 };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8F4F8" } };
  header.alignment = { vertical: "middle" };
  header.height = 26;

  for (const r of rows) {
    ws.addRow({
      id: r.id,
      sku: r.sku ?? "",
      name: r.name,
      shortName: r.short_name ?? "",
      category: r.category_id,
      subCategory: r.sub_category ?? "",
      price: Number(r.price),
      mrp: Number(r.mrp),
      description: r.description ?? "",
      speed: r.speed ?? "",
      connectivity: (r.connectivity as unknown as string[] | null)?.join(" | ") ?? "",
      hsn: r.hsn ?? "",
      duplex: r.duplex ? "yes" : "no",
      dutyCycle: r.duty_cycle ?? "",
      idealFor: r.ideal_for ?? "",
      features: (r.features as unknown as string[] | null)?.join(" | ") ?? "",
      specs: specText(r.specs as unknown as Record<string, string>),
      badge: r.badge ?? "",
      warranty: r.warranty ?? "",
      weight: r.weight ?? "",
      dimensions: r.dimensions ?? "",
      firstPageOut: r.first_page_out ?? "",
      resolution: r.resolution ?? "",
      paperCapacity: r.paper_capacity ?? "",
      mobilePrinting: (r.mobile_printing as unknown as string[] | null)?.join(" | ") ?? "",
      featured: r.featured ? "yes" : "no",
      status: r.status,
    });
  }

  const lastRow = rows.length + 1;

  // Greyed rather than locked: Excel's protection does not survive a round trip
  // through every editor, so this is guidance. The importer validates anyway.
  ws.getColumn("id").font = { color: { argb: "FF9AA3B2" }, size: 9 };

  // Prices right-aligned with thousands separators, so a mistyped 252270 is
  // visibly wider than its neighbours rather than hiding in a column of digits.
  for (const key of ["price", "mrp"]) {
    const col = ws.getColumn(key);
    col.numFmt = "#,##0";
    col.alignment = { horizontal: "right" };
  }

  // The long free-text columns behave like the text boxes they actually are.
  for (const key of ["description", "features", "specs"]) {
    ws.getColumn(key).alignment = { wrapText: true, vertical: "top" };
  }
  ws.eachRow((row, i) => {
    if (i > 1) row.height = 46;
  });

  // Dropdowns on the columns where a typo silently breaks something: a
  // mistyped category orphans the product from its listing page, and a
  // mistyped status hides it from the site.
  const validations: Record<string, string[]> = {
    category: catIds,
    status: ["published", "draft"],
    duplex: ["yes", "no"],
    featured: ["yes", "no"],
  };
  // `dataValidations` is a real part of the ExcelJS API but is missing from
  // its bundled type definitions, so it needs naming explicitly rather than
  // being cast to `any`.
  const validator = (ws as unknown as {
    dataValidations: { add: (range: string, v: ExcelJS.DataValidation) => void };
  }).dataValidations;

  for (const [key, values] of Object.entries(validations)) {
    const letter = ws.getColumn(key).letter;
    // Applied to a RANGE, not cell by cell. Setting each cell individually
    // materialises every row it touches, so reserving headroom for new
    // products turned a 47-row sheet into a 247-row one, 200 of them blank.
    // A range covers the same span and creates nothing.
    validator.add(`${letter}2:${letter}${lastRow + 200}`, {
      type: "list",
      allowBlank: true,
      formulae: [`"${values.join(",")}"`],
      showErrorMessage: true,
      errorTitle: "Not a valid value",
      error: `Pick one of: ${values.join(", ")}`,
    });
  }

  ws.autoFilter = { from: "A1", to: { row: 1, column: COLUMNS.length } };

  /* -------- the instructions sheet -------- */
  const notes = wb.addWorksheet("How to use");
  notes.columns = [{ width: 110 }];
  const lines: [string, boolean][] = [
    ["Jetage catalogue — edit in Excel, then upload it back", true],
    ["", false],
    ["Nothing you do in this file changes the website until you upload it AND press Apply.", false],
    ["When you upload, you get a list of every change first. Read it, then apply it.", false],
    ["", false],
    ["Editing", true],
    ["• Change any cell EXCEPT column A (id). The id is how we match your row to the product.", false],
    ["• To ADD a product: add a row at the bottom and leave the id blank. Name, SKU, Category and Price are required.", false],
    ["• To HIDE a product: set Status to draft. Do not delete the row — deleting a row does nothing at all.", false],
    ["• Deleting a row is ignored on purpose. Past orders reference these products.", false],
    ["", false],
    ["Formats", true],
    ["• Prices are whole rupees, GST included. ₹ signs and commas are fine — 25,227 and ₹25227 both work.", false],
    ["• Lists use a pipe between items:   Wi-Fi | Ethernet | USB", false],
    ["• Specs use Label: value, separated by pipes:   Print Speed: 22 ppm | Duplex: Automatic", false],
    ["• Yes/no columns accept yes, no, y, n, true, false, 1, 0.", false],
    ["• Category and Status have dropdowns. Anything else is rejected with a reason.", false],
    ["• HSN is the tax code that prints on the invoice. Leave it blank rather than guessing — a wrong code is worse than none.", false],
    ["", false],
    ["Pictures", true],
    ["• Product images are NOT in this sheet, and cannot be changed from here.", false],
    ["• Upload them in the CMS: Products → open the product → Image. Everything else is editable here.", false],
  ];
  for (const [text, bold] of lines) {
    const row = notes.addRow([text]);
    if (bold) row.font = { bold: true, size: 11 };
  }

  return Buffer.from(await wb.xlsx.writeBuffer());
}

/* ----------------------------------------------------------------- import -- */

export type ChangeKind = "create" | "update" | "reject";

export type Change = {
  rowNo: number;
  kind: ChangeKind;
  productId: string | null;
  name: string;
  field?: string;
  before?: string;
  after?: string;
  reason?: string;
};

export type DryRun = {
  changes: Change[];
  rows: SheetRow[];
  summary: { create: number; update: number; reject: number; unchanged: number };
};

const asText = (v: unknown): string =>
  Array.isArray(v) ? v.join(" | ") : v === null || v === undefined ? "" : String(v);

/**
 * Reads the catalogue, then diffs the workbook against it.
 *
 * The database read and the diff are separate so the diff — which is where all
 * the edge cases live — can be tested against fixed rows without a connection.
 */
export async function dryRunImport(buffer: Buffer): Promise<DryRun> {
  const [existingRows, categoryRows] = await Promise.all([
    sql`SELECT id, sku, hsn, name, short_name, category_id, sub_category, price, mrp, description,
               speed, connectivity, duplex, duty_cycle, ideal_for, features, specs, badge,
               warranty, weight, dimensions, first_page_out, resolution, paper_capacity,
               mobile_printing, featured, status
        FROM products`,
    sql`SELECT id FROM categories`,
  ]);
  return diffWorkbook(
    buffer,
    existingRows as Record<string, never>[],
    (categoryRows as { id: string }[]).map((c) => c.id),
  );
}

/** The diff itself. Pure apart from the workbook parse — no database, no I/O. */
export async function diffWorkbook(
  buffer: Buffer,
  existing: Record<string, never>[],
  categoryIds: string[],
): Promise<DryRun> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer as unknown as ArrayBuffer);

  const ws = wb.getWorksheet("Catalogue") ?? wb.worksheets[0];
  if (!ws) throw new Error("That file has no worksheet in it.");

  // Headers are matched by name and mapped to their position, so a re-ordered
  // or partially deleted column set still lands in the right field instead of
  // shifting every value one to the left.
  const indexByKey = new Map<string, number>();
  ws.getRow(1).eachCell((cell, col) => {
    const text = cellText(cell.value).toLowerCase();
    const match = COLUMNS.find(
      (c) => c.header.toLowerCase() === text || c.key.toLowerCase() === text,
    );
    if (match) indexByKey.set(match.key, col);
  });

  for (const required of ["name", "sku", "category", "price"]) {
    if (!indexByKey.has(required)) {
      throw new Error(
        `This sheet has no "${required}" column. Download a fresh copy and edit that one.`,
      );
    }
  }

  const byId = new Map(existing.map((p) => [String(p.id), p]));
  const validCategories = new Set(categoryIds);
  const takenIds = new Set(existing.map((p) => String(p.id)));

  const changes: Change[] = [];
  const rows: SheetRow[] = [];
  const summary = { create: 0, update: 0, reject: 0, unchanged: 0 };
  const seenIds = new Set<string>();

  const get = (row: ExcelJS.Row, key: string) => {
    const col = indexByKey.get(key);
    return col ? cellText(row.getCell(col).value) : "";
  };

  ws.eachRow((row, rowNo) => {
    if (rowNo === 1) return;

    const id = get(row, "id").trim();
    const name = paragraph(get(row, "name"));
    // Not uppercased. HP's own SKUs are mixed case — CZ174A-Plus — and
    // normalising them here rewrote them in the database on an import that
    // changed nothing else.
    const sku = get(row, "sku").trim();

    // A row with nothing in it is not an error, it is Excel.
    if (!id && !name && !sku) return;

    const reject = (reason: string) => {
      changes.push({ rowNo, kind: "reject", productId: id || null, name: name || sku, reason });
      summary.reject++;
    };

    if (!name) return reject("No name.");

    const category = get(row, "category").trim().toLowerCase();
    if (!validCategories.has(category)) {
      return reject(
        `Category "${get(row, "category")}" does not exist. Use one of: ${[...validCategories].join(", ")}.`,
      );
    }

    const price = rupees(get(row, "price"));
    if (price === null) return reject(`Price "${get(row, "price")}" is not a number.`);
    const mrp = rupees(get(row, "mrp")) ?? price;
    if (mrp < price) {
      return reject(`MRP ₹${mrp} is below the selling price ₹${price}.`);
    }

    const prior = id ? byId.get(id) : undefined;
    if (id && !prior) {
      return reject(`No product has the id "${id}". Leave the id blank to create a new product.`);
    }

    // A duplicated id would otherwise apply twice, last write winning, with no
    // sign in the preview that two rows disagreed.
    const effectiveId = id || slugify(name);
    if (seenIds.has(effectiveId)) {
      return reject(`This product appears twice in the sheet (id "${effectiveId}").`);
    }
    if (!id && takenIds.has(effectiveId)) {
      return reject(
        `A product with the id "${effectiveId}" already exists. To edit it, use the exported sheet rather than adding a row.`,
      );
    }
    seenIds.add(effectiveId);

    const parsed: SheetRow = {
      id: id || null,
      sku,
      name,
      shortName: paragraph(get(row, "shortName")) || name,
      category,
      subCategory: get(row, "subCategory").trim().toLowerCase(),
      price,
      mrp,
      description: paragraph(get(row, "description")),
      hsn: paragraph(get(row, "hsn")),
      speed: paragraph(get(row, "speed")),
      connectivity: list(get(row, "connectivity")),
      duplex: yesNo(get(row, "duplex"), Boolean(prior?.duplex)),
      dutyCycle: paragraph(get(row, "dutyCycle")),
      idealFor: paragraph(get(row, "idealFor")),
      features: list(get(row, "features")),
      specs: specMap(get(row, "specs")),
      badge: paragraph(get(row, "badge")),
      warranty: paragraph(get(row, "warranty")),
      weight: paragraph(get(row, "weight")),
      dimensions: paragraph(get(row, "dimensions")),
      firstPageOut: paragraph(get(row, "firstPageOut")),
      resolution: paragraph(get(row, "resolution")),
      paperCapacity: paragraph(get(row, "paperCapacity")),
      mobilePrinting: list(get(row, "mobilePrinting")),
      featured: yesNo(get(row, "featured"), Boolean(prior?.featured)),
      status: get(row, "status").trim().toLowerCase() === "draft" ? "draft" : "published",
    };

    if (!prior) {
      rows.push(parsed);
      changes.push({
        rowNo,
        kind: "create",
        productId: effectiveId,
        name,
        after: `${category} · ₹${price}`,
      });
      summary.create++;
      return;
    }

    // Field-by-field, so the preview says which cell changed rather than
    // "this product was edited".
    const dbValue: Record<Field, unknown> = {
      sku: prior.sku, hsn: prior.hsn, name: prior.name, shortName: prior.short_name,
      category: prior.category_id, subCategory: prior.sub_category,
      price: Number(prior.price), mrp: Number(prior.mrp), description: prior.description,
      speed: prior.speed, connectivity: prior.connectivity, duplex: prior.duplex,
      dutyCycle: prior.duty_cycle, idealFor: prior.ideal_for, features: prior.features,
      specs: specText(prior.specs as unknown as Record<string, string>),
      badge: prior.badge, warranty: prior.warranty, weight: prior.weight,
      dimensions: prior.dimensions, firstPageOut: prior.first_page_out,
      resolution: prior.resolution, paperCapacity: prior.paper_capacity,
      mobilePrinting: prior.mobile_printing, featured: prior.featured, status: prior.status,
    };
    const newValue: Record<Field, unknown> = {
      sku: parsed.sku, hsn: parsed.hsn, name: parsed.name, shortName: parsed.shortName,
      category: parsed.category, subCategory: parsed.subCategory,
      price: parsed.price, mrp: parsed.mrp, description: parsed.description,
      speed: parsed.speed, connectivity: parsed.connectivity, duplex: parsed.duplex,
      dutyCycle: parsed.dutyCycle, idealFor: parsed.idealFor, features: parsed.features,
      specs: specText(parsed.specs), badge: parsed.badge, warranty: parsed.warranty,
      weight: parsed.weight, dimensions: parsed.dimensions, firstPageOut: parsed.firstPageOut,
      resolution: parsed.resolution, paperCapacity: parsed.paperCapacity,
      mobilePrinting: parsed.mobilePrinting, featured: parsed.featured, status: parsed.status,
    };

    let touched = false;
    for (const key of Object.keys(newValue) as Field[]) {
      const before = asText(dbValue[key]);
      const after = asText(newValue[key]);
      if (before === after) continue;
      touched = true;
      changes.push({ rowNo, kind: "update", productId: id, name, field: key, before, after });
    }

    if (touched) {
      rows.push(parsed);
      summary.update++;
    } else {
      summary.unchanged++;
    }
  });

  return { changes, rows, summary };
}

/* ------------------------------------------------------------------ apply -- */

/**
 * Writes an approved batch.
 *
 * Images are never touched: a create gets an empty image and someone adds it
 * in the CMS, and an update leaves whatever picture is already there.
 *
 * Each row's audit entry carries the field-by-field diff the operator
 * approved, in the same `{field: {from, to}}` shape the single-product editor
 * writes — so a bulk edit reads like any other edit on /admin/audit instead of
 * the bare "excel-import" marker it used to leave. The diff comes in from the
 * preview rather than being recomputed here: what gets recorded should be what
 * somebody actually read and pressed Apply on.
 *
 * ponytail: applied row by row rather than in one transaction, because the
 * HTTP driver has no interactive transaction and 47 upserts inside a single
 * CTE is worse to read than it is to re-run. A half-applied batch is visible
 * in the audit log and safe to re-apply, since every write is an upsert.
 */
export async function applyRows(
  rows: SheetRow[],
  actorEmail: string,
  changes: Change[],
): Promise<number> {
  // The preview's flat list, folded into one diff per product.
  const diffByProduct = new Map<string, Record<string, { from: string; to: string }>>();
  for (const c of changes) {
    if (c.kind !== "update" || !c.productId || !c.field) continue;
    const fields = diffByProduct.get(c.productId) ?? {};
    fields[c.field] = { from: c.before ?? "", to: c.after ?? "" };
    diffByProduct.set(c.productId, fields);
  }

  let written = 0;

  for (const r of rows) {
    const id = r.id ?? slugify(r.name);
    await sql`
      INSERT INTO products (
        id, sku, hsn, name, short_name, category_id, sub_category, price, mrp, description,
        speed, connectivity, duplex, duty_cycle, ideal_for, features, specs, badge,
        warranty, weight, dimensions, first_page_out, resolution, paper_capacity,
        mobile_printing, featured, status
      ) VALUES (
        ${id}, ${r.sku}, ${r.hsn}, ${r.name}, ${r.shortName}, ${r.category}, ${r.subCategory},
        ${r.price}, ${r.mrp}, ${r.description}, ${r.speed},
        ${JSON.stringify(r.connectivity)}::jsonb, ${r.duplex}, ${r.dutyCycle}, ${r.idealFor},
        ${JSON.stringify(r.features)}::jsonb, ${JSON.stringify(r.specs)}::jsonb,
        ${r.badge || null}, ${r.warranty || null}, ${r.weight || null}, ${r.dimensions || null},
        ${r.firstPageOut || null}, ${r.resolution || null}, ${r.paperCapacity || null},
        ${JSON.stringify(r.mobilePrinting)}::jsonb, ${r.featured}, ${r.status}
      )
      ON CONFLICT (id) DO UPDATE SET
        sku = excluded.sku, hsn = excluded.hsn, name = excluded.name, short_name = excluded.short_name,
        category_id = excluded.category_id, sub_category = excluded.sub_category,
        price = excluded.price, mrp = excluded.mrp, description = excluded.description,
        speed = excluded.speed, connectivity = excluded.connectivity, duplex = excluded.duplex,
        duty_cycle = excluded.duty_cycle, ideal_for = excluded.ideal_for,
        features = excluded.features, specs = excluded.specs, badge = excluded.badge,
        warranty = excluded.warranty, weight = excluded.weight, dimensions = excluded.dimensions,
        first_page_out = excluded.first_page_out, resolution = excluded.resolution,
        paper_capacity = excluded.paper_capacity, mobile_printing = excluded.mobile_printing,
        featured = excluded.featured, status = excluded.status, updated_at = now()
    `;

    // A create has no "before" worth recording — the row is the whole story.
    // An update carries the diff, and null rather than {} so the audit page's
    // "did anything change" check reads the same as it does for a CMS edit.
    const fields = diffByProduct.get(id);
    await sql`
      INSERT INTO audit_log (actor_email, action, resource, record_id, record_label, changes)
      VALUES (${actorEmail}, ${r.id ? "update" : "create"}, 'product', ${id}, ${r.name},
              ${fields && Object.keys(fields).length ? JSON.stringify(fields) : null}::jsonb)
    `;
    written++;
  }

  return written;
}
