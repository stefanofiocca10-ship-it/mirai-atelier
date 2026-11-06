import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { primaryCategoryLabel } from "@/lib/categories";
import { statusLabel } from "@/lib/utils";
import { deleteProductAction } from "@/app/admin/(dashboard)/prodotti/actions";

export const dynamic = "force-dynamic";

export default async function AdminProdottiPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      categories: { include: { category: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Prodotti</h1>
          <p className="mt-2 text-sm text-muted">
            Inventario e vetrina: un articolo, più categorie.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/categorie"
            className="inline-flex items-center justify-center border border-line px-4 py-2.5 text-sm text-muted hover:text-ink"
          >
            Categorie
          </Link>
          <Link
            href="/admin/prodotti/nuovo"
            className="inline-flex items-center justify-center rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft"
          >
            Nuovo prodotto
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-paper">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted">
              <th className="px-4 py-3">Titolo</th>
              <th className="px-4 py-3">Categorie</th>
              <th className="px-4 py-3">Stato</th>
              <th className="px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  Nessun prodotto ancora. Crea il primo dalla pagina «Nuovo
                  prodotto».
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const cats = p.categories.map((pc) => pc.category);
                return (
                  <tr key={p.id} className="text-ink">
                    <td className="px-4 py-3 font-medium">{p.title}</td>
                    <td className="px-4 py-3 text-muted">
                      <span title={cats.map((c) => c.name).join(", ")}>
                        {primaryCategoryLabel(cats)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {statusLabel(p.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link
                          href={`/admin/prodotti/${p.id}`}
                          className="rounded-md border border-khaki-deep/40 px-3 py-1.5 text-xs text-khaki-deep hover:bg-khaki-soft"
                        >
                          Modifica
                        </Link>
                        <form action={deleteProductAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <button
                            type="submit"
                            className="rounded-md border border-line px-3 py-1.5 text-xs text-muted hover:border-ink hover:text-ink"
                          >
                            Elimina
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
