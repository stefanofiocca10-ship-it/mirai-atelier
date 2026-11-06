"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Sfondo atelier: banco da lavoro, luce soft da studio,
 * kanji 未来, tratti tattoo e anelli piercing.
 * Su mobile: altezza bloccata + motion ridotto per evitare saltelli allo scroll.
 */
export function MiraiAtmosphere() {
  const reduce = useReducedMotion();
  const [coarse, setCoarse] = useState(false);
  const [lockedH, setLockedH] = useState<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener("change", sync);

    // Altezza fissa allo start: non seguire il resize della barra URL mobile
    const lock = () => {
      setLockedH(Math.ceil(Math.max(window.innerHeight, window.screen?.height ? window.screen.height * 0.5 : 0)));
    };
    lock();

    const onOrient = () => lock();
    window.addEventListener("orientationchange", onOrient);

    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("orientationchange", onOrient);
    };
  }, []);

  const calm = Boolean(reduce || coarse);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 w-full overflow-hidden"
      style={{
        height: lockedH ? `${lockedH}px` : "100lvh",
        // Layer compositing stabile su iOS durante lo scroll
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      <div className="absolute inset-0 bg-[#E8E2D6]" />

      {/* Banco atelier — ken-burns solo desktop */}
      <motion.div
        className="absolute inset-[-4%]"
        animate={
          calm
            ? undefined
            : {
                scale: [1.04, 1.08, 1.05],
                x: ["0%", "-1%", "0.4%"],
              }
        }
        transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/images/atmosphere/atelier-studio.jpg"
          alt=""
          fill
          priority
          className="object-cover object-[center_45%]"
          sizes="100vw"
          unoptimized
        />
      </motion.div>

      {/* Wash caldo — bilanciato per leggibilità */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 65% at 22% 18%, rgba(255,248,235,0.38), transparent 58%), radial-gradient(ellipse 70% 55% at 80% 78%, rgba(168,146,114,0.22), transparent 52%)",
        }}
      />

      {/* Fascio di luce soft */}
      {!calm && (
        <motion.div
          className="absolute -left-[15%] top-[-20%] h-[150%] w-[45%] -rotate-[8deg]"
          style={{
            background:
              "linear-gradient(95deg, transparent, rgba(255,252,245,0.16), transparent)",
          }}
          animate={{ x: ["-5%", "14%", "-5%"], opacity: [0.22, 0.34, 0.22] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Kanji 未来 — sempre dritti; senza drift Y su mobile */}
      <motion.div
        className="absolute left-[-2%] top-[4%] select-none font-display text-[min(46vw,19rem)] leading-none text-ink/[0.07] md:left-[3%] md:text-[min(30vw,20rem)]"
        animate={
          calm
            ? { opacity: 0.45 }
            : {
                opacity: [0.35, 0.65, 0.4, 0.35],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        未
      </motion.div>

      <motion.div
        className="absolute bottom-[0%] right-[-3%] select-none font-display text-[min(50vw,21rem)] leading-none text-khaki-deep/28 md:right-[1%] md:text-[min(32vw,22rem)]"
        animate={
          calm
            ? { opacity: 0.4 }
            : {
                opacity: [0.3, 0.55, 0.35, 0.3],
              }
        }
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        来
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 select-none font-display text-[min(38vw,12rem)] tracking-[0.18em] text-ink/[0.055] md:text-[10rem]"
        animate={
          calm
            ? { opacity: 0.35 }
            : {
                opacity: [0.22, 0.45, 0.28, 0.22],
                letterSpacing: ["0.18em", "0.24em", "0.18em"],
              }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        未来
      </motion.div>

      {/* SVG: tratti ink + anelli — animazioni soft, niente drift su mobile */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="atelierInk" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#111111" stopOpacity="0" />
            <stop offset="35%" stopColor="#111111" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#A89272" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#C4B396" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.path
          d="M-40 320 C200 120, 380 420, 600 210 S940 90, 1160 340 S1400 520, 1560 300"
          stroke="url(#atelierInk)"
          strokeWidth="1.6"
          strokeLinecap="round"
          animate={
            calm
              ? { opacity: 0.35 }
              : {
                  pathLength: [0.25, 1, 0.4, 0.25],
                  opacity: [0.25, 0.55, 0.3, 0.25],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <path
          d="M80 780 C280 700, 420 820, 620 740 S920 640, 1120 760 S1320 820, 1480 700"
          stroke="#A89272"
          strokeWidth="1"
          strokeLinecap="round"
          strokeOpacity="0.28"
        />

        <g>
          <circle cx="240" cy="660" r="52" stroke="#A89272" strokeWidth="1.1" strokeOpacity="0.32" />
          <circle cx="240" cy="660" r="28" stroke="#C4B396" strokeWidth="0.9" strokeOpacity="0.3" />
          <circle cx="240" cy="660" r="3" fill="#A89272" fillOpacity="0.4" />
        </g>

        <g>
          <circle cx="1220" cy="200" r="42" stroke="#111111" strokeWidth="1" strokeOpacity="0.14" />
          <circle cx="1220" cy="200" r="20" stroke="#A89272" strokeWidth="0.85" strokeOpacity="0.28" />
        </g>

        <ellipse
          cx="980"
          cy="720"
          rx="34"
          ry="22"
          stroke="#C4B396"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
      </svg>

      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
        }}
      />

      {/* Velatura carta — testo leggibile, foto ancora visibile */}
      <div className="absolute inset-0 bg-gradient-to-b from-paper/32 via-paper/20 to-paper/36" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 42%, rgba(244,241,235,0.4) 100%)",
        }}
      />
    </div>
  );
}
