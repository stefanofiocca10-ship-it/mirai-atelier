"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CONTACT, SITE } from "@/lib/constants";
import { Logo } from "@/components/brand/Logo";
import {
  DAY_LABELS,
  DEFAULT_ADDRESS,
  DEFAULT_SCHEDULE,
  formatScheduleLine,
  mapsSearchUrl,
  type StudioInfo,
} from "@/lib/studio-shared";

export function Footer() {
  const [studio, setStudio] = useState<StudioInfo>({
    address: DEFAULT_ADDRESS,
    mapsUrl: mapsSearchUrl(DEFAULT_ADDRESS),
    schedule: DEFAULT_SCHEDULE,
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/studio")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: StudioInfo | null) => {
        if (!cancelled && data?.address) setStudio(data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const today = studio.schedule.find((d) => d.day === new Date().getDay());

  return (
    <footer className="relative z-10 border-t border-line/50 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto grid max-w-atelier gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 md:gap-12 md:px-8 md:py-16">
        <div>
          <Logo size="md" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            {SITE.tagline}
          </p>
          <a
            href={studio.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block text-sm text-muted transition hover:text-ink"
          >
            {studio.address}
          </a>
          {today ? (
            <p className="mt-2 text-xs text-muted-soft">
              Oggi ({DAY_LABELS[today.day]}): {formatScheduleLine(today)}
            </p>
          ) : null}
        </div>

        <div>
          <p className="label-atelier">Esplora</p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {[
              ["/chi-siamo", "Chi siamo"],
              ["/catalogo", "Catalogo"],
              ["/calendario", "Calendario"],
              ["/galleria", "Galleria"],
              ["/faq", "FAQ"],
              ["/contatti", "Contatti"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label-atelier">Contatti</p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <a href={CONTACT.phone.href} className="hover:text-ink">
                {CONTACT.phone.display}
              </a>
            </li>
            <li>
              <a
                href={CONTACT.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink"
              >
                WhatsApp {CONTACT.whatsapp.display}
              </a>
            </li>
            <li>
              <a
                href={CONTACT.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink"
              >
                {CONTACT.instagram.handle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line/70 px-4 py-5 text-center text-xs text-muted-soft sm:px-6 md:px-8">
        © {new Date().getFullYear()} {SITE.name}
      </div>
    </footer>
  );
}
