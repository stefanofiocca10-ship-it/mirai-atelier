import type { Metadata } from "next";
import { ToriiFrame } from "@/components/brand/ToriiFrame";
import { StudioCalendar } from "@/components/home/StudioCalendar";
import { ContactActions } from "@/components/contact/ContactActions";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Calendario",
  description: `Appuntamenti in agenda all'atelier ${SITE.shortName}.`,
  openGraph: {
    title: `Calendario · ${SITE.shortName}`,
    description: "Elenco degli appuntamenti in atelier.",
  },
};

export default async function CalendarioPage() {
  const from = new Date();
  from.setHours(0, 0, 0, 0);
  const to = new Date(from);
  to.setDate(to.getDate() + 60);

  const appointments = await prisma.appointment.findMany({
    where: {
      startsAt: { gte: from, lte: to },
      status: { not: "ANNULLATO" },
    },
    orderBy: { startsAt: "asc" },
    take: 100,
  });

  return (
    <div className="min-h-[100svh] pt-20 pb-[max(5rem,env(safe-area-inset-bottom))] sm:pt-24">
      <div className="mx-auto max-w-atelier px-4 sm:px-6 md:px-8">
        <ToriiFrame
          variant="myojin"
          className="mx-auto max-w-2xl"
          contentClassName="px-4 py-6 text-center sm:px-8 sm:py-10"
        >
          <p className="label-atelier">Atelier</p>
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl md:text-5xl">
            Calendario
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted sm:text-base">
            Gli appuntamenti in agenda. Per una consulenza contattaci
            direttamente.
          </p>
        </ToriiFrame>

        <div className="mt-6 sm:mt-10">
          <StudioCalendar
            appointments={appointments.map((a) => ({
              id: a.id,
              title: a.title,
              guestName: a.guestName,
              startsAt: a.startsAt.toISOString(),
              endsAt: a.endsAt?.toISOString() ?? null,
              status: a.status,
            }))}
          />
        </div>

        <ToriiFrame
          variant="shinmei"
          className="mx-auto mt-10 max-w-xl"
          contentClassName="px-4 py-7 text-center sm:px-8 sm:py-8"
        >
          <p className="label-atelier">Prenota</p>
          <h2 className="mt-3 font-display text-2xl text-ink">
            Scrivici per un posto in agenda
          </h2>
          <div className="mt-6 flex w-full justify-center">
            <ContactActions
              variant="hero"
              className="w-full max-w-sm sm:max-w-none"
            />
          </div>
        </ToriiFrame>
      </div>
    </div>
  );
}
