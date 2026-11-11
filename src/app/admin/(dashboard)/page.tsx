import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ToriiFrame } from "@/components/brand/ToriiFrame";
import { PRODUCT_STATUSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const now = new Date();
  const [productCount, categoryCount, statusGroups, upcomingAppointments] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.product.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.appointment.count({
        where: {
          startsAt: { gte: now },
          status: { not: "ANNULLATO" },
        },
      }),
    ]);

  const statusCounts = Object.fromEntries(
    statusGroups.map((g) => [g.status, g._count._all])
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Dashboard</h1>
        <p className="mt-2 text-sm text-muted">
          Panoramica rapida su catalogo, inventario e agenda.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <ToriiFrame variant="shinmei" contentClassName="panel-mirai p-6">
          <p className="label-atelier">Prodotti</p>
          <p className="mt-2 font-display text-4xl text-ink">{productCount}</p>
          <p className="mt-1 text-sm text-muted">Voci nel catalogo.</p>
          <Link href="/admin/prodotti" className="btn-ghost btn-sm mt-4">
            Vai ai prodotti
          </Link>
        </ToriiFrame>
        <ToriiFrame variant="shinmei" contentClassName="panel-mirai p-6">
          <p className="label-atelier">Categorie</p>
          <p className="mt-2 font-display text-4xl text-ink">{categoryCount}</p>
          <p className="mt-1 text-sm text-muted">Zone e sottotipi.</p>
          <Link href="/admin/categorie" className="btn-ghost btn-sm mt-4">
            Vai alle categorie
          </Link>
        </ToriiFrame>
        <ToriiFrame variant="myojin" contentClassName="panel-mirai p-6">
          <p className="label-atelier">Inventario</p>
          <ul className="mt-3 space-y-1 text-sm">
            {PRODUCT_STATUSES.map((s) => (
              <li key={s.value} className="flex justify-between gap-3">
                <span className="text-muted">{s.label}</span>
                <span className="font-medium text-ink">
                  {statusCounts[s.value] ?? 0}
                </span>
              </li>
            ))}
          </ul>
          <Link href="/admin/inventario" className="btn-primary btn-sm mt-4">
            Apri inventario
          </Link>
        </ToriiFrame>
        <ToriiFrame variant="myojin" contentClassName="panel-mirai p-6">
          <p className="label-atelier">Calendario</p>
          <p className="mt-2 font-display text-4xl text-ink">
            {upcomingAppointments}
          </p>
          <p className="mt-1 text-sm text-muted">
            Appuntamenti futuri (non annullati).
          </p>
          <Link href="/admin/calendario" className="btn-primary btn-sm mt-4">
            Gestisci agenda
          </Link>
        </ToriiFrame>
      </div>
    </div>
  );
}
