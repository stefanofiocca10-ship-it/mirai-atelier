"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";
import { Logo } from "@/components/brand/Logo";
import { MotionLink } from "@/components/ui/MotionPressable";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] min-h-[100dvh] items-center justify-center overflow-hidden">
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
          className="mt-6 max-w-md px-2 text-sm leading-relaxed text-muted sm:mt-8 md:text-base"
        >
          {SITE.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center"
        >
          <MotionLink href="/catalogo" className="btn-primary w-full sm:w-auto">
            Esplora il Catalogo
          </MotionLink>
          <MotionLink href="/prenota" className="btn-ghost w-full sm:w-auto">
            Prenota una Consulenza
          </MotionLink>
        </motion.div>
      </div>
    </section>
  );
}
