import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { AboutPreview } from "@/components/home/AboutPreview";
import { ContactActions } from "@/components/contact/ContactActions";
import { StudioCalendar } from "@/components/home/StudioCalendar";
import { ToriiFrame } from "@/components/brand/ToriiFrame";
import { MotionLink } from "@/components/ui/MotionPressable";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
    <>
      <Hero />
      <AboutPreview />

      <section className="py-10 sm:py-14 md:py-20">
        <div className="mx-auto max-w-atelier px-4 text-center sm:px-6 md:px-8">
          <ToriiFrame
            variant="myojin"
            className="mx-auto max-w-2xl"
            contentClassName="px-4 py-8 text-center sm:px-10 sm:py-14"
          >
            <p className="label-atelier">Catalogo</p>
            <h2 className="mt-4 font-display text-2xl text-ink sm:text-3xl md:text-4xl">
              Scegli la zona. Trova il tuo piercing
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-muted sm:text-base">
              Parti da una mappa interattiva del viso: seleziona orecchio, naso,
              labbra o sopracciglio e scopri i gioielli per quella zona — oppure
              collane e bracciali.
            </p>
            <MotionLink href="/catalogo" className="btn-primary mt-8">
              Apri la mappa
            </MotionLink>
          </ToriiFrame>
        </div>
      </section>

      <section className="border-t border-line/60 py-10 sm:py-14 md:py-20">
        <div className="mx-auto max-w-atelier px-4 sm:px-6 md:px-8">
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
      </section>

      <section className="py-10 sm:py-14 md:py-20">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6 md:px-8">
          <ToriiFrame
            variant="myojin"
            contentClassName="px-4 py-8 text-center sm:px-8 sm:py-10"
          >
            <p className="label-atelier">Galleria</p>
            <h2 className="mt-4 font-display text-2xl text-ink sm:text-3xl">
              Lavori dall&apos;atelier
            </h2>
            <p className="mt-4 text-sm text-muted sm:text-base">
              Una selezione di piercing e tatuaggi curata da Margot.
            </p>
            <Link href="/galleria" className="btn-primary mt-8">
              Vedi la galleria
            </Link>
          </ToriiFrame>
        </div>
      </section>

      <section className="border-t border-line/60 py-10 pb-[max(3rem,env(safe-area-inset-bottom))] sm:py-14 md:py-20">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6 md:px-8">
          <ToriiFrame
            variant="shinmei"
            contentClassName="px-4 py-8 text-center sm:px-8 sm:py-10"
          >
            <p className="label-atelier">Contatti</p>
            <h2 className="mt-4 font-display text-2xl text-ink sm:text-3xl">
              Parliamone insieme
            </h2>
            <p className="mt-4 text-sm text-ink-soft sm:text-base">
              Per una consulenza scrivici su WhatsApp, chiamaci o mandaci un
              messaggio su Instagram.{" "}
              <Link href="/faq" className="underline underline-offset-4 hover:text-ink">
                Leggi anche le FAQ piercing
              </Link>
              .
            </p>
            <div className="mt-8 flex justify-center">
              <ContactActions variant="hero" />
            </div>
          </ToriiFrame>
        </div>
      </section>
    </>
  );
}
