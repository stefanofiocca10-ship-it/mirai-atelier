import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "Logo Mirai.jpeg");
const outDir = path.join(root, "public", "images");
fs.mkdirSync(outDir, { recursive: true });

const meta = await sharp(src).metadata();
const { width, height } = meta;

// Center square crop (circle fills ~width of the portrait canvas)
const side = width;
const top = Math.max(0, Math.floor((height - side) / 2));

const square = await sharp(src)
  .extract({ left: 0, top, width: side, height: Math.min(side, height - top) })
  .resize(1024, 1024, { fit: "cover", position: "centre" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { data, info } = square;
const W = info.width;
const H = info.height;
const C = info.channels;

function L(x, y) {
  const i = (y * W + x) * C;
  return (data[i] + data[i + 1] + data[i + 2]) / 3;
}

const bg = (L(8, 8) + L(W - 9, 8) + L(8, H - 9) + L(W - 9, H - 9)) / 4;
const cx = Math.floor(W / 2);
const cy = Math.floor(H / 2);

function isDisk(x, y) {
  const v = L(x, y);
  return v > bg + 20 || v > 215;
}

let radius = 0;
for (let r = 20; r < Math.min(cx, cy) - 4; r++) {
  let hits = 0;
  for (let a = 0; a < 24; a++) {
    const ang = (a / 24) * Math.PI * 2;
    const x = Math.round(cx + Math.cos(ang) * r);
    const y = Math.round(cy + Math.sin(ang) * r);
    if (x >= 0 && y >= 0 && x < W && y < H && isDisk(x, y)) hits++;
  }
  if (hits >= 16) radius = r;
  else if (radius > 120 && hits < 8) break;
}
if (radius < 100) radius = Math.floor(W * 0.45);

const pad = Math.max(4, Math.floor(radius * 0.02));
const cropSide = Math.min(W, (radius + pad) * 2);
const cropLeft = Math.max(0, cx - Math.floor(cropSide / 2));
const cropTop = Math.max(0, cy - Math.floor(cropSide / 2));

const tight = await sharp(src)
  .extract({ left: 0, top, width: side, height: Math.min(side, height - top) })
  .resize(1024, 1024, { fit: "cover", position: "centre" })
  .extract({
    left: cropLeft,
    top: cropTop,
    width: Math.min(cropSide, W - cropLeft),
    height: Math.min(cropSide, H - cropTop),
  })
  .resize(1024, 1024, { fit: "cover" })
  .png()
  .toBuffer();

const circle = Buffer.from(
  `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg"><circle cx="512" cy="512" r="510" fill="#fff"/></svg>`
);

// Transparent PNG circle (for site)
await sharp(tight)
  .composite([{ input: circle, blend: "dest-in" }])
  .png()
  .toFile(path.join(outDir, "logo-mirai.png"));

// White-backed JPEG fallback
await sharp(tight)
  .composite([{ input: circle, blend: "dest-in" }])
  .flatten({ background: "#ffffff" })
  .jpeg({ quality: 95 })
  .toFile(path.join(outDir, "logo-mirai.jpeg"));

console.log({ bg: bg.toFixed(1), radius, cropSide });
console.log("OK public/images/logo-mirai.png");
