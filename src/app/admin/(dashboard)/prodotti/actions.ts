"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Non autorizzato");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("ID non valido");
  }

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/prodotti");
  revalidatePath("/admin/inventario");
  redirect("/admin/prodotti");
}

export async function moveProductAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  const direction = formData.get("direction");
  if (typeof id !== "string" || (direction !== "up" && direction !== "down")) {
    throw new Error("Parametri non validi");
  }

  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    select: { id: true },
  });
  const index = products.findIndex((p) => p.id === id);
  if (index < 0) throw new Error("Prodotto non trovato");

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= products.length) {
    revalidatePath("/admin/prodotti");
    return;
  }

  const reordered = [...products];
  const [item] = reordered.splice(index, 1);
  reordered.splice(swapIndex, 0, item);

  await prisma.$transaction(
    reordered.map((p, i) =>
      prisma.product.update({
        where: { id: p.id },
        data: { sortOrder: i },
      })
    )
  );

  revalidatePath("/admin/prodotti");
  revalidatePath("/catalogo");
}

export async function toggleFeaturedAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string") throw new Error("ID non valido");

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("Non trovato");

  await prisma.product.update({
    where: { id },
    data: { featured: !product.featured },
  });

  revalidatePath("/admin/prodotti");
  revalidatePath("/catalogo");
}
