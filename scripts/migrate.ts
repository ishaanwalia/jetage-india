/**
 * One-shot migration: create the schema and move the hardcoded catalogue into
 * Neon.
 *
 * Run with:  npm run db:migrate
 *
 * Safe to re-run. Every insert is an upsert keyed on the product id / blog
 * slug, so re-running syncs the database back to whatever the TypeScript
 * files say without duplicating rows.
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { scryptSync, randomBytes } from "node:crypto";
import path from "node:path";

import { products, categories } from "../src/lib/data/products";
import { blogPosts } from "../src/lib/data/blogs";

for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2];
}

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL missing from .env.local");

const sql = neon(connectionString);

/** Splits the schema file into single statements — the HTTP driver sends one at a time. */
function statements(file: string): string[] {
  return readFileSync(file, "utf8")
    .split(/;\s*$/m)
    .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
    .filter(Boolean);
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

// The old getFeaturedProducts() picked on badge; carry that forward as a
// real column so an editor can feature anything without needing a badge.
const featuredBadges = new Set([
  "Best Seller", "Popular", "Enterprise", "Flagship", "India's Favorite",
  "Value Pick", "Pro Grade", "Home Essential", "Color Choice",
]);

async function main() {
  console.log("→ applying schema");
  for (const statement of statements(path.join("scripts", "schema.sql"))) {
    await sql.query(statement);
  }

  console.log(`→ seeding ${categories.length} categories`);
  for (const [i, category] of categories.entries()) {
    await sql`
      insert into categories (id, name, icon, description, sort_order)
      values (${category.id}, ${category.name}, ${category.icon}, ${category.description}, ${i})
      on conflict (id) do update set
        name = excluded.name,
        icon = excluded.icon,
        description = excluded.description,
        sort_order = excluded.sort_order,
        updated_at = now()
    `;
  }

  console.log(`→ seeding ${products.length} products`);
  for (const [i, p] of products.entries()) {
    await sql`
      insert into products (
        id, name, short_name, category_id, sub_category, price, mrp, sku, speed,
        connectivity, duplex, duty_cycle, ideal_for, description, features,
        image, images, badge, specs, warranty, weight, dimensions,
        first_page_out, resolution, paper_capacity, mobile_printing,
        sort_order, featured, status
      ) values (
        ${p.id}, ${p.name}, ${p.shortName}, ${p.category}, ${p.subCategory},
        ${Math.round(p.price)}, ${Math.round(p.mrp)}, ${p.sku}, ${p.speed},
        ${JSON.stringify(p.connectivity ?? [])}::jsonb, ${p.duplex}, ${p.dutyCycle}, ${p.idealFor},
        ${p.description}, ${JSON.stringify(p.features ?? [])}::jsonb,
        ${p.image}, ${JSON.stringify(p.images ?? [])}::jsonb, ${p.badge ?? null},
        ${JSON.stringify(p.specs ?? {})}::jsonb, ${p.warranty ?? null}, ${p.weight ?? null},
        ${p.dimensions ?? null}, ${p.firstPageOut ?? null}, ${p.resolution ?? null},
        ${p.paperCapacity ?? null}, ${JSON.stringify(p.mobilePrinting ?? [])}::jsonb,
        ${i}, ${Boolean(p.badge && featuredBadges.has(p.badge))}, 'published'
      )
      on conflict (id) do update set
        name = excluded.name,
        short_name = excluded.short_name,
        category_id = excluded.category_id,
        sub_category = excluded.sub_category,
        price = excluded.price,
        mrp = excluded.mrp,
        sku = excluded.sku,
        speed = excluded.speed,
        connectivity = excluded.connectivity,
        duplex = excluded.duplex,
        duty_cycle = excluded.duty_cycle,
        ideal_for = excluded.ideal_for,
        description = excluded.description,
        features = excluded.features,
        image = excluded.image,
        images = excluded.images,
        badge = excluded.badge,
        specs = excluded.specs,
        warranty = excluded.warranty,
        weight = excluded.weight,
        dimensions = excluded.dimensions,
        first_page_out = excluded.first_page_out,
        resolution = excluded.resolution,
        paper_capacity = excluded.paper_capacity,
        mobile_printing = excluded.mobile_printing,
        sort_order = excluded.sort_order,
        featured = excluded.featured,
        updated_at = now()
    `;
  }

  console.log(`→ seeding ${blogPosts.length} blogs`);
  for (const b of blogPosts) {
    const publishedAt = new Date(b.date).toISOString().slice(0, 10);
    await sql`
      insert into blogs (slug, title, meta_description, excerpt, content, category, author,
                         published_at, read_time, tags, status)
      values (${b.slug}, ${b.title}, ${b.metaDescription}, ${b.excerpt}, ${b.content},
              ${b.category}, ${b.author}, ${publishedAt}, ${b.readTime},
              ${JSON.stringify(b.tags ?? [])}::jsonb, 'published')
      on conflict (slug) do update set
        title = excluded.title,
        meta_description = excluded.meta_description,
        excerpt = excluded.excerpt,
        content = excluded.content,
        category = excluded.category,
        author = excluded.author,
        published_at = excluded.published_at,
        read_time = excluded.read_time,
        tags = excluded.tags,
        updated_at = now()
    `;
  }

  // Seed the first admin only if none exists, so re-running never resets a
  // password the owner has since changed.
  const [{ count }] = await sql`select count(*)::int as count from admin_users`;
  if (count === 0) {
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
      console.log("! no admin user created — set ADMIN_PASSWORD in .env.local and re-run");
    } else {
      const email = process.env.ADMIN_EMAIL ?? "info@jetageindia.in";
      await sql`
        insert into admin_users (email, password_hash, name)
        values (${email}, ${hashPassword(password)}, 'Jetage Admin')
      `;
      console.log(`→ admin created: ${email}`);
    }
  }

  const [counts] = await sql`
    select (select count(*) from categories) as categories,
           (select count(*) from products)   as products,
           (select count(*) from blogs)      as blogs
  `;
  console.log("✓ migrated:", counts);
}

main().catch((err) => {
  console.error("migration failed:", err);
  process.exit(1);
});
