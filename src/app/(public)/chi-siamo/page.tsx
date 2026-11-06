import type { Metadata } from "next";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { SITE, CONTACT, ARTISTS } from "@/lib/constants";
import { ContactActions } from "@/components/contact/ContactActions";
import { Logo } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "Chi siamo",
  description: `La filosofia di ${SITE.name} e i profili di Margot (piercing) e Valentina (tattoo).`,
};

export default function ChiSiamoPage() {
  return (
    <div className="min-h-[100dvh] pt-24 pb-20 sm:pt-28">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8">
        <div className="surface border border-line/80 p-5 sm:p-8 md:p-10">
          <div className="mb-8">
            <Logo size="md" href={null} />
          </div>
          <p className="label-atelier">Atelier</p>
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl md:text-5xl">
            Chi siamo
          </h1>
          <div className="divider-atelier mt-8" />

          <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted sm:text-base md:text-lg">
            <p>
              <strong className="font-display text-ink">{SITE.name}</strong> nasce
              come spazio raccolto — un atelier dove tatuaggio, piercing e
              gioielleria convivono con la stessa attenzione al dettaglio.
            </p>
            <p>
              L&apos;ispirazione è giapponese e contemporanea: meno eccesso, più
              presenza. Il kanji{" "}
              <span className="text-khaki-deep">{SITE.kanji}</span> — futuro —
              ricorda che ogni segno sul corpo è un passaggio, non un gesto
              frettoloso.
            </p>
            <p>
              Lavoriamo con materiali idonei al piercing e accompagniamo ogni
              scelta con una consulenza chiara su anatomia, stile e manutenzione.
            </p>
            <p>
              Seguici su{" "}
              <a
                href={CONTACT.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline-offset-4 hover:underline"
              >
                Instagram
              </a>{" "}
              o contattaci per una consulenza.
            </p>
          </div>
        </div>

        <section className="mt-10 sm:mt-14">
          <div className="mb-6 text-center sm:mb-8 sm:text-left">
            <p className="label-atelier">Le artiste</p>
            <h2 className="mt-3 font-display text-2xl text-ink sm:text-3xl">
              Chi lavora con te
            </h2>
            <p className="mt-3 text-sm text-muted sm:text-base">
              Due percorsi distinti, la stessa cura: piercing e tatuaggio sotto
              lo stesso tetto.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {ARTISTS.map((artist) => (
              <div
                key={artist.id}
                className="surface border border-line/80 p-5 sm:p-7"
              >
                <p className="text-[11px] tracking-[0.22em] text-khaki-deep uppercase">
                  {artist.role}
                </p>
                <h3 className="mt-3 font-display text-2xl text-ink sm:text-3xl">
                  {artist.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{artist.specialty}</p>
                <div className="divider-atelier my-5" />
                <p className="text-sm leading-relaxed text-muted">{artist.bio}</p>
                <a
                  href={artist.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-11 items-center gap-2 border border-line bg-paper/80 px-4 py-2.5 text-sm text-ink transition hover:border-khaki"
                >
                  <Instagram className="h-4 w-4" />
                  {artist.instagram.handle}
                </a>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:flex-wrap">
          <Link href="/prenota" className="btn-primary w-full sm:w-auto">
            Prenota una consulenza
          </Link>
          <Link href="/catalogo" className="btn-ghost w-full sm:w-auto">
            Apri il catalogo
          </Link>
        </div>

        <div className="mt-8">
          <ContactActions />
        </div>
      </article>
    </div>
  );
}
