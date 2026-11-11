import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactActions } from "@/components/contact/ContactActions";
import { ToriiFrame } from "@/components/brand/ToriiFrame";
import { ProductImageGallery } from "@/components/catalog/ProductImageGallery";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/constants";
import { statusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });
  if (!product) return { title: "Prodotto" };
  const cover = product.images[0]?.imageUrl ?? product.imageUrl ?? undefined;
  return {
    title: product.title,
    description:
      product.description ??
      `${product.title} — catalogo ${SITE.shortName}`,
    openGraph: {
      title: `${product.title} · ${SITE.shortName}`,
      description: product.description ?? SITE.description,
      type: "website",
      url: `${siteUrl}/catalogo/${product.slug}`,
      images: cover ? [{ url: cover }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      categories: { include: { category: true } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product) notFound();

  const categoryNames = product.categories.map((pc) => pc.category.name);
  const gallery =
    product.images.length > 0
      ? product.images.map((i) => i.imageUrl)
      : product.imageUrl
        ? [product.imageUrl]
        : [];

  return (
    <div className="min-h-[100svh] pt-20 pb-[max(5rem,env(safe-area-inset-bottom))] sm:pt-24">
      <div className="mx-auto grid max-w-atelier gap-6 px-4 sm:px-6 md:grid-cols-2 md:gap-10 md:px-8">
        <ToriiFrame variant="myojin" media>
          <ProductImageGallery
            images={gallery}
            alt={product.title}
            priority
          />
        </ToriiFrame>

        <ToriiFrame
          variant="myojin"
          contentClassName="flex flex-col justify-center p-4 sm:p-8 md:p-10"
        >
          <Link
            href="/catalogo"
            className="text-xs tracking-[0.2em] text-ink-soft uppercase hover:text-ink"
          >
            ← Catalogo
          </Link>
          <p className="mt-6 label-atelier">
            {categoryNames.length ? categoryNames.join(" · ") : "Catalogo"}
          </p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            {product.title}
          </h1>
          <div className="divider-atelier mt-6 max-w-[6rem]" />

          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="text-ink-soft">Materiale</dt>
              <dd className="mt-1 text-ink">
                {product.material ?? "Su richiesta in atelier"}
              </dd>
            </div>
            <div>
              <dt className="text-ink-soft">Stato</dt>
              <dd className="mt-1 text-ink">{statusLabel(product.status)}</dd>
            </div>
          </dl>

          {product.description ? (
            <p className="mt-8 leading-relaxed text-ink-soft">
              {product.description}
            </p>
          ) : null}

          <p className="mt-8 text-sm text-ink-soft">
            Mostra in sola lettura — per disponibilità contattaci.
          </p>

          <div className="mt-6">
            <ContactActions />
          </div>
        </ToriiFrame>
      </div>
    </div>
  );
}
