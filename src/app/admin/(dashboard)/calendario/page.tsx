import Link from "next/link";
import { AppointmentsAdminClient } from "@/components/admin/AppointmentsAdminClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCalendarioPage() {
  const from = new Date();
  from.setDate(from.getDate() - 7);
  from.setHours(0, 0, 0, 0);

  const appointments = await prisma.appointment.findMany({
    where: { startsAt: { gte: from } },
    orderBy: { startsAt: "asc" },
    take: 200,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Calendario</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Inserisci gli appuntamenti degli ospiti: compaiono sul calendario
            pubblico del sito.
          </p>
        </div>
        <Link href="/calendario" className="btn-ghost" target="_blank">
          Vedi pagina pubblica
        </Link>
      </div>

      <AppointmentsAdminClient
        initial={appointments.map((a) => ({
          id: a.id,
          title: a.title,
          guestName: a.guestName,
          startsAt: a.startsAt.toISOString(),
          endsAt: a.endsAt?.toISOString() ?? null,
          status: a.status,
          notes: a.notes,
        }))}
      />
    </div>
  );
}
