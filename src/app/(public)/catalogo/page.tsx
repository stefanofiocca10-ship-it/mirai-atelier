import type { Metadata } from "next";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalogo Gioielli",
  description: `Esplora i piercing di ${SITE.name} partendo dalla mappa del corpo.`,
};

export default async function CatalogoPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { title: "asc" }],
    }),
    prisma.category.findMany({
      orderBy: [{ group: "asc" }, { sortOrder: "asc" }],
    }),
  ]);

  return (
    <div className="min-h-[100svh] pt-24 pb-20 sm:pt-28">
      <div className="mx-auto max-w-atelier px-4 sm:px-6 md:px-8">
        <div className="surface mx-auto mb-8 max-w-2xl border border-line/80 px-5 py-8 text-center sm:mb-12 sm:px-8 sm:py-10">
          <p className="label-atelier">Mostra</p>
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl md:text-5xl">
            Catalogo
          </h1>
          <p className="mt-4 text-sm text-muted sm:text-base">
            Prima scegli la zona. Poi vedi solo i pezzi che ti interessano.
          </p>
        </div>

        <CatalogClient products={products} categories={categories} />
      </div>
    </div>
  );
}
