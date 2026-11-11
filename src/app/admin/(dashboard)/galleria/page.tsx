import { GalleryAdminClient } from "@/components/admin/GalleryAdminClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminGalleriaPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Galleria lavori</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Carica foto di piercing e tatuaggi: compaiono sulla pagina pubblica
          /galleria.
        </p>
      </div>
      <GalleryAdminClient initial={images} />
    </div>
  );
}
