import { prisma } from "@/lib/prisma";
import { isAssignableCategory } from "@/lib/categories";
import { CategoryAdminClient } from "@/components/admin/CategoryAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminCategoriePage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ kind: "asc" }, { zone: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });

  const zones = categories.filter((c) => !c.parentId);
  const leaves = categories.filter(isAssignableCategory);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Categorie</h1>
        <p className="mt-2 text-sm text-muted">
          Zone e sottotipi del catalogo. Puoi aggiungere nuovi tipi di piercing
          quando serve.
        </p>
      </div>

      <CategoryAdminClient zones={zones} leaves={leaves} />
    </div>
  );
}
