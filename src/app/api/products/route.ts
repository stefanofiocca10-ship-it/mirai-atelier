import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
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

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
  status: z.enum(productStatusEnum),
  quantity: z.number().int().min(0).optional(),
  categoryIds: z.array(z.string().min(1)).min(1),
  featured: z.boolean().optional(),
  imageUrl: imageUrlField,
  imageUrls: z.array(z.string().min(1)).optional(),
});

async function ensureUniqueProductSlug(base: string) {
  let candidate = base || "prodotto";
  let n = 0;
  for (;;) {
    const existing = await prisma.product.findUnique({
      where: { slug: candidate },
    });
    if (!existing) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}

const productInclude = {
  categories: { include: { category: true } },
  images: { orderBy: { sortOrder: "asc" as const } },
} as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");
  const kind = searchParams.get("kind");
  const zone = searchParams.get("zone");
  const q = searchParams.get("q");

  const and: Prisma.ProductWhereInput[] = [];

  if (categorySlug) {
    and.push({
      categories: { some: { category: { slug: categorySlug } } },
    });
  }

  if (kind) {
    and.push({
      categories: { some: { category: { kind } } },
    });
  }

  if (zone) {
    and.push({
      categories: { some: { category: { zone } } },
    });
  }

  if (q && q.trim()) {
    const term = q.trim();
    and.push({
      OR: [
        { title: { contains: term } },
        { description: { contains: term } },
        { material: { contains: term } },
      ],
    });
  }

  const where: Prisma.ProductWhereInput =
    and.length > 0 ? { AND: and } : {};

  const products = await prisma.product.findMany({
    where,
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { updatedAt: "desc" }],
    include: productInclude,
  });

  return NextResponse.json(products);
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

  const baseSlug = slugify(data.title);
  const slug = await ensureUniqueProductSlug(baseSlug);

  const urls =
    data.imageUrls && data.imageUrls.length
      ? data.imageUrls
      : data.imageUrl
        ? [data.imageUrl]
        : [];

  const product = await prisma.product.create({
    data: {
      title: data.title.trim(),
      slug,
      description: data.description ?? null,
      material: data.material ?? null,
      status: data.status,
      quantity: data.quantity ?? 0,
      featured: data.featured ?? false,
      imageUrl: urls[0] ?? null,
      categories: {
        create: data.categoryIds.map((categoryId) => ({ categoryId })),
      },
      images: {
        create: urls.map((imageUrl, sortOrder) => ({ imageUrl, sortOrder })),
      },
    },
    include: productInclude,
  });

  return NextResponse.json(product, { status: 201 });
}
