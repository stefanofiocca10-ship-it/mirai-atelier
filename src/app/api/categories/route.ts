import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { CATALOG_KINDS } from "@/lib/constants";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

const kindEnum = CATALOG_KINDS.map((k) => k.value) as [
  (typeof CATALOG_KINDS)[number]["value"],
  ...(typeof CATALOG_KINDS)[number]["value"][],
];

const createSchema = z.object({
  name: z.string().min(1),
  kind: z.enum(kindEnum),
  zone: z.string().min(1),
  description: z.string().nullable().optional(),
});

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: [{ kind: "asc" }, { zone: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(categories);
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

  const { name, kind, zone, description } = parsed.data;

  const zoneNode = await prisma.category.findFirst({
    where: { kind, zone, parentId: null },
  });

  if (kind === "PIERCING" && !zoneNode) {
    return NextResponse.json(
      { error: "Zona piercing non trovata. Scegline una esistente." },
      { status: 400 }
    );
  }

  // Jewelry: crea nuova zona-leaf. Piercing: crea leaf sotto la zona.
  const parentId = kind === "PIERCING" ? zoneNode!.id : null;
  const baseSlug = slugify(name);
  let slug = baseSlug || "categoria";
  let n = 0;
  for (;;) {
    const clash = await prisma.category.findUnique({ where: { slug } });
    if (!clash) break;
    n += 1;
    slug = `${baseSlug}-${n}`;
  }

  const maxSort = await prisma.category.aggregate({ _max: { sortOrder: true } });
  const sortOrder = (maxSort._max.sortOrder ?? 0) + 1;

  const category = await prisma.category.create({
    data: {
      name: name.trim(),
      slug,
      kind,
      zone: kind === "JEWELRY" ? slugify(name) || zone : zone,
      parentId,
      description: description ?? null,
      sortOrder,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
