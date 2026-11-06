"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";
import { Logo } from "@/components/brand/Logo";
import { MotionLink } from "@/components/ui/MotionPressable";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div className="relative z-10 mx-auto flex w-full max-w-atelier flex-col items-center px-4 pb-16 pt-24 text-center sm:px-6 md:px-8 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-paper/35 blur-3xl" />
          <Logo size="hero" href={null} priority />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 whitespace-nowrap px-1 text-[clamp(0.68rem,2.55vw,1.05rem)] leading-none text-muted sm:mt-8"
        >
          {SITE.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="mt-8 flex flex-row flex-wrap items-center justify-center gap-3 sm:mt-10"
        >
          <MotionLink href="/catalogo" className="btn-primary">
            Esplora il Catalogo
          </MotionLink>
          <MotionLink href="/prenota" className="btn-primary">
            Prenota una Consulenza
          </MotionLink>
        </motion.div>
      </div>
    </section>
  );
}
