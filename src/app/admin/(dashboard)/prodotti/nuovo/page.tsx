import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NuovoProdottoPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ group: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-[var(--cream)]">
          Nuovo prodotto
        </h1>
        <p className="mt-2 text-sm text-[var(--stone)]">
          Aggiungi una voce al catalogo con immagine e stato di disponibilità.
        </p>
      </div>
      <ProductForm categories={categories} mode="create" />
    </div>
  );
}
