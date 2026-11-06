import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { statusLabel } from "@/lib/utils";
import { deleteProductAction } from "@/app/admin/(dashboard)/prodotti/actions";

export const dynamic = "force-dynamic";

export default async function AdminProdottiPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: { category: true },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-[var(--cream)]">Prodotti</h1>
          <p className="mt-2 text-sm text-[var(--stone)]">
            Gestisci il catalogo gioielli e piercing.
          </p>
        </div>
        <Link
          href="/admin/prodotti/nuovo"
          className="inline-flex items-center justify-center rounded-md bg-[var(--terracotta)] px-4 py-2.5 text-sm font-semibold text-[var(--cream)] transition-colors hover:bg-[var(--terracotta-deep)]"
        >
          Nuovo prodotto
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[color-mix(in_srgb,var(--stone)_30%,transparent)] bg-[var(--charcoal)]">
        <table className="min-w-full divide-y divide-[color-mix(in_srgb,var(--stone)_25%,transparent)] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-[var(--sand)]">
              <th className="px-4 py-3">Titolo</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Stato</th>
              <th className="px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color-mix(in_srgb,var(--stone)_20%,transparent)]">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-[var(--stone)]"
                >
                  Nessun prodotto ancora. Crea il primo dalla pagina «Nuovo
                  prodotto».
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="text-[var(--cream)]">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-[var(--sand)]">
                    {p.category.name}
                  </td>
                  <td className="px-4 py-3 text-[var(--sand)]">
                    {statusLabel(p.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link
                        href={`/admin/prodotti/${p.id}`}
                        className="rounded-md border border-[color-mix(in_srgb,var(--gold)_40%,transparent)] px-3 py-1.5 text-xs text-[var(--gold)] hover:bg-[color-mix(in_srgb,var(--gold)_10%,transparent)]"
                      >
                        Modifica
                      </Link>
                      <form action={deleteProductAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <button
                          type="submit"
                          className="rounded-md border border-[color-mix(in_srgb,var(--terracotta)_50%,transparent)] px-3 py-1.5 text-xs text-[var(--terracotta)] hover:bg-[color-mix(in_srgb,var(--terracotta)_15%,transparent)]"
                        >
                          Elimina
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
