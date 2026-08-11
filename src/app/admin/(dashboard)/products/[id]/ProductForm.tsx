"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { saveProductAction, deleteProductAction } from "../../../actions";
import { CheckboxField, Field, Fieldset, ImageField, ImageListField, SubmitBar, TextareaField } from "../../form-parts";
import type { CategoryInfo, Product } from "@/lib/cms";

export default function ProductForm({
  product,
  categories,
}: {
  product: Product | null;
  categories: CategoryInfo[];
}) {
  const [state, formAction, pending] = useActionState(saveProductAction, null);
  const isNew = !product;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/products"
        className="mb-6 inline-flex items-center gap-2 text-sm text-jet-text-muted transition-colors hover:text-jet-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-jet-text">
        {isNew ? "New product" : product.name}
      </h1>

      <form action={formAction} className="space-y-8">
        {product && <input type="hidden" name="existingId" value={product.id} />}

        <Fieldset legend="Basics">
          <Field label="Name" name="name" defaultValue={product?.name} required />
          <Field label="Short name" name="shortName" defaultValue={product?.shortName} hint="Used on cards and comparison tables." />
          {isNew && (
            <Field
              label="URL id"
              name="id"
              hint="Leave blank to generate from the name, e.g. hp-laser-303dw. Cannot be changed later."
            />
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-jet-text">
                Category
              </label>
              <select
                id="category"
                name="category"
                defaultValue={product?.category ?? categories[0]?.id}
                className="w-full rounded-xl border border-jet-border px-4 py-2.5 text-sm focus:border-jet-primary focus:outline-none focus:ring-2 focus:ring-jet-primary/20"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <Field label="Subcategory" name="subCategory" defaultValue={product?.subCategory} hint="e.g. laser, smart-tank, mouse" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Price (₹)" name="price" type="number" min="0" defaultValue={String(product?.price ?? 0)} required />
            <Field label="MRP (₹)" name="mrp" type="number" min="0" defaultValue={String(product?.mrp ?? 0)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="SKU" name="sku" defaultValue={product?.sku} />
            <Field label="Badge" name="badge" defaultValue={product?.badge ?? ""} hint="e.g. Best Seller. Leave blank for none." />
          </div>
          <TextareaField label="Description" name="description" rows={4} defaultValue={product?.description} />
        </Fieldset>

        <Fieldset legend="Specs">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Print speed" name="speed" defaultValue={product?.speed} hint="e.g. 22 ppm black / 18 ppm color" />
            <Field label="Monthly duty cycle" name="dutyCycle" defaultValue={product?.dutyCycle} hint="e.g. 20,000 pages/month" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ideal for" name="idealFor" defaultValue={product?.idealFor} hint="e.g. Home, Business, Enterprise" />
            <Field label="Warranty" name="warranty" defaultValue={product?.warranty ?? ""} />
          </div>
          <TextareaField
            label="Connectivity"
            name="connectivity"
            rows={2}
            defaultValue={product?.connectivity?.join("\n")}
            hint="One per line, e.g. Wi-Fi / Ethernet / USB"
          />
          <CheckboxField label="Auto duplex (two-sided printing)" name="duplex" defaultChecked={product?.duplex} />
          <TextareaField
            label="Features"
            name="features"
            rows={5}
            defaultValue={product?.features?.join("\n")}
            hint="One per line."
          />
          <TextareaField
            label="Specifications"
            name="specs"
            rows={6}
            defaultValue={Object.entries(product?.specs ?? {})
              .map(([k, v]) => `${k}: ${v}`)
              .join("\n")}
            hint="One per line, written as “Label: value”."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First page out" name="firstPageOut" defaultValue={product?.firstPageOut ?? ""} />
            <Field label="Resolution" name="resolution" defaultValue={product?.resolution ?? ""} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Paper capacity" name="paperCapacity" defaultValue={product?.paperCapacity ?? ""} />
            <Field label="Weight" name="weight" defaultValue={product?.weight ?? ""} />
          </div>
          <Field label="Dimensions" name="dimensions" defaultValue={product?.dimensions ?? ""} />
          <TextareaField
            label="Mobile printing"
            name="mobilePrinting"
            rows={2}
            defaultValue={product?.mobilePrinting?.join("\n")}
            hint="One per line, e.g. HP Smart App"
          />
        </Fieldset>

        <Fieldset legend="Images">
          <ImageField label="Main image" name="image" defaultValue={product?.image} />
          <ImageListField
            label="Gallery images"
            name="images"
            defaultValue={product?.images?.join("\n")}
            hint="One path or URL per line — uploading adds a new line."
          />
        </Fieldset>

        <Fieldset legend="Publishing">
          <div className="flex flex-wrap items-center gap-6">
            <CheckboxField label="Feature on the homepage" name="featured" defaultChecked={product?.featured} />

            <div className="flex items-center gap-2">
              <label htmlFor="status" className="text-sm text-jet-text">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={product?.status ?? "published"}
                className="rounded-xl border border-jet-border px-3 py-2 text-sm focus:border-jet-primary focus:outline-none"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </Fieldset>

        <SubmitBar
          pending={pending}
          error={state && !state.ok ? state.message : null}
          submitLabel={isNew ? "Create product" : "Save changes"}
          icon={<Save className="h-4 w-4" />}
        />
      </form>

      {product && (
        <form action={deleteProductAction} className="mt-10 border-t border-jet-border pt-6">
          <input type="hidden" name="id" value={product.id} />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Delete this product
          </button>
          <p className="mt-2 text-xs text-jet-text-muted">
            This removes it from the live site immediately and cannot be undone.
          </p>
        </form>
      )}
    </div>
  );
}
