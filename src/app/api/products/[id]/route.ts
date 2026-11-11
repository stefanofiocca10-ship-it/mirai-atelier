import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { PRODUCT_STATUSES } from "@/lib/constants";
import { isAssignableCategory } from "@/lib/categories";
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
  quantity: z.number().int().min(0).optional(),
  categoryIds: z.array(z.string().min(1)).min(1).optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  imageUrl: imageUrlField,
  imageUrls: z.array(z.string().min(1)).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

const productInclude = {
  categories: { include: { category: true } },
  images: { orderBy: { sortOrder: "asc" as const } },
} as const;

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

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
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

  if (data.categoryIds) {
    const cats = await prisma.category.findMany({
      where: { id: { in: data.categoryIds } },
    });
    if (cats.length !== data.categoryIds.length) {
      return NextResponse.json(
        { error: "Una o più categorie non esistono" },
        { status: 400 }
      );
    }
    if (!cats.every(isAssignableCategory)) {
      return NextResponse.json(
        { error: "Puoi collegare solo sottocategorie (non le zone)" },
        { status: 400 }
      );
    }
  }

  const nextTitle = data.title?.trim() ?? existing.title;
  let nextSlug = existing.slug;
  if (data.title && data.title.trim() !== existing.title) {
    const base = slugify(nextTitle);
    nextSlug = await ensureUniqueProductSlugExcluding(base, id);
  }

  const urls =
    data.imageUrls !== undefined
      ? data.imageUrls
      : data.imageUrl !== undefined
        ? data.imageUrl
          ? [data.imageUrl]
          : []
        : undefined;

  const updated = await prisma.$transaction(async (tx) => {
    if (data.categoryIds) {
      await tx.productCategory.deleteMany({ where: { productId: id } });
      await tx.productCategory.createMany({
        data: data.categoryIds.map((categoryId) => ({
          productId: id,
          categoryId,
        })),
      });
    }

    if (urls !== undefined) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      if (urls.length) {
        await tx.productImage.createMany({
          data: urls.map((imageUrl, sortOrder) => ({
            productId: id,
            imageUrl,
            sortOrder,
          })),
        });
      }
    }

    return tx.product.update({
      where: { id },
      data: {
        title: data.title?.trim() ?? undefined,
        slug: nextSlug,
        description:
          data.description === undefined ? undefined : data.description,
        material: data.material === undefined ? undefined : data.material,
        status: data.status ?? undefined,
        quantity: data.quantity,
        featured: data.featured ?? undefined,
        sortOrder: data.sortOrder,
        imageUrl: urls !== undefined ? urls[0] ?? null : undefined,
      },
      include: productInclude,
    });
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
