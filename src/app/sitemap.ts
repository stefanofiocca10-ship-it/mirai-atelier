import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, galleryCount] = await Promise.all([
    prisma.product.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.galleryImage.count(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/chi-siamo",
    "/catalogo",
    "/calendario",
    "/contatti",
    "/faq",
    "/galleria",
  ].map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/catalogo" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/catalogo" ? 0.9 : 0.7,
  }));

  if (galleryCount === 0) {
    // keep /galleria anyway — pagina predisposta
  }

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/catalogo/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
