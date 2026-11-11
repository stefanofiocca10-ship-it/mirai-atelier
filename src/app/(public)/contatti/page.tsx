import type { Metadata } from "next";
import { Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { CONTACT, SITE, whatsappUrl } from "@/lib/constants";
import { ContactActions } from "@/components/contact/ContactActions";
import { ToriiFrame } from "@/components/brand/ToriiFrame";
import {
  DAY_LABELS,
  formatScheduleLine,
  getStudioInfo,
  mapsEmbedUrl,
} from "@/lib/studio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contatti",
  description: `Contatta ${SITE.name}: indirizzo, orari, WhatsApp, telefono e Instagram.`,
  openGraph: {
    title: `Contatti · ${SITE.shortName}`,
    description: "Dove siamo, orari e canali diretti.",
  },
};

export default async function ContattiPage() {
  const studio = await getStudioInfo();

  return (
    <div className="min-h-[100svh] pt-20 pb-[max(5rem,env(safe-area-inset-bottom))] sm:pt-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8">
        <ToriiFrame
          variant="myojin"
          contentClassName="px-4 py-6 text-center sm:px-8 sm:py-10 sm:text-left"
        >
          <p className="label-atelier">Contatti · Prenota</p>
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl md:text-5xl">
            I nostri contatti, per te
          </h1>
          <p className="mt-4 text-sm text-ink-soft sm:text-base">
            Per una consulenza tattoo, piercing o gioielleria ti rispondiamo
            direttamente su WhatsApp, al telefono o su Instagram — senza form
            intermedi.
          </p>
        </ToriiFrame>

        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 md:grid-cols-3">
          <a
            href={whatsappUrl(
              "Ciao Mirai! Vorrei informazioni per una consulenza."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition hover:opacity-95"
          >
            <ToriiFrame variant="myojin" contentClassName="p-5 sm:p-6">
              <MessageCircle className="h-5 w-5 text-khaki-deep" />
              <h2 className="mt-4 font-display text-xl text-ink">WhatsApp</h2>
              <p className="mt-2 text-sm text-ink-soft">
                {CONTACT.whatsapp.display}
              </p>
              <p className="mt-3 text-xs tracking-[0.14em] text-khaki-deep uppercase">
                Consigliato
              </p>
            </ToriiFrame>
          </a>

          <a href={CONTACT.phone.href} className="block transition hover:opacity-95">
            <ToriiFrame variant="shinmei" contentClassName="p-5 sm:p-6">
              <Phone className="h-5 w-5 text-khaki-deep" />
              <h2 className="mt-4 font-display text-xl text-ink">Telefono</h2>
              <p className="mt-2 text-sm text-ink-soft">{CONTACT.phone.display}</p>
            </ToriiFrame>
          </a>

          <a
            href={CONTACT.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition hover:opacity-95"
          >
            <ToriiFrame variant="myojin" contentClassName="p-5 sm:p-6">
              <Instagram className="h-5 w-5 text-khaki-deep" />
              <h2 className="mt-4 font-display text-xl text-ink">Instagram</h2>
              <p className="mt-2 text-sm text-ink-soft">
                {CONTACT.instagram.handle}
              </p>
            </ToriiFrame>
          </a>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <ToriiFrame variant="shinmei" contentClassName="p-5 sm:p-6">
            <MapPin className="h-5 w-5 text-khaki-deep" />
            <h2 className="mt-4 font-display text-xl text-ink">Dove siamo</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {studio.address}
            </p>
            <a
              href={studio.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-5"
            >
              Apri in Google Maps
            </a>
          </ToriiFrame>

          <ToriiFrame variant="myojin" contentClassName="p-5 sm:p-6">
            <p className="label-atelier">Orari indicativi</p>
            <ul className="mt-4 space-y-2 text-sm">
              {studio.schedule.map((day) => (
                <li
                  key={day.day}
                  className="flex justify-between gap-4 border-b border-line/60 pb-2 last:border-0"
                >
                  <span className="text-muted">{DAY_LABELS[day.day]}</span>
                  <span className="text-right text-ink">
                    {formatScheduleLine(day)}
                  </span>
                </li>
              ))}
            </ul>
          </ToriiFrame>
        </div>

        <ToriiFrame
          variant="shinmei"
          className="mt-8"
          contentClassName="overflow-hidden p-0"
        >
          <div className="border-b border-line px-5 py-3">
            <p className="label-atelier">Mappa</p>
          </div>
          <iframe
            title={`Mappa ${SITE.shortName}`}
            src={mapsEmbedUrl(studio.address)}
            className="h-64 w-full border-0 sm:h-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </ToriiFrame>

        <div className="mt-8">
          <ToriiFrame
            variant="shinmei"
            contentClassName="px-5 py-6 text-center sm:px-8 sm:text-left"
          >
            <p className="text-sm text-ink-soft">
              Preferisci aprire subito il canale? Usa i tasti qui sotto.
            </p>
            <div className="mt-5 flex justify-center sm:justify-start">
              <ContactActions variant="hero" />
            </div>
          </ToriiFrame>
        </div>
      </div>
    </div>
  );
}
