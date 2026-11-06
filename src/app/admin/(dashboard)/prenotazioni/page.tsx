import { format } from "date-fns";
import { it } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { BOOKING_STATUSES, SERVICE_TYPES } from "@/lib/constants";
import { statusLabel } from "@/lib/utils";
import { updateBookingStatusAction } from "@/app/admin/(dashboard)/prenotazioni/actions";

export const dynamic = "force-dynamic";

function serviceLabel(value: string) {
  return SERVICE_TYPES.find((s) => s.value === value)?.label ?? value;
}

export default async function AdminPrenotazioniPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: [{ createdAt: "desc" }],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Prenotazioni</h1>
        <p className="mt-2 text-sm text-muted">
          Gestisci lo stato delle richieste ricevute dal sito.
        </p>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <p className="rounded-xl border border-line bg-paper px-4 py-8 text-center text-muted">
            Nessuna prenotazione per ora.
          </p>
        ) : (
          bookings.map((b) => (
            <article
              key={b.id}
              className="rounded-xl border border-line bg-paper p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <p className="font-display text-lg text-ink">{b.name}</p>
                  <p className="text-sm text-muted">
                    <a
                      href={`mailto:${b.email}`}
                      className="underline decoration-khaki-deep/50 hover:text-khaki-deep"
                    >
                      {b.email}
                    </a>
                    {" · "}
                    <a
                      href={`tel:${b.phone.replace(/\s/g, "")}`}
                      className="underline decoration-khaki-deep/50 hover:text-khaki-deep"
                    >
                      {b.phone}
                    </a>
                  </p>
                  <p className="text-sm text-muted">
                    Servizio:{" "}
                    <span className="text-ink">{serviceLabel(b.serviceType)}</span>
                  </p>
                  {b.preferredAt ? (
                    <p className="text-sm text-muted">
                      Preferenza:{" "}
                      <span className="text-ink">
                        {format(b.preferredAt, "d MMMM yyyy, HH:mm", {
                          locale: it,
                        })}
                      </span>
                    </p>
                  ) : null}
                  {b.message ? (
                    <p className="mt-2 rounded-md bg-paper-soft p-3 text-sm text-muted">
                      {b.message}
                    </p>
                  ) : null}
                  <p className="text-xs text-muted-soft">
                    Ricevuta il{" "}
                    {format(b.createdAt, "d MMMM yyyy, HH:mm", { locale: it })}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-2 lg:w-56">
                  <form
                    action={updateBookingStatusAction}
                    className="flex flex-col gap-2"
                  >
                    <input type="hidden" name="id" value={b.id} />
                    <label
                      htmlFor={`status-${b.id}`}
                      className="text-xs uppercase tracking-wider text-muted"
                    >
                      Stato
                    </label>
                    <select
                      id={`status-${b.id}`}
                      name="status"
                      defaultValue={b.status}
                      className="rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none ring-khaki-deep focus:ring-2"
                    >
                      {BOOKING_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded-md bg-ink py-2 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
                    >
                      Aggiorna stato
                    </button>
                  </form>
                  <p className="text-xs text-muted">
                    Attuale: {statusLabel(b.status)}
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
