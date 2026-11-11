import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  InventoryClient,
  type InventoryCategory,
  type InventoryProduct,
} from "@/components/admin/InventoryClient";

export const dynamic = "force-dynamic";

export default async function AdminInventarioPage() {
  const [productsRaw, categoriesRaw] = await Promise.all([
    prisma.product.findMany({
      orderBy: [{ title: "asc" }],
      include: {
        categories: { include: { category: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
  ]);

  const categories: InventoryCategory[] = categoriesRaw.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    kind: c.kind,
    zone: c.zone,
    parentId: c.parentId,
  }));

  const products: InventoryProduct[] = productsRaw.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    material: p.material,
    status: p.status,
    featured: p.featured,
    quantity: p.quantity,
    categories: p.categories.map((pc) => ({
      id: pc.category.id,
      name: pc.category.name,
      slug: pc.category.slug,
      kind: pc.category.kind,
      zone: pc.category.zone,
      parentId: pc.category.parentId,
    })),
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Inventario</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Quante voci hai per tipo, zona, categoria, materiale e stato —
            con filtri per restringere la ricerca.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/api/admin/inventory/export" className="btn-ghost">
            Esporta CSV
          </a>
          <Link href="/admin/prodotti" className="btn-ghost">
            Gestione prodotti
          </Link>
          <Link href="/admin/prodotti/nuovo" className="btn-primary">
            Nuovo prodotto
          </Link>
        </div>
      </div>

      <InventoryClient products={products} categories={categories} />
    </div>
  );
}
