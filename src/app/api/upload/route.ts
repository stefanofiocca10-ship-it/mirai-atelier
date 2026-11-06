import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { requireAdminSession } from "@/lib/api-auth";

export const runtime = "nodejs";

const MAX_EDGE = 1600;

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File mancante" }, { status: 400 });
  }

  if (!file.size || file.size === 0) {
    return NextResponse.json({ error: "File vuoto" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const id = crypto.randomUUID();
  const baseName = `img-${Date.now()}-${id}`;

  const meta = await sharp(buffer).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;

  let transformer = sharp(buffer).rotate();
  if (w > MAX_EDGE || h > MAX_EDGE) {
    transformer = transformer.resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  let ext: "webp" | "jpeg";
  let mime: string;

  const hasAlpha =
    meta.hasAlpha === true ||
    meta.channels === 4 ||
    (meta.channels === undefined &&
      ["png", "gif", "webp"].includes(meta.format ?? ""));

  if (hasAlpha) {
    const outBuf = await transformer.webp({ quality: 85 }).toBuffer();
    ext = "webp";
    mime = "image/webp";
    await writeFile(path.join(uploadsDir, `${baseName}.webp`), outBuf);
  } else {
    const outBuf = await transformer
      .jpeg({ quality: 88, mozjpeg: true })
      .toBuffer();
    ext = "jpeg";
    mime = "image/jpeg";
    await writeFile(path.join(uploadsDir, `${baseName}.jpeg`), outBuf);
  }

  const urlPath = `/uploads/${baseName}.${ext}`;

  return NextResponse.json({ url: urlPath, mime, ext });
}
