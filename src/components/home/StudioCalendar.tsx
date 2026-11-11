import { format } from "date-fns";
import { it } from "date-fns/locale";
import { ToriiFrame } from "@/components/brand/ToriiFrame";

export type CalendarAppointment = {
  id: string;
  title: string | null;
  guestName: string | null;
  startsAt: string;
  endsAt: string | null;
  status: string;
};

type Props = {
  appointments?: CalendarAppointment[];
};

export function StudioCalendar({ appointments = [] }: Props) {
  const items = [...appointments].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );

  return (
    <ToriiFrame variant="shinmei" contentClassName="p-4 sm:p-6 md:p-8">
      <p className="label-atelier">Agenda</p>
      <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
        Prossimi appuntamenti
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted">
        Gli appuntamenti in atelier, in ordine di data.
      </p>

      {items.length === 0 ? (
        <p className="mt-6 border border-line bg-paper-soft/70 px-4 py-6 text-sm text-muted">
          Nessun appuntamento in agenda.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-line border border-line">
          {items.map((a) => {
            const start = new Date(a.startsAt);
            const end = a.endsAt ? new Date(a.endsAt) : null;
            const endValid =
              end && !Number.isNaN(end.getTime()) && end > start;
            const who = a.guestName || a.title || "Appuntamento";
            const detail =
              a.guestName && a.title ? a.title : null;

            return (
              <li key={a.id} className="bg-paper px-4 py-4 sm:px-5">
                <p className="font-display text-lg text-ink sm:text-xl">
                  {format(start, "EEEE d MMMM", { locale: it })}
                </p>
                <p className="mt-1 text-sm text-ink">
                  {format(start, "HH:mm", { locale: it })}
                  {endValid ? ` – ${format(end, "HH:mm", { locale: it })}` : ""}
                  <span className="text-muted"> · {who}</span>
                  {detail ? (
                    <span className="text-muted"> · {detail}</span>
                  ) : null}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </ToriiFrame>
  );
}
