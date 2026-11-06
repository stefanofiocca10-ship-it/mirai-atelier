import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { AboutPreview } from "@/components/home/AboutPreview";
import { ContactActions } from "@/components/contact/ContactActions";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutPreview />

      <section className="py-16 md:py-28">
        <div className="mx-auto max-w-atelier px-4 text-center sm:px-6 md:px-8">
          <div className="surface mx-auto max-w-2xl border border-line/80 px-5 py-10 sm:px-10 sm:py-14">
            <p className="label-atelier">Catalogo</p>
            <h2 className="mt-4 font-display text-2xl text-ink sm:text-3xl md:text-4xl">
              Scegli la zona. Trova il tuo piercing
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-muted sm:text-base">
              Parti da una mappa interattiva del viso: seleziona orecchio, naso,
              labbra o sopracciglio e scopri i gioielli per quella zona — oppure
              collane e bracciali.
            </p>
            <Link href="/catalogo" className="btn-primary mt-8">
              Apri la mappa
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line/60 py-16 md:py-24">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6 md:px-8">
          <div className="surface border border-line/80 px-5 py-10 sm:px-8">
            <p className="label-atelier">Contatti</p>
            <h2 className="mt-4 font-display text-2xl text-ink sm:text-3xl">
              Parliamone insieme
            </h2>
            <p className="mt-4 text-sm text-muted sm:text-base">
              WhatsApp, telefono fisso o Instagram — scegli il canale che
              preferisci.
            </p>
            <div className="mt-8 flex justify-center">
              <ContactActions variant="hero" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
