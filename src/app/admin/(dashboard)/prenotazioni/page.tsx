import { format } from "date-fns";
import { it } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { BOOKING_STATUSES, SERVICE_TYPES } from "@/lib/constants";
import { statusLabel } from "@/lib/utils";
import { updateBookingStatusAction } from "@/app/admin/(dashboard)/prenotazioni/actions";

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
        <h1 className="font-display text-3xl text-[var(--cream)]">
          Prenotazioni
        </h1>
        <p className="mt-2 text-sm text-[var(--stone)]">
          Gestisci lo stato delle richieste ricevute dal sito.
        </p>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <p className="rounded-xl border border-[color-mix(in_srgb,var(--stone)_30%,transparent)] bg-[var(--charcoal)] px-4 py-8 text-center text-[var(--stone)]">
            Nessuna prenotazione per ora.
          </p>
        ) : (
          bookings.map((b) => (
            <article
              key={b.id}
              className="rounded-xl border border-[color-mix(in_srgb,var(--stone)_30%,transparent)] bg-[var(--charcoal)] p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <p className="font-display text-lg text-[var(--cream)]">
                    {b.name}
                  </p>
                  <p className="text-sm text-[var(--sand)]">
                    <a
                      href={`mailto:${b.email}`}
                      className="underline decoration-[color-mix(in_srgb,var(--gold)_50%,transparent)] hover:text-[var(--gold)]"
                    >
                      {b.email}
                    </a>
                    {" · "}
                    <a
                      href={`tel:${b.phone.replace(/\s/g, "")}`}
                      className="underline decoration-[color-mix(in_srgb,var(--gold)_50%,transparent)] hover:text-[var(--gold)]"
                    >
                      {b.phone}
                    </a>
                  </p>
                  <p className="text-sm text-[var(--sand)]">
                    Servizio:{" "}
                    <span className="text-[var(--cream)]">
                      {serviceLabel(b.serviceType)}
                    </span>
                  </p>
                  {b.preferredAt ? (
                    <p className="text-sm text-[var(--sand)]">
                      Preferenza:{" "}
                      <span className="text-[var(--cream)]">
                        {format(b.preferredAt, "d MMMM yyyy, HH:mm", {
                          locale: it,
                        })}
                      </span>
                    </p>
                  ) : null}
                  {b.message ? (
                    <p className="mt-2 rounded-md bg-[var(--ink)]/60 p-3 text-sm text-[var(--sand)]">
                      {b.message}
                    </p>
                  ) : null}
                  <p className="text-xs text-[var(--stone)]">
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
                      className="text-xs uppercase tracking-wider text-[var(--sand)]"
                    >
                      Stato
                    </label>
                    <select
                      id={`status-${b.id}`}
                      name="status"
                      defaultValue={b.status}
                      className="rounded-md border border-[color-mix(in_srgb,var(--stone)_40%,transparent)] bg-[var(--ink)] px-3 py-2 text-sm text-[var(--cream)] outline-none ring-[var(--terracotta)] focus:ring-2"
                    >
                      {BOOKING_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded-md bg-[var(--terracotta)] py-2 text-sm font-medium text-[var(--cream)] transition-colors hover:bg-[var(--terracotta-deep)]"
                    >
                      Aggiorna stato
                    </button>
                  </form>
                  <p className="text-xs text-[var(--stone)]">
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
