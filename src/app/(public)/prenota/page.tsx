import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/BookingForm";
import { ContactActions } from "@/components/contact/ContactActions";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Prenota una consulenza",
  description: `Prenota una consulenza presso ${SITE.name}.`,
};

export default function PrenotaPage() {
  return (
    <div className="min-h-[100dvh] pt-24 pb-20 sm:pt-28">
      <div className="mx-auto grid max-w-atelier gap-8 px-4 sm:px-6 md:grid-cols-2 md:gap-12 md:px-8">
        <div className="surface border border-line/80 p-5 sm:p-8">
          <p className="label-atelier">Consulenza</p>
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl md:text-5xl">
            Prenota
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            Raccontaci cosa hai in mente: tattoo, piercing o gioielleria.
            Rispondiamo al più presto — oppure contattaci subito.
          </p>
          <div className="mt-8">
            <ContactActions variant="stack" />
          </div>
        </div>

        <BookingForm />
      </div>
    </div>
  );
}
