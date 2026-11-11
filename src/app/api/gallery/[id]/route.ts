import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { GALLERY_TYPES } from "@/lib/studio";

const typeEnum = GALLERY_TYPES.map((t) => t.value) as [
  (typeof GALLERY_TYPES)[number]["value"],
  ...(typeof GALLERY_TYPES)[number]["value"][],
];

const updateSchema = z.object({
  title: z.string().nullable().optional(),
  type: z.enum(typeEnum).optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  imageUrl: z.string().min(1).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dati non validi", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.galleryImage.update({
      where: { id },
      data: {
        title:
          parsed.data.title === undefined
            ? undefined
            : parsed.data.title?.trim() || null,
        type: parsed.data.type,
        featured: parsed.data.featured,
        sortOrder: parsed.data.sortOrder,
        imageUrl: parsed.data.imageUrl,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  try {
    await prisma.galleryImage.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
