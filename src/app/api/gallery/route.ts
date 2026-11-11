import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { GALLERY_TYPES } from "@/lib/studio";

const typeEnum = GALLERY_TYPES.map((t) => t.value) as [
  (typeof GALLERY_TYPES)[number]["value"],
  ...(typeof GALLERY_TYPES)[number]["value"][],
];

const createSchema = z.object({
  title: z.string().nullable().optional(),
  imageUrl: z.string().min(1),
  type: z.enum(typeEnum).optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const images = await prisma.galleryImage.findMany({
    where: type ? { type } : undefined,
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(images);
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dati non validi", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const maxSort = await prisma.galleryImage.aggregate({
    _max: { sortOrder: true },
  });

  const created = await prisma.galleryImage.create({
    data: {
      title: data.title?.trim() || null,
      imageUrl: data.imageUrl,
      type: data.type ?? "PIERCING",
      featured: data.featured ?? false,
      sortOrder: data.sortOrder ?? (maxSort._max.sortOrder ?? 0) + 1,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
