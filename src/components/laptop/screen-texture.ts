import * as THREE from "three";
import type { LaptopVariant } from "@/lib/laptop-variants";

// The screen quad is ~16:9 once un-tilted. 1024x576 is enough to stay crisp at
// the closest camera push without another megabyte of texture memory.
const W = 1024;
const H = 576;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Paint a variant's "desktop" onto a 2D canvas. */
export function paintScreen(canvas: HTMLCanvasElement, v: LaptopVariant) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { screen } = v;

  ctx.clearRect(0, 0, W, H);

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, screen.from);
  bg.addColorStop(1, screen.to);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Off-centre bloom, so the wallpaper doesn't read as a flat swatch.
  const glow = ctx.createRadialGradient(W * 0.72, H * 0.22, 0, W * 0.72, H * 0.22, W * 0.6);
  glow.addColorStop(0, `${v.accent}66`);
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Menu bar.
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(0, 0, W, 34);
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "500 17px Inter, system-ui, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText("Jetage India", 26, 18);
  ctx.textAlign = "right";
  ctx.fillText("HP World Partner", W - 26, 18);
  ctx.textAlign = "left";

  // Headline block.
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 92px Inter, system-ui, sans-serif";
  ctx.fillText(screen.heading, 64, H * 0.46);

  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.font = "400 30px Inter, system-ui, sans-serif";
  ctx.fillText(screen.sub, 68, H * 0.46 + 74);

  // Accent rule under the headline.
  ctx.fillStyle = v.accent;
  roundRect(ctx, 66, H * 0.46 - 78, 96, 6, 3);
  ctx.fill();

  // Dock.
  const dockW = 340;
  const dockX = (W - dockW) / 2;
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  roundRect(ctx, dockX, H - 78, dockW, 56, 16);
  ctx.fill();
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i === 2 ? v.accent : "rgba(255,255,255,0.35)";
    roundRect(ctx, dockX + 18 + i * 62, H - 66, 40, 32, 9);
    ctx.fill();
  }
}

/**
 * The HP roundel for the lid plate. The model ships a blank square decal dead
 * centre on the lid, which is exactly where the badge belongs — so this paints
 * into it rather than adding geometry.
 */
export function createLogoTexture() {
  const S = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, S, S);
    ctx.fillStyle = "#0096D6";
    ctx.beginPath();
    ctx.arc(S / 2, S / 2, S * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "italic 700 210px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("hp", S / 2, S / 2 + 8);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/**
 * A screen texture that can be repainted in place. glTF textures are sampled
 * with flipY=false, so match that or the wallpaper lands upside down on the
 * model's existing UVs.
 */
export function createScreenTexture(v: LaptopVariant) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  paintScreen(canvas, v);

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  return {
    texture,
    repaint(next: LaptopVariant) {
      paintScreen(canvas, next);
      texture.needsUpdate = true;
    },
  };
}
