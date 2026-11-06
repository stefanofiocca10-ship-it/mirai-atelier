"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function AboutPreview() {
  return (
    <section className="border-y border-line/60 py-16 md:py-28">
      <div className="mx-auto grid max-w-atelier gap-8 px-4 sm:px-6 md:grid-cols-12 md:gap-16 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="surface border border-line/80 p-6 sm:p-8 md:col-span-5"
        >
          <p className="label-atelier">Chi siamo</p>
          <h2 className="mt-4 font-display text-2xl leading-tight text-ink sm:text-3xl md:text-4xl">
            Precisione.
            <br />
            Calma.
            <br />
            Essenza.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="space-y-5 text-sm leading-relaxed text-muted sm:text-base md:col-span-7 md:text-lg"
        >
          <p>
            Mirai è un atelier dove tatuaggio, piercing e gioielleria convivono
            con la stessa attenzione al dettaglio. Un&apos;estetica giapponese
            contemporanea: meno rumore, più cura.
          </p>
          <p>
            Ogni scelta sul corpo nasce da un dialogo — anatomia, materiale,
            proporzione. Come nelle botteghe tradizionali, la bellezza resta nei
            gesti precisi.
          </p>
          <Link
            href="/chi-siamo"
            className="inline-block pt-2 text-sm tracking-[0.18em] text-ink uppercase underline-offset-4 hover:underline"
          >
            Scopri lo studio
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
