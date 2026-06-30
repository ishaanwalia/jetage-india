# Jetage India — Image & 3D Model Guide

## CRITICAL DISCREPANCY FOUND

Most HP CDN URLs in `products.ts` are **404 Not Found**. The live site (jetageindia.in) currently serves broken images for ~80% of products because the fabricated sequential URLs (`c08107811.png` through `c08107864.png`) do not exist on HP's CDN.

Verified working URL:
- `https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c07989500.png` (Pavilion 15) ✅ 200

Verified broken URLs:
- `c08107811.png`, `c08107847.png`, `c08107813.png` etc. ❌ 404

## RECOMMENDED IMAGE FOLDER STRUCTURE

```
public/
├── images/
│   ├── products/              # Product photos (primary source)
│   │   ├── printers/
│   │   │   ├── hp-laser-303d/
│   │   │   │   ├── front.png     # 800x600 max, WebP preferred
│   │   │   │   ├── side.png
│   │   │   │   └── thumbnail.png # 400x300 for cards
│   │   │   ├── hp-laser-303dw/
│   │   │   │   ├── front.png
│   │   │   │   └── thumbnail.png
│   │   │   └── ... (one folder per product ID)
│   │   ├── laptops/
│   │   │   ├── hp-pavilion-15-eg3000/
│   │   │   └── ...
│   │   ├── desktops/
│   │   ├── monitors/
│   │   └── accessories/
│   ├── hero/
│   │   ├── hero-omnibook.webp      # 1200x900 for hero card
│   │   └── hero-showroom.webp
│   ├── showroom/
│   │   ├── showroom-interior-1.webp
│   │   └── showroom-interior-2.webp
│   ├── blog/
│   │   ├── printer-buying-guide-2026.webp
│   │   └── ...
│   └── og-image.jpg              # 1200x630 (PENDING)
├── FaviconJ.png
└── LogoJ.png
```

### Why This Structure?

1. **Product ID folders** match the `id` field in `products.ts` — makes programmatic lookup trivial
2. **Consistent naming** (`front.png`, `side.png`, `thumbnail.png`) lets `ProductImage3D` cycle predictably
3. **WebP format** reduces file size by 60-80% vs JPEG for product photos
4. **Local images** = no 404s, no third-party dependency, faster LCP

### Updating `products.ts`

Change image paths from:
```ts
image: "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08107811.png",
images: [
  "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08107811.png",
  "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08107812.png",
],
```

To:
```ts
image: "/images/products/printers/hp-laser-303d/thumbnail.webp",
images: [
  "/images/products/printers/hp-laser-303d/front.webp",
  "/images/products/printers/hp-laser-303d/side.webp",
],
```

Next.js `<Image>` will auto-optimize local images with `/_next/image`.

## HOW TO GET REAL PRODUCT PHOTOS

### Option A: HP Official Product Pages (Free)
1. Go to `https://www.hp.com/in-en/shop/product/hp-laser-303d-printer/A58WFA`
2. Right-click the product image → "Open image in new tab"
3. HP usually serves high-res images from `ssl-product-images.www8-hp.com`
4. The URL pattern is: `https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/{SKU_CODE}.png`
5. Find the correct SKU code by inspecting the page or searching HP's product database

### Option B: HP Press/Media Asset Library
- HP has a media kit for each product
- Search `"HP [product name] media kit"` or `"HP [product name] press images"`
- Download high-res PNGs, convert to WebP

### Option C: Screenshot from HP Store (Quick & Dirty)
- Screenshot product images from `hp.com/in-en/shop/`
- Use `https://squoosh.app/` to compress to WebP
- Recommended settings: WebP, quality 75, 800x600 max

### Option D: Commission a Photographer (Best for Showroom)
- Hire a local Chandigarh product photographer
- Shoot all 28 products in a single day (~₹8,000-15,000)
- Get consistent white-background shots + lifestyle shots

## SAM 3D / 3D MODEL INTEGRATION ROADMAP

### What You Probably Mean by "SAM 3D"

"SAM" likely refers to **Meta's Segment Anything Model** (SAM), which can isolate objects from photos. Combined with 3D reconstruction, it lets you create interactive 3D product viewers from simple photos. However, for an e-commerce site, the **practical approach** is:

### Recommended Approach: React Three Fiber + GLB Models

Your stack already includes Three.js. Add these packages:

```bash
npm install @react-three/fiber @react-three/drei three
npm install -D @types/three
```

Then create a `ProductModel3D` component that loads `.glb` or `.gltf` files:

```tsx
// src/components/ProductModel3D.tsx
"use client";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

export function ProductModel3D({ modelUrl }: { modelUrl: string }) {
  return (
    <div className="w-full h-[400px]">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <Suspense fallback={null}>
          <Model url={modelUrl} />
          <OrbitControls autoRotate autoRotateSpeed={2} />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

Store models in `public/models/`:
```
public/models/
├── hp-laser-303d.glb
├── hp-pavilion-15.glb
└── ...
```

### Where to Get 3D Models

1. **HP Official 3D Assets** (ideal but rare):
   - Contact HP India marketing: `marketing.india@hp.com`
   - Ask for GLB/GLTF models for Authorized Partners

2. **Sketchfab / CGTrader** (paid, ~$20-50/model):
   - Search "HP printer 3D model" or "laptop 3D model"
   - Download GLB format

3. **AI 3D Generation (Experimental)**:
   - **Tripo3D** (`tripo3d.ai`) — upload 2-3 product photos, get a GLB model in minutes
   - **CSM (Common Sense Machines)** — similar photo-to-3D pipeline
   - **Meshy** — text/image to 3D

4. **Photogrammetry** (DIY):
   - Take 50-80 photos of a product from all angles
   - Use **Meshroom** (free, AliceVision) or **RealityScan** (Epic Games, free)
   - Export to GLB

### Simpler Alternative: "Fake 3D" with Multi-Angle Images

If true 3D models are too expensive, upgrade `ProductImage3D` to show **24 frames** of a product rotating on a turntable. This creates a convincing 3D effect without needing 3D models:

```
public/images/products/hp-laser-303d/
├── frame-01.webp
├── frame-02.webp
├── ...
└── frame-24.webp
```

The `ProductImage3D` carousel can cycle these frames based on mouse X position, giving a "drag to rotate" feel. This is what Apple does on their product pages.

### Phase 1 Implementation (Do This Next)

1. Download real product photos for all 28 products
2. Convert to WebP, store in `public/images/products/`
3. Update `products.ts` to use local paths
4. Create `public/og-image.jpg` (1200x630) — Canva template with logo + tagline
5. Add `public/og-image.jpg` to the repo and deploy

### Phase 2 (After Photos)

1. Add 3D models for 3 flagship products (OmniBook X, OMEN 16, Laser 303dw)
2. Create `ProductModel3D` component
3. Add "View in 3D" toggle on product detail pages

## OG IMAGE REQUIREMENTS

Create `public/og-image.jpg` (1200x630 px):
- Background: dark navy (#0f172a) or light (#fafbfc) matching your theme
- Left side: Jetage logo + "Authorized HP World Partner Since 1989"
- Right side: Collage of 3-4 product photos (printer, laptop, desktop)
- Bottom: SCO-12, Sector-17-E, Chandigarh | WhatsApp +91 98149 58295
- Use Canva or Figma; keep file under 200KB

## QUICK WINS CHECKLIST

- [ ] Fix broken HP CDN URLs → download real images
- [ ] Create `public/images/products/` folder structure
- [ ] Generate `public/og-image.jpg` (1200x630)
- [ ] Add `loading="lazy"` to all product images below the fold (already done via Next.js Image)
- [ ] Compress all images to WebP with Squoosh
- [ ] Test every product image URL with `curl -I` before committing
