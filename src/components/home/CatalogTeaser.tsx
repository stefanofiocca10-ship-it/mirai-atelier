"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { statusLabel } from "@/lib/utils";

type ProductCard = {
  id: string;
  title: string;
  slug: string;
  material: string | null;
  status: string;
  imageUrl: string | null;
  categories: { category: { name: string } }[];
};

export function CatalogTeaser({ products }: { products: ProductCard[] }) {
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs tracking-[0.35em] text-khaki-deep uppercase">
              Mostra
            </p>
            <h2 className="mt-4 font-display text-3xl text-ink md:text-4xl">
              Catalogo gioielli
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted">
              Selezione curata — sola lettura. Per disponibilità e prova,
              contattaci o prenota una consulenza.
            </p>
          </div>
          <Link
            href="/catalogo"
            className="border border-ink/20 px-5 py-2.5 text-xs tracking-[0.2em] text-ink uppercase transition hover:border-khaki hover:text-khaki-deep"
          >
            Vedi tutto
          </Link>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={`/catalogo/${product.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden border border-line bg-paper-soft">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-display text-5xl text-ink/10">
                      未来
                    </div>
                  )}
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-[11px] tracking-[0.2em] text-muted-soft uppercase">
                    {product.categories[0]?.category.name ?? "Catalogo"}
                    {product.categories.length > 1
                      ? ` +${product.categories.length - 1}`
                      : ""}
                  </p>
                  <h3 className="font-display text-xl text-ink group-hover:text-khaki-deep">
                    {product.title}
                  </h3>
                  <p className="text-sm text-muted">
                    {product.material ?? "Materiale su richiesta"} ·{" "}
                    {statusLabel(product.status)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
