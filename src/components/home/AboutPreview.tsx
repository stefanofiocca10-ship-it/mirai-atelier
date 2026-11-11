"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ToriiFrame } from "@/components/brand/ToriiFrame";

export function AboutPreview() {
  return (
    <section className="border-y border-line/60 py-10 sm:py-14 md:py-20">
      <div className="mx-auto grid max-w-atelier gap-6 px-4 sm:gap-8 sm:px-6 md:grid-cols-12 md:gap-16 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-5"
        >
          <ToriiFrame variant="myojin" contentClassName="p-4 sm:p-8">
            <p className="label-atelier">Chi siamo</p>
            <h2 className="mt-4 font-display text-2xl leading-tight text-ink sm:text-3xl md:text-4xl">
              Precisione.
              <br />
              Calma.
              <br />
              Essenza.
            </h2>
          </ToriiFrame>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="md:col-span-7"
        >
          <ToriiFrame
            variant="shinmei"
            contentClassName="space-y-5 p-4 text-sm leading-relaxed text-ink-soft sm:p-8 sm:text-base md:text-lg"
          >
            <p>
              Mirai è un atelier dove tatuaggio, piercing e gioielleria convivono
              con la stessa attenzione al dettaglio. Un&apos;estetica giapponese
              contemporanea: meno rumore, più cura.
            </p>
            <p>
              Ogni scelta sul corpo nasce da un dialogo — anatomia, materiale,
              proporzione. Come nelle botteghe tradizionali, la bellezza resta
              nei gesti precisi.
            </p>
            <Link href="/chi-siamo" className="btn-ghost mt-2">
              Scopri lo studio
            </Link>
          </ToriiFrame>
        </motion.div>
      </div>
    </section>
  );
}
