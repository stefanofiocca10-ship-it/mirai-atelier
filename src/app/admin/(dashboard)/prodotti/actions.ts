"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function deleteProductAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Non autorizzato");
  }

  const id = formData.get("id");
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("ID non valido");
  }

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/prodotti");
  redirect("/admin/prodotti");
}
