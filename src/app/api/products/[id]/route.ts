import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { PRODUCT_STATUSES } from "@/lib/constants";
import { slugify } from "@/lib/utils";

const productStatusEnum = PRODUCT_STATUSES.map((s) => s.value) as [
  (typeof PRODUCT_STATUSES)[number]["value"],
  ...(typeof PRODUCT_STATUSES)[number]["value"][],
];

const imageUrlField = z
  .string()
  .nullable()
  .optional()
  .refine(
    (v) =>
      v == null ||
      v === "" ||
      v.startsWith("/") ||
      /^https?:\/\//i.test(v),
    "URL immagine non valida"
  );

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
  status: z.enum(productStatusEnum).optional(),
  categoryId: z.string().min(1).optional(),
  featured: z.boolean().optional(),
  imageUrl: imageUrlField,
});

type RouteContext = { params: Promise<{ id: string }> };

async function ensureUniqueProductSlugExcluding(
  base: string,
  excludeId: string
) {
  let candidate = base || "prodotto";
  let n = 0;
  for (;;) {
    const existing = await prisma.product.findUnique({
      where: { slug: candidate },
    });
    if (!existing || existing.id === excludeId) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const { id } = await context.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!product) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }
  return NextResponse.json(product);
}

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

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }

  const data = parsed.data;

  if (data.categoryId) {
    const cat = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!cat) {
      return NextResponse.json({ error: "Categoria non trovata" }, { status: 400 });
    }
  }

  const nextTitle = data.title?.trim() ?? existing.title;
  let nextSlug = existing.slug;
  if (data.title && data.title.trim() !== existing.title) {
    const base = slugify(nextTitle);
    nextSlug = await ensureUniqueProductSlugExcluding(base, id);
  }

  const imageUrlResolved =
    data.imageUrl === undefined
      ? undefined
      : data.imageUrl === "" || data.imageUrl === null
        ? null
        : data.imageUrl;

  const updated = await prisma.product.update({
    where: { id },
    data: {
      title: data.title?.trim() ?? undefined,
      slug: nextSlug,
      description:
        data.description === undefined ? undefined : data.description,
      material: data.material === undefined ? undefined : data.material,
      status: data.status ?? undefined,
      categoryId: data.categoryId ?? undefined,
      featured: data.featured ?? undefined,
      imageUrl: imageUrlResolved,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;

  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
