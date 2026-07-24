// One-time build asset pipeline: recompress public/products/*.png to WebP.
// Static export (images.unoptimized: true) means Next never touches these
// at request time, so this has to happen ahead of time instead.
import { readdir, stat, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DIR = path.resolve(process.cwd(), "public/products");
const MAX_WIDTH = 1000; // product photos never render wider than this in the UI

async function run() {
  const files = (await readdir(DIR)).filter((f) => f.toLowerCase().endsWith(".png"));
  let beforeTotal = 0;
  let afterTotal = 0;

  for (const file of files) {
    const srcPath = path.join(DIR, file);
    const destPath = path.join(DIR, file.replace(/\.png$/i, ".webp"));
    const before = (await stat(srcPath)).size;

    const image = sharp(srcPath);
    const meta = await image.metadata();
    const pipeline = meta.width && meta.width > MAX_WIDTH
      ? image.resize({ width: MAX_WIDTH })
      : image;

    await pipeline.webp({ quality: 82 }).toFile(destPath);
    const after = (await stat(destPath)).size;

    beforeTotal += before;
    afterTotal += after;
    console.log(`${file} -> ${path.basename(destPath)}  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);

    await rm(srcPath);
  }

  console.log(`\nTotal: ${(beforeTotal / 1024 / 1024).toFixed(2)}MB -> ${(afterTotal / 1024 / 1024).toFixed(2)}MB`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
