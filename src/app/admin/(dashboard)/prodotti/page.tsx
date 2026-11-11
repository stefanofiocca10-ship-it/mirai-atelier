import Link from "next/link";
import { ToriiFrame } from "@/components/brand/ToriiFrame";
import { prisma } from "@/lib/prisma";
import { primaryCategoryLabel } from "@/lib/categories";
import { statusLabel } from "@/lib/utils";
import {
  deleteProductAction,
  moveProductAction,
  toggleFeaturedAction,
} from "@/app/admin/(dashboard)/prodotti/actions";

export const dynamic = "force-dynamic";

export default async function AdminProdottiPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
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
            Gestione articoli: quantità, ordine in vetrina, più foto.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/inventario" className="btn-ghost">
            Inventario
          </Link>
          <Link href="/admin/categorie" className="btn-ghost">
            Categorie
          </Link>
          <Link href="/admin/prodotti/nuovo" className="btn-primary">
            Nuovo prodotto
          </Link>
        </div>
      </div>

      <ToriiFrame variant="shinmei" contentClassName="panel-mirai overflow-x-auto p-0">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted">
              <th className="px-4 py-3">Ordine</th>
              <th className="px-4 py-3">Titolo</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Categorie</th>
              <th className="px-4 py-3">Stato</th>
              <th className="px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  Nessun prodotto ancora. Crea il primo dalla pagina «Nuovo
                  prodotto».
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const cats = p.categories.map((pc) => pc.category);
                return (
                  <tr key={p.id} className="text-ink">
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <form action={moveProductAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="direction" value="up" />
                          <button type="submit" className="btn-ghost btn-sm">
                            ↑
                          </button>
                        </form>
                        <form action={moveProductAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="direction" value="down" />
                          <button type="submit" className="btn-ghost btn-sm">
                            ↓
                          </button>
                        </form>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {p.title}
                      {p.featured ? (
                        <span className="ml-2 text-[10px] uppercase tracking-wider text-khaki-deep">
                          Evidenza
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-muted">{p.quantity}</td>
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
                        <form action={toggleFeaturedAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <button type="submit" className="btn-toggle btn-sm">
                            {p.featured ? "Togli evidenza" : "Evidenza"}
                          </button>
                        </form>
                        <Link
                          href={`/admin/prodotti/${p.id}`}
                          className="btn-ghost btn-sm"
                        >
                          Modifica
                        </Link>
                        <form action={deleteProductAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <button type="submit" className="btn-ghost btn-sm">
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
      </ToriiFrame>
    </div>
  );
}
