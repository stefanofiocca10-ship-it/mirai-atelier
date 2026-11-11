import type { Metadata } from "next";
import Image from "next/image";
import { ToriiFrame } from "@/components/brand/ToriiFrame";
import { prisma } from "@/lib/prisma";
import { GALLERY_TYPES, type GalleryType } from "@/lib/studio-shared";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galleria lavori",
  description: `Lavori di piercing e tatuaggio realizzati al ${SITE.name}.`,
  openGraph: {
    title: `Galleria · ${SITE.shortName}`,
    description: "Selezione di lavori dall'atelier.",
  },
};

export default async function GalleriaPage({
  searchParams,
}: {
  searchParams?: { tipo?: string };
}) {
  const tipo = (searchParams?.tipo ?? "").toUpperCase();
  const filterType = GALLERY_TYPES.some((t) => t.value === tipo)
    ? (tipo as GalleryType)
    : null;

  const images = await prisma.galleryImage.findMany({
    where: filterType ? { type: filterType } : undefined,
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="min-h-[100svh] pt-20 pb-[max(5rem,env(safe-area-inset-bottom))] sm:pt-24">
      <div className="mx-auto max-w-atelier px-4 sm:px-6 md:px-8">
        <ToriiFrame
          variant="myojin"
          className="mx-auto max-w-2xl"
          contentClassName="px-4 py-6 text-center sm:px-8 sm:py-10"
        >
          <p className="label-atelier">Galleria</p>
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl md:text-5xl">
            Lavori dall&apos;atelier
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted sm:text-base">
            Una selezione di piercing e tatuaggi. Margot aggiorna questa
            sezione dall&apos;admin con foto reali dello studio.
          </p>
        </ToriiFrame>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <FilterChip href="/galleria" active={!filterType} label="Tutti" />
          {GALLERY_TYPES.map((t) => (
            <FilterChip
              key={t.value}
              href={`/galleria?tipo=${t.value}`}
              active={filterType === t.value}
              label={t.label}
            />
          ))}
        </div>

        {images.length === 0 ? (
          <ToriiFrame
            variant="shinmei"
            className="mx-auto mt-10 max-w-xl"
            contentClassName="px-6 py-10 text-center"
          >
            <p className="text-sm text-muted">
              La galleria è pronta: le prime foto arriveranno a breve
              dall&apos;atelier.
            </p>
          </ToriiFrame>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img) => (
              <ToriiFrame key={img.id} variant="shinmei" media>
                <Image
                  src={img.imageUrl}
                  alt={img.title || "Lavoro Mirai"}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </ToriiFrame>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <a href={href} className={`btn-toggle btn-sm ${active ? "is-active" : ""}`}>
      {label}
    </a>
  );
}
