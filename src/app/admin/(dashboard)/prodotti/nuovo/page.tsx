import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NuovoProdottoPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ kind: "asc" }, { zone: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Nuovo prodotto</h1>
        <p className="mt-2 text-sm text-muted">
          Scegli piercing o gioielleria, assegna una o più posizioni, carica
          foto e stato di disponibilità.
        </p>
      </div>
      <ProductForm categories={categories} mode="create" />
    </div>
  );
}
