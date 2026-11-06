/**
 * Genera *-ear.jpg ritagliando l'orecchio dallo stesso *-face.jpg.
 * Garantisce corrispondenza 1:1 volto ↔ orecchio.
 *
 * Usage: node scripts/extract-ears.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "public", "images", "models");

const ids = [];
for (let i = 1; i <= 10; i++) {
  const n = String(i).padStart(2, "0");
  ids.push(`w${n}`, `m${n}`);
}

async function extractEar(id) {
  const facePath = path.join(dir, `${id}-face.jpg`);
  const earPath = path.join(dir, `${id}-ear.jpg`);
  if (!fs.existsSync(facePath)) {
    console.log("SKIP", id);
    return;
  }

  const meta = await sharp(facePath).metadata();
  const w = meta.width;
  const h = meta.height;

  const left = Math.round(w * 0.74);
  const top = Math.round(h * 0.26);
  const width = Math.min(Math.round(w * 0.24), w - left);
  const height = Math.min(Math.round(h * 0.38), h - top);

  const bgSample = await sharp(facePath)
    .extract({ left: Math.max(0, left - 8), top, width: 4, height: 4 })
    .raw()
    .toBuffer();
  const bg = { r: bgSample[0], g: bgSample[1], b: bgSample[2] };

  const outW = 900;
  const outH = 1200;
  const earRaw = await sharp(facePath)
    .extract({ left, top, width, height })
    .flop()
    .resize(Math.round(outW * 0.92), Math.round(outH * 0.78), {
      fit: "cover",
      position: "centre",
    })
    .toBuffer();

  const earMeta = await sharp(earRaw).metadata();
  const ox = Math.round((outW - earMeta.width) / 2);
  const oy = Math.round((outH - earMeta.height) / 2);

  await sharp({
    create: { width: outW, height: outH, channels: 3, background: bg },
  })
    .composite([{ input: earRaw, left: ox, top: oy }])
    .jpeg({ quality: 92 })
    .toFile(earPath);

  console.log("OK", id);
}

for (const id of ids) {
  await extractEar(id);
}
console.log("DONE");
