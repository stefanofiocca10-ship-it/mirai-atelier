import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
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

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
  status: z.enum(productStatusEnum),
  categoryId: z.string().min(1),
  featured: z.boolean().optional(),
  imageUrl: imageUrlField,
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");
  const group = searchParams.get("group");
  const q = searchParams.get("q");

  const and: Prisma.ProductWhereInput[] = [];

  if (categorySlug) {
    and.push({
      category: { slug: categorySlug },
    });
  }

  if (group) {
    and.push({
      category: { group },
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
    include: { category: true },
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
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });
  if (!category) {
    return NextResponse.json({ error: "Categoria non trovata" }, { status: 400 });
  }

  const baseSlug = slugify(data.title);
  const slug = await ensureUniqueProductSlug(baseSlug);

  const product = await prisma.product.create({
    data: {
      title: data.title.trim(),
      slug,
      description: data.description ?? null,
      material: data.material ?? null,
      status: data.status,
      categoryId: data.categoryId,
      featured: data.featured ?? false,
      imageUrl:
        data.imageUrl === undefined || data.imageUrl === "" || data.imageUrl === null
          ? null
          : data.imageUrl,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
