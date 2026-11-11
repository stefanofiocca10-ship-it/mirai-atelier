import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { primaryCategoryLabel } from "@/lib/categories";
import { statusLabel } from "@/lib/utils";

function csvEscape(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const products = await prisma.product.findMany({
    orderBy: [{ title: "asc" }],
    include: {
      categories: { include: { category: true } },
    },
  });

  const header = [
    "id",
    "titolo",
    "slug",
    "stato",
    "quantita",
    "materiale",
    "evidenza",
    "categorie",
    "tipi",
    "zone",
  ];

  const lines = [
    header.join(","),
    ...products.map((p) => {
      const cats = p.categories.map((pc) => pc.category);
      const kinds = Array.from(new Set(cats.map((c) => c.kind) as string[])).join(
        " | "
      );
      const zones = Array.from(new Set(cats.map((c) => c.zone) as string[])).join(
        " | "
      );
      return [
        p.id,
        csvEscape(p.title),
        csvEscape(p.slug),
        csvEscape(statusLabel(p.status)),
        String(p.quantity),
        csvEscape(p.material ?? ""),
        p.featured ? "si" : "no",
        csvEscape(primaryCategoryLabel(cats)),
        csvEscape(kinds),
        csvEscape(zones),
      ].join(",");
    }),
  ];

  const body = "\uFEFF" + lines.join("\r\n");
  const filename = `mirai-inventario-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
