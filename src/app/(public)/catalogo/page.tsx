import type { Metadata } from "next";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { ToriiFrame } from "@/components/brand/ToriiFrame";
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
      include: {
        categories: { include: { category: true } },
      },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { title: "asc" }],
    }),
    prisma.category.findMany({
      orderBy: [{ kind: "asc" }, { zone: "asc" }, { sortOrder: "asc" }],
    }),
  ]);

  return (
    <div className="min-h-[100svh] pt-20 pb-[max(5rem,env(safe-area-inset-bottom))] sm:pt-24">
      <div className="mx-auto max-w-atelier px-4 sm:px-6 md:px-8">
        <ToriiFrame
          variant="myojin"
          className="mx-auto mb-6 max-w-2xl sm:mb-12"
          contentClassName="px-4 py-6 text-center sm:px-8 sm:py-10"
        >
          <p className="label-atelier">Mostra</p>
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl md:text-5xl">
            Catalogo
          </h1>
          <p className="mt-4 text-sm text-muted sm:text-base">
            Prima scegli la zona. Poi vedi solo i pezzi che ti interessano.
          </p>
        </ToriiFrame>

        <CatalogClient products={products} categories={categories} />
      </div>
    </div>
  );
}
