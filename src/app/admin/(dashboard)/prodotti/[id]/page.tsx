import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function ModificaProdottoPage({ params }: PageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({
      orderBy: [{ group: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-[var(--cream)]">
          Modifica prodotto
        </h1>
        <p className="mt-2 text-sm text-[var(--stone)]">
          Aggiorna i dettagli o sostituisci l&apos;immagine.
        </p>
      </div>
      <ProductForm categories={categories} mode="edit" product={product} />
    </div>
  );
}
