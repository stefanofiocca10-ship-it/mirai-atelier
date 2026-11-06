import type { Metadata } from "next";
import { Instagram, MessageCircle, Phone } from "lucide-react";
import { CONTACT, SITE, whatsappUrl } from "@/lib/constants";
import { ContactActions } from "@/components/contact/ContactActions";

export const metadata: Metadata = {
  title: "Contatti",
  description: `Contatta ${SITE.name}.`,
};

export default function ContattiPage() {
  return (
    <div className="min-h-[100dvh] pt-24 pb-20 sm:pt-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8">
        <div className="surface border border-line/80 px-5 py-8 text-center sm:px-8 sm:py-10 sm:text-left">
          <p className="label-atelier">Contatti</p>
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl md:text-5xl">
            Restiamo in contatto
          </h1>
          <p className="mt-4 text-sm text-muted sm:text-base">
            Messaggio, telefonata o Instagram — scegli il canale più comodo.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-3">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="surface border border-line/80 p-5 transition hover:border-khaki sm:p-6"
          >
            <MessageCircle className="h-5 w-5 text-[#25D366]" />
            <h2 className="mt-4 font-display text-xl text-ink">WhatsApp</h2>
            <p className="mt-2 text-sm text-muted">{CONTACT.whatsapp.display}</p>
          </a>

          <a
            href={CONTACT.phone.href}
            className="surface border border-line/80 p-5 transition hover:border-khaki sm:p-6"
          >
            <Phone className="h-5 w-5 text-khaki-deep" />
            <h2 className="mt-4 font-display text-xl text-ink">Telefono</h2>
            <p className="mt-2 text-sm text-muted">{CONTACT.phone.display}</p>
          </a>

          <a
            href={CONTACT.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="surface border border-line/80 p-5 transition hover:border-khaki sm:p-6"
          >
            <Instagram className="h-5 w-5 text-ink" />
            <h2 className="mt-4 font-display text-xl text-ink">Instagram</h2>
            <p className="mt-2 text-sm text-muted">{CONTACT.instagram.handle}</p>
          </a>
        </div>

        <div className="mt-8 flex justify-center sm:justify-start">
          <ContactActions variant="hero" />
        </div>
      </div>
    </div>
  );
}
