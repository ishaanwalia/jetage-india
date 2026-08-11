import "server-only";
import { neon } from "@neondatabase/serverless";
import { unstable_cache } from "next/cache";

/**
 * Database access for the catalogue and the blog.
 *
 * Reads are wrapped in `unstable_cache` and tagged, so pages render from the
 * Next.js data cache and only hit Neon when a tag is revalidated. The CMS
 * calls `updateTag`/`revalidateTag` on every write, which is what makes an
 * edit appear on the live site within a second without a redeploy.
 *
 * `server-only` at the top means importing this from a client component is a
 * build error rather than a leaked connection string.
 */

const sql = neon(process.env.DATABASE_URL!);

export const CACHE_TAGS = {
  products: "products",
  blogs: "blogs",
  categories: "categories",
} as const;

/* ------------------------------------------------------------------ *
 * Types — match the shape src/lib/data/products.ts and blogs.ts used to
 * export, so every existing component keeps working unchanged.
 * ------------------------------------------------------------------ */

export interface Product {
  id: string;
  name: string;
  shortName: string;
  category: string;
  subCategory: string;
  price: number;
  mrp: number;
  sku: string;
  speed: string;
  connectivity: string[];
  duplex: boolean;
  dutyCycle: string;
  idealFor: string;
  description: string;
  features: string[];
  image: string;
  images: string[];
  badge?: string;
  specs?: Record<string, string>;
  warranty?: string;
  weight?: string;
  dimensions?: string;
  firstPageOut?: string;
  resolution?: string;
  paperCapacity?: string;
  mobilePrinting?: string[];
  featured?: boolean;
  status?: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featured?: boolean;
  coverImage?: string | null;
  status?: string;
}

type ProductRow = {
  id: string;
  name: string;
  short_name: string;
  category_id: string;
  sub_category: string;
  price: number;
  mrp: number;
  sku: string;
  speed: string;
  connectivity: string[];
  duplex: boolean;
  duty_cycle: string;
  ideal_for: string;
  description: string;
  features: string[];
  image: string;
  images: string[];
  badge: string | null;
  specs: Record<string, string>;
  warranty: string | null;
  weight: string | null;
  dimensions: string | null;
  first_page_out: string | null;
  resolution: string | null;
  paper_capacity: string | null;
  mobile_printing: string[];
  featured: boolean;
  status: string;
};

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    shortName: row.short_name,
    category: row.category_id,
    subCategory: row.sub_category,
    price: row.price,
    mrp: row.mrp,
    sku: row.sku,
    speed: row.speed,
    connectivity: row.connectivity ?? [],
    duplex: row.duplex,
    dutyCycle: row.duty_cycle,
    idealFor: row.ideal_for,
    description: row.description,
    features: row.features ?? [],
    image: row.image,
    images: row.images ?? [],
    badge: row.badge ?? undefined,
    specs: row.specs ?? {},
    warranty: row.warranty ?? undefined,
    weight: row.weight ?? undefined,
    dimensions: row.dimensions ?? undefined,
    firstPageOut: row.first_page_out ?? undefined,
    resolution: row.resolution ?? undefined,
    paperCapacity: row.paper_capacity ?? undefined,
    mobilePrinting: row.mobile_printing ?? undefined,
    featured: row.featured,
    status: row.status,
  };
}

type BlogRow = {
  slug: string;
  title: string;
  meta_description: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  published_at: string | Date;
  read_time: string;
  tags: string[];
  featured: boolean;
  cover_image: string | null;
  status: string;
};

function toBlog(row: BlogRow): BlogPost {
  const published = row.published_at instanceof Date ? row.published_at : new Date(row.published_at);
  return {
    id: row.slug,
    slug: row.slug,
    title: row.title,
    metaDescription: row.meta_description,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    author: row.author,
    date: published.toISOString().slice(0, 10),
    readTime: row.read_time,
    tags: row.tags ?? [],
    featured: row.featured,
    coverImage: row.cover_image,
    status: row.status,
  };
}

/* ------------------------------------------------------------------ *
 * Catalogue reads
 * ------------------------------------------------------------------ */

export const getCategories = unstable_cache(
  async (): Promise<CategoryInfo[]> => {
    const rows = (await sql`
      select c.id, c.name, c.icon, c.description,
             count(p.id) filter (where p.status = 'published')::int as count
      from categories c
      left join products p on p.category_id = c.id
      group by c.id
      order by c.sort_order
    `) as CategoryInfo[];
    return rows;
  },
  ["categories"],
  { tags: [CACHE_TAGS.categories, CACHE_TAGS.products] }
);

export const getProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const rows = (await sql`
      select * from products where status = 'published' order by sort_order, name
    `) as ProductRow[];
    return rows.map(toProduct);
  },
  ["products-all"],
  { tags: [CACHE_TAGS.products] }
);

export const getProductBySlug = unstable_cache(
  async (id: string): Promise<Product | null> => {
    const rows = (await sql`
      select * from products where id = ${id} and status = 'published' limit 1
    `) as ProductRow[];
    return rows[0] ? toProduct(rows[0]) : null;
  },
  ["product-by-id"],
  { tags: [CACHE_TAGS.products] }
);

export const getFeaturedProducts = unstable_cache(
  async (limit = 6): Promise<Product[]> => {
    const rows = (await sql`
      select * from products
      where status = 'published' and featured
      order by sort_order, name
      limit ${limit}
    `) as ProductRow[];
    return rows.map(toProduct);
  },
  ["products-featured"],
  { tags: [CACHE_TAGS.products] }
);

/** Ids for generateStaticParams — published only, so drafts stay unlinked. */
export async function getProductIds(): Promise<string[]> {
  const rows = (await sql`select id from products where status = 'published'`) as { id: string }[];
  return rows.map((r) => r.id);
}

/* ------------------------------------------------------------------ *
 * Blog reads
 * ------------------------------------------------------------------ */

export const getBlogs = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const rows = (await sql`
      select * from blogs where status = 'published' order by published_at desc
    `) as BlogRow[];
    return rows.map(toBlog);
  },
  ["blogs-all"],
  { tags: [CACHE_TAGS.blogs] }
);

export const getBlogBySlug = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    const rows = (await sql`
      select * from blogs where slug = ${slug} and status = 'published' limit 1
    `) as BlogRow[];
    return rows[0] ? toBlog(rows[0]) : null;
  },
  ["blog-by-slug"],
  { tags: [CACHE_TAGS.blogs] }
);

export async function getBlogSlugs(): Promise<string[]> {
  const rows = (await sql`select slug from blogs where status = 'published'`) as { slug: string }[];
  return rows.map((r) => r.slug);
}

/* ------------------------------------------------------------------ *
 * Admin reads — include drafts
 * ------------------------------------------------------------------ */

export async function adminListProducts(search = ""): Promise<Product[]> {
  const rows = (
    search
      ? await sql`
          select * from products
          where search_vector @@ websearch_to_tsquery('english', ${search})
             or name ilike ${"%" + search + "%"}
             or sku ilike ${"%" + search + "%"}
          order by ts_rank(search_vector, websearch_to_tsquery('english', ${search})) desc, name
          limit 200
        `
      : await sql`select * from products order by name limit 200`
  ) as ProductRow[];
  return rows.map(toProduct);
}

export async function adminGetProduct(id: string): Promise<Product | null> {
  const rows = (await sql`select * from products where id = ${id}`) as ProductRow[];
  return rows[0] ? toProduct(rows[0]) : null;
}

export async function adminListBlogs(): Promise<BlogPost[]> {
  const rows = (await sql`select * from blogs order by published_at desc`) as BlogRow[];
  return rows.map(toBlog);
}

export async function adminGetBlog(slug: string): Promise<BlogPost | null> {
  const rows = (await sql`select * from blogs where slug = ${slug}`) as BlogRow[];
  return rows[0] ? toBlog(rows[0]) : null;
}

export async function getDashboardStats() {
  const [stats] = (await sql`
    select
      (select count(*) from products)                             as products,
      (select count(*) from products where status = 'draft')      as product_drafts,
      (select count(*) from products where featured)              as featured,
      (select count(*) from blogs)                                as blogs,
      (select count(*) from blogs where status = 'draft')         as blog_drafts,
      (select count(*) from categories)                           as categories
  `) as Record<string, string>[];
  return stats;
}

/* ------------------------------------------------------------------ *
 * Writes
 * ------------------------------------------------------------------ */

export type ProductInput = {
  id: string;
  name: string;
  shortName: string;
  category: string;
  subCategory: string;
  price: number;
  mrp: number;
  sku: string;
  speed: string;
  connectivity: string[];
  duplex: boolean;
  dutyCycle: string;
  idealFor: string;
  description: string;
  features: string[];
  image: string;
  images: string[];
  badge: string | null;
  specs: Record<string, string>;
  warranty: string | null;
  weight: string | null;
  dimensions: string | null;
  firstPageOut: string | null;
  resolution: string | null;
  paperCapacity: string | null;
  mobilePrinting: string[];
  featured: boolean;
  status: string;
};

export async function saveProduct(existingId: string | null, input: ProductInput) {
  const json = {
    connectivity: JSON.stringify(input.connectivity),
    features: JSON.stringify(input.features),
    images: JSON.stringify(input.images),
    specs: JSON.stringify(input.specs),
    mobilePrinting: JSON.stringify(input.mobilePrinting),
  };

  if (existingId) {
    await sql`
      update products set
        name = ${input.name}, short_name = ${input.shortName}, category_id = ${input.category},
        sub_category = ${input.subCategory}, price = ${input.price}, mrp = ${input.mrp},
        sku = ${input.sku}, speed = ${input.speed},
        connectivity = ${json.connectivity}::jsonb, duplex = ${input.duplex},
        duty_cycle = ${input.dutyCycle}, ideal_for = ${input.idealFor},
        description = ${input.description}, features = ${json.features}::jsonb,
        image = ${input.image}, images = ${json.images}::jsonb, badge = ${input.badge},
        specs = ${json.specs}::jsonb, warranty = ${input.warranty}, weight = ${input.weight},
        dimensions = ${input.dimensions}, first_page_out = ${input.firstPageOut},
        resolution = ${input.resolution}, paper_capacity = ${input.paperCapacity},
        mobile_printing = ${json.mobilePrinting}::jsonb,
        featured = ${input.featured}, status = ${input.status}, updated_at = now()
      where id = ${existingId}
    `;
    return existingId;
  }

  await sql`
    insert into products (
      id, name, short_name, category_id, sub_category, price, mrp, sku, speed,
      connectivity, duplex, duty_cycle, ideal_for, description, features,
      image, images, badge, specs, warranty, weight, dimensions,
      first_page_out, resolution, paper_capacity, mobile_printing, featured, status
    ) values (
      ${input.id}, ${input.name}, ${input.shortName}, ${input.category}, ${input.subCategory},
      ${input.price}, ${input.mrp}, ${input.sku}, ${input.speed},
      ${json.connectivity}::jsonb, ${input.duplex}, ${input.dutyCycle}, ${input.idealFor},
      ${input.description}, ${json.features}::jsonb, ${input.image}, ${json.images}::jsonb,
      ${input.badge}, ${json.specs}::jsonb, ${input.warranty}, ${input.weight}, ${input.dimensions},
      ${input.firstPageOut}, ${input.resolution}, ${input.paperCapacity},
      ${json.mobilePrinting}::jsonb, ${input.featured}, ${input.status}
    )
  `;
  return input.id;
}

export async function deleteProduct(id: string) {
  await sql`delete from products where id = ${id}`;
}

export type BlogInput = {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  featured: boolean;
  coverImage: string | null;
  status: string;
};

export async function saveBlog(existingSlug: string | null, input: BlogInput) {
  const tags = JSON.stringify(input.tags);

  if (existingSlug) {
    await sql`
      update blogs set
        slug = ${input.slug}, title = ${input.title}, meta_description = ${input.metaDescription},
        excerpt = ${input.excerpt}, content = ${input.content}, category = ${input.category},
        author = ${input.author}, published_at = ${input.date}::date, read_time = ${input.readTime},
        tags = ${tags}::jsonb, featured = ${input.featured},
        cover_image = ${input.coverImage}, status = ${input.status}, updated_at = now()
      where slug = ${existingSlug}
    `;
    return input.slug;
  }

  await sql`
    insert into blogs (slug, title, meta_description, excerpt, content, category, author,
      published_at, read_time, tags, featured, cover_image, status)
    values (${input.slug}, ${input.title}, ${input.metaDescription}, ${input.excerpt}, ${input.content},
      ${input.category}, ${input.author}, ${input.date}::date, ${input.readTime},
      ${tags}::jsonb, ${input.featured}, ${input.coverImage}, ${input.status})
  `;
  return input.slug;
}

export async function deleteBlog(slug: string) {
  await sql`delete from blogs where slug = ${slug}`;
}

/* ------------------------------------------------------------------ *
 * Audit log — append-only record of every admin create/update/delete.
 * ------------------------------------------------------------------ */

export type AuditAction = "create" | "update" | "delete";
export type AuditResource = "product" | "blog";
export type AuditChanges = Record<string, { from: unknown; to: unknown }>;

export async function recordAudit(
  actorEmail: string,
  action: AuditAction,
  resource: AuditResource,
  recordId: string,
  recordLabel: string,
  changes: AuditChanges | null
) {
  await sql`
    insert into audit_log (actor_email, action, resource, record_id, record_label, changes)
    values (${actorEmail}, ${action}, ${resource}, ${recordId}, ${recordLabel},
            ${changes ? JSON.stringify(changes) : null}::jsonb)
  `;
}

/** Field-by-field diff for the audit log — only changed keys are recorded. */
export function diffFields<T extends Record<string, unknown>>(
  before: T | null,
  after: T
): AuditChanges {
  const changes: AuditChanges = {};
  for (const key of Object.keys(after)) {
    const a = before ? before[key] : undefined;
    const b = after[key];
    if (JSON.stringify(a ?? null) !== JSON.stringify(b ?? null)) {
      changes[key] = { from: a ?? null, to: b ?? null };
    }
  }
  return changes;
}

export type AuditEntry = {
  id: number;
  actor_email: string;
  action: AuditAction;
  resource: AuditResource;
  record_id: string;
  record_label: string;
  changes: AuditChanges | null;
  created_at: string;
};

export async function getAuditLog(limit = 200): Promise<AuditEntry[]> {
  return (await sql`
    select * from audit_log order by created_at desc limit ${limit}
  `) as AuditEntry[];
}
