import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [productCount, bookingCount] = await Promise.all([
    prisma.product.count(),
    prisma.booking.count(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-[var(--cream)]">Dashboard</h1>
        <p className="mt-2 text-sm text-[var(--stone)]">
          Panoramica rapida su catalogo e richieste di prenotazione.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--stone)_30%,transparent)] bg-[var(--charcoal)] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
            Prodotti
          </p>
          <p className="mt-2 font-display text-4xl text-[var(--cream)]">
            {productCount}
          </p>
          <p className="mt-1 text-sm text-[var(--sand)]">
            Voci attive nel database.
          </p>
        </div>
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--stone)_30%,transparent)] bg-[var(--charcoal)] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
            Prenotazioni
          </p>
          <p className="mt-2 font-display text-4xl text-[var(--cream)]">
            {bookingCount}
          </p>
          <p className="mt-1 text-sm text-[var(--sand)]">
            Richieste ricevute (tutti gli stati).
          </p>
        </div>
      </div>
    </div>
  );
}
