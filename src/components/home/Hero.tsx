"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";
import { Logo } from "@/components/brand/Logo";
import { ToriiFrame } from "@/components/brand/ToriiFrame";
import { MotionLink } from "@/components/ui/MotionPressable";

export function Hero() {
  return (
    <section className="relative flex min-h-[auto] items-start justify-center overflow-hidden sm:min-h-[75svh]">
      <div className="relative z-10 mx-auto flex w-full max-w-atelier flex-col items-center px-4 pb-10 pt-[4.75rem] text-center sm:px-6 sm:pb-12 sm:pt-20 md:px-8 md:pt-[5.25rem]">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-paper/35 blur-3xl" />
          <Logo size="hero" href={null} priority />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-4 w-full max-w-xl sm:mt-5"
        >
          <ToriiFrame
            variant="myojin"
            contentClassName="flex items-center justify-center px-3 py-3 text-[clamp(0.72rem,3.2vw,1.05rem)] leading-snug text-ink sm:px-5 sm:leading-none"
          >
            <p className="w-full text-center text-balance sm:whitespace-nowrap">
              {SITE.tagline}
            </p>
          </ToriiFrame>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="mt-5 flex w-full items-center justify-center sm:mt-6"
        >
          <div className="flex w-full max-w-sm flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap">
            <MotionLink
              href="/catalogo"
              className="btn-primary w-full justify-center sm:w-auto"
            >
              Esplora il Catalogo
            </MotionLink>
            <MotionLink
              href="/contatti"
              className="btn-ghost w-full justify-center sm:w-auto"
            >
              Contattaci
            </MotionLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
