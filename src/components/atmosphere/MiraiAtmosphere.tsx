"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Sfondo narrativo “video”: lastre figurative Giappone/atelier con ken-burns,
 * kanji 未来 dritti, tratti tattoo e anelli piercing in dissolvenza.
 */
export function MiraiAtmosphere() {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base warm paper */}
      <div className="absolute inset-0 bg-[#EDE7DC]" />

      {/* Scene A — sumi-e / Giappone (ken-burns) */}
      <motion.div
        className="absolute inset-[-8%]"
        animate={
          reduce
            ? undefined
            : {
                scale: [1.08, 1.18, 1.1],
                x: ["0%", "-3%", "1%"],
                y: ["0%", "-2%", "1%"],
                opacity: [0.55, 0.75, 0.45, 0.55],
              }
        }
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/images/atmosphere/japan-ink.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          unoptimized
        />
      </motion.div>

      {/* Scene B — atelier piercing/tattoo (crossfade + pan) */}
      <motion.div
        className="absolute inset-[-10%]"
        animate={
          reduce
            ? { opacity: 0.25 }
            : {
                scale: [1.12, 1.05, 1.16],
                x: ["2%", "-2%", "0%"],
                y: ["-1%", "2%", "0%"],
                opacity: [0.15, 0.55, 0.2, 0.15],
              }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      >
        <Image
          src="/images/atmosphere/atelier-detail.jpg"
          alt=""
          fill
          className="object-cover object-[center_40%]"
          sizes="100vw"
          unoptimized
        />
      </motion.div>

      {/* Warm khaki wash — unisce le due scene */}
      <motion.div
        className="absolute inset-0 mix-blend-multiply"
        animate={
          reduce
            ? undefined
            : {
                background: [
                  "radial-gradient(ellipse 90% 70% at 18% 20%, rgba(196,179,150,0.55), transparent 55%), radial-gradient(ellipse 80% 60% at 85% 80%, rgba(168,146,114,0.4), transparent 50%)",
                  "radial-gradient(ellipse 90% 70% at 78% 30%, rgba(196,179,150,0.5), transparent 55%), radial-gradient(ellipse 80% 60% at 20% 75%, rgba(168,146,114,0.45), transparent 50%)",
                  "radial-gradient(ellipse 90% 70% at 18% 20%, rgba(196,179,150,0.55), transparent 55%), radial-gradient(ellipse 80% 60% at 85% 80%, rgba(168,146,114,0.4), transparent 50%)",
                ],
              }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Soft light shaft — come luce da shoji */}
      <motion.div
        className="absolute -left-[20%] top-[-10%] h-[140%] w-[55%] rotate-12"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,250,240,0.28), transparent)",
        }}
        animate={reduce ? undefined : { x: ["-10%", "40%", "-10%"], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Kanji story — sempre dritti */}
      <motion.div
        className="absolute left-[-2%] top-[4%] select-none font-display text-[min(46vw,19rem)] leading-none text-ink/[0.07] md:left-[3%] md:text-[min(30vw,20rem)]"
        animate={
          reduce
            ? undefined
            : {
                y: [0, -28, 8, 0],
                opacity: [0.35, 0.7, 0.4, 0.35],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        未
      </motion.div>

      <motion.div
        className="absolute bottom-[0%] right-[-3%] select-none font-display text-[min(50vw,21rem)] leading-none text-khaki-deep/30 md:right-[1%] md:text-[min(32vw,22rem)]"
        animate={
          reduce
            ? undefined
            : {
                y: [0, 24, -10, 0],
                opacity: [0.3, 0.65, 0.35, 0.3],
              }
        }
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        来
      </motion.div>

      {/* Titolo 未来 — pulse da “titolo film” */}
      <motion.div
        className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 select-none font-display text-[min(38vw,12rem)] tracking-[0.18em] text-ink/[0.06] md:text-[10rem]"
        animate={
          reduce
            ? undefined
            : {
                opacity: [0.25, 0.55, 0.3, 0.25],
                scale: [1, 1.04, 1.01, 1],
                letterSpacing: ["0.18em", "0.28em", "0.18em"],
              }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        未来
      </motion.div>

      {/* Petali / scintille — storia giapponese leggera */}
      {!reduce &&
        [
          { left: "12%", delay: 0, dur: 14 },
          { left: "28%", delay: 2.2, dur: 16 },
          { left: "55%", delay: 1.1, dur: 13 },
          { left: "72%", delay: 3.4, dur: 15 },
          { left: "88%", delay: 0.6, dur: 17 },
          { left: "41%", delay: 4.5, dur: 12 },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="absolute top-[-5%] h-2.5 w-2 rounded-full bg-khaki/50 blur-[0.5px]"
            style={{ left: p.left }}
            animate={{
              y: ["0vh", "110vh"],
              x: [0, i % 2 === 0 ? 40 : -36, 12],
              rotate: [0, 120, 260],
              opacity: [0, 0.7, 0.5, 0],
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}

      {/* SVG: tratti tattoo + anelli piercing */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="miraiInk" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#111111" stopOpacity="0" />
            <stop offset="40%" stopColor="#111111" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#A89272" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#C4B396" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="miraiKhaki" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C4B396" stopOpacity="0" />
            <stop offset="45%" stopColor="#A89272" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#C4B396" stopOpacity="0" />
          </linearGradient>
          <filter id="miraiGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Tratto tattoo che “disegna” */}
        <motion.path
          d="M-60 280 C180 60, 360 400, 580 180 S920 60, 1140 300 S1380 500, 1540 280"
          stroke="url(#miraiInk)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#miraiGlow)"
          animate={
            reduce
              ? undefined
              : {
                  pathLength: [0.15, 1, 0.35, 0.15],
                  opacity: [0.35, 0.85, 0.45, 0.35],
                }
          }
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Onda ukiyo-e stilizzata */}
        <motion.path
          d="M-40 700 C160 620, 280 780, 460 680 S740 560, 920 700 S1180 820, 1520 660"
          stroke="url(#miraiKhaki)"
          strokeWidth="1.6"
          strokeLinecap="round"
          animate={
            reduce
              ? undefined
              : {
                  d: [
                    "M-40 700 C160 620, 280 780, 460 680 S740 560, 920 700 S1180 820, 1520 660",
                    "M-40 680 C180 600, 300 760, 480 660 S760 540, 940 720 S1200 800, 1520 640",
                    "M-40 720 C140 640, 260 790, 440 700 S720 580, 900 680 S1160 840, 1520 680",
                    "M-40 700 C160 620, 280 780, 460 680 S740 560, 920 700 S1180 820, 1520 660",
                  ],
                  opacity: [0.4, 0.75, 0.45, 0.4],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Anelli piercing fluttuanti */}
        <motion.g
          animate={reduce ? undefined : { x: [0, 36, -12, 0], y: [0, -28, 14, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="220" cy="640" r="58" stroke="#A89272" strokeWidth="1.2" strokeOpacity="0.45" />
          <circle cx="220" cy="640" r="32" stroke="#C4B396" strokeWidth="1" strokeOpacity="0.4" />
          <circle cx="220" cy="640" r="3.5" fill="#A89272" fillOpacity="0.55" />
        </motion.g>

        <motion.g
          animate={reduce ? undefined : { x: [0, -30, 16, 0], y: [0, 22, -10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="1180" cy="210" r="46" stroke="#111111" strokeWidth="1" strokeOpacity="0.22" />
          <circle cx="1180" cy="210" r="22" stroke="#A89272" strokeWidth="0.9" strokeOpacity="0.4" />
        </motion.g>

        <motion.g
          animate={reduce ? undefined : { x: [0, 20, -18, 0], y: [0, -14, 10, 0], rotate: [0, 8, -4, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "960px 740px" }}
        >
          <ellipse
            cx="960"
            cy="740"
            rx="38"
            ry="24"
            stroke="#C4B396"
            strokeWidth="1.1"
            strokeOpacity="0.42"
          />
        </motion.g>

        {/* Studs / punti luce */}
        {[
          [160, 160, 7],
          [520, 760, 8],
          [760, 100, 6],
          [1040, 480, 9],
          [880, 360, 7],
          [340, 400, 6.5],
          [1280, 760, 8],
        ].map(([x, y, dur], i) => (
          <motion.circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="2.6"
            fill="#A89272"
            animate={
              reduce
                ? undefined
                : {
                    opacity: [0.15, 0.9, 0.2],
                    r: [2, 4.2, 2],
                    cy: [y, y - 22, y],
                  }
            }
            transition={{
              duration: Number(dur),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </svg>

      {/* Film grain leggero */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
        }}
      />

      {/* Vignette + velo leggibilità */}
      <div className="absolute inset-0 bg-gradient-to-b from-paper/50 via-paper/15 to-paper/55" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(244,241,235,0.55) 100%)",
        }}
      />

      {!reduce && (
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.12, 0.28, 0.12] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(circle at 50% 38%, rgba(255,252,245,0.35), transparent 58%)",
          }}
        />
      )}
    </div>
  );
}
