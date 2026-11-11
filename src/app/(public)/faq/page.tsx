import type { Metadata } from "next";
import Link from "next/link";
import { ToriiFrame } from "@/components/brand/ToriiFrame";
import { ContactActions } from "@/components/contact/ContactActions";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { FAQ_INTRO, FAQ_SECTIONS } from "@/lib/faq-piercing";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQ Piercing",
  description: `Come vengono eseguiti i piercing al ${SITE.shortName} e come curarli, con le indicazioni di Margot.`,
  openGraph: {
    title: `FAQ Piercing · ${SITE.shortName}`,
    description:
      "Procedura in atelier, materiali, tempi di guarigione e aftercare.",
  },
};

export default function FaqPage() {
  return (
    <div className="min-h-[100svh] pt-20 pb-[max(5rem,env(safe-area-inset-bottom))] sm:pt-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8">
        <ToriiFrame
          variant="myojin"
          contentClassName="px-4 py-6 text-center sm:px-8 sm:py-10 sm:text-left"
        >
          <p className="label-atelier">{FAQ_INTRO.eyebrow}</p>
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl md:text-5xl">
            {FAQ_INTRO.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
            {FAQ_INTRO.lead} Tocca una domanda per aprirla.
          </p>
        </ToriiFrame>

        <FaqAccordion sections={FAQ_SECTIONS} />

        <ToriiFrame
          variant="myojin"
          className="mt-10 sm:mt-12"
          contentClassName="px-4 py-7 text-center sm:px-8 sm:py-8"
        >
          <p className="label-atelier">Dubbi?</p>
          <h2 className="mt-3 font-display text-2xl text-ink">
            Scrivici prima della seduta
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Margot preferisce chiarire anatomia e cura insieme a te, piuttosto
            che lasciare domande aperte.
          </p>
          <div className="mt-6 flex w-full justify-center">
            <ContactActions variant="hero" className="w-full max-w-sm sm:max-w-none" />
          </div>
          <Link href="/contatti" className="btn-ghost mt-4 w-full max-w-sm sm:w-auto">
            Vai ai contatti
          </Link>
        </ToriiFrame>
      </div>
    </div>
  );
}
