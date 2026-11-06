import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [productCount, bookingCount] = await Promise.all([
    prisma.product.count(),
    prisma.booking.count(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Dashboard</h1>
        <p className="mt-2 text-sm text-muted">
          Panoramica rapida su catalogo e richieste di prenotazione.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-paper p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-khaki-deep">
            Prodotti
          </p>
          <p className="mt-2 font-display text-4xl text-ink">{productCount}</p>
          <p className="mt-1 text-sm text-muted">Voci attive nel database.</p>
        </div>
        <div className="rounded-xl border border-line bg-paper p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-khaki-deep">
            Prenotazioni
          </p>
          <p className="mt-2 font-display text-4xl text-ink">{bookingCount}</p>
          <p className="mt-1 text-sm text-muted">
            Richieste ricevute (tutti gli stati).
          </p>
        </div>
      </div>
    </div>
  );
}
