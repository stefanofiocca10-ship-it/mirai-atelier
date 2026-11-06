import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactActions } from "@/components/contact/ContactActions";
import { prisma } from "@/lib/prisma";
import { statusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });
  if (!product) return { title: "Prodotto" };
  return {
    title: product.title,
    description: product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product) notFound();

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="mx-auto grid max-w-atelier gap-10 px-5 md:grid-cols-2 md:gap-16 md:px-8">
        <div className="relative aspect-[4/5] overflow-hidden border border-line bg-paper-soft">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-7xl text-ink/10">
              未来
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <Link
            href="/catalogo"
            className="text-xs tracking-[0.2em] text-muted uppercase hover:text-ink"
          >
            ← Catalogo
          </Link>
          <p className="mt-6 label-atelier">{product.category.name}</p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            {product.title}
          </h1>
          <div className="divider-atelier mt-6 max-w-[6rem]" />

          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="text-muted">Materiale</dt>
              <dd className="mt-1 text-ink">
                {product.material ?? "Su richiesta in atelier"}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Stato</dt>
              <dd className="mt-1 text-ink">{statusLabel(product.status)}</dd>
            </div>
          </dl>

          {product.description && (
            <p className="mt-8 leading-relaxed text-muted">{product.description}</p>
          )}

          <p className="mt-8 text-sm text-muted">
            Mostra in sola lettura — per disponibilità contattaci.
          </p>

          <div className="mt-6">
            <ContactActions />
          </div>
        </div>
      </div>
    </div>
  );
}
