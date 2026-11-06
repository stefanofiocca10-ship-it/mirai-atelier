"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Sfondo atelier: banco da lavoro, luce soft da studio,
 * kanji 未来, tratti tattoo e anelli piercing.
 */
export function MiraiAtmosphere() {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#E8E2D6]" />

      {/* Banco atelier — ken-burns lento */}
      <motion.div
        className="absolute inset-[-6%]"
        animate={
          reduce
            ? undefined
            : {
                scale: [1.06, 1.12, 1.08],
                x: ["0%", "-1.5%", "0.5%"],
                y: ["0%", "-1%", "0.5%"],
              }
        }
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
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

      {/* Wash caldo leggero — non copre la foto */}
      <motion.div
        className="absolute inset-0 mix-blend-soft-light"
        animate={
          reduce
            ? undefined
            : {
                background: [
                  "radial-gradient(ellipse 80% 60% at 20% 15%, rgba(255,248,235,0.28), transparent 55%), radial-gradient(ellipse 65% 50% at 80% 75%, rgba(168,146,114,0.14), transparent 50%)",
                  "radial-gradient(ellipse 80% 60% at 72% 25%, rgba(255,248,235,0.22), transparent 55%), radial-gradient(ellipse 65% 50% at 28% 78%, rgba(168,146,114,0.16), transparent 50%)",
                  "radial-gradient(ellipse 80% 60% at 20% 15%, rgba(255,248,235,0.28), transparent 55%), radial-gradient(ellipse 65% 50% at 80% 75%, rgba(168,146,114,0.14), transparent 50%)",
                ],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Fascio di luce da finestra studio */}
      <motion.div
        className="absolute -left-[15%] top-[-20%] h-[150%] w-[45%] -rotate-[8deg]"
        style={{
          background:
            "linear-gradient(95deg, transparent, rgba(255,252,245,0.12), transparent)",
        }}
        animate={
          reduce ? undefined : { x: ["-5%", "18%", "-5%"], opacity: [0.2, 0.35, 0.2] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Kanji 未来 — sempre dritti */}
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

      {/* SVG: tratti ink + anelli piercing */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="atelierInk" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#111111" stopOpacity="0" />
            <stop offset="35%" stopColor="#111111" stopOpacity="0.28" />
            <stop offset="70%" stopColor="#A89272" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C4B396" stopOpacity="0" />
          </linearGradient>
          <filter id="atelierGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.path
          d="M-40 320 C200 120, 380 420, 600 210 S940 90, 1160 340 S1400 520, 1560 300"
          stroke="url(#atelierInk)"
          strokeWidth="1.8"
          strokeLinecap="round"
          filter="url(#atelierGlow)"
          animate={
            reduce
              ? undefined
              : {
                  pathLength: [0.2, 1, 0.4, 0.2],
                  opacity: [0.25, 0.65, 0.35, 0.25],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.path
          d="M80 780 C280 700, 420 820, 620 740 S920 640, 1120 760 S1320 820, 1480 700"
          stroke="#A89272"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeOpacity="0.35"
          animate={
            reduce
              ? undefined
              : {
                  pathLength: [0.1, 0.9, 0.25, 0.1],
                  opacity: [0.2, 0.5, 0.25, 0.2],
                }
          }
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Anelli piercing */}
        <motion.g
          animate={reduce ? undefined : { x: [0, 28, -10, 0], y: [0, -22, 12, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="240" cy="660" r="52" stroke="#A89272" strokeWidth="1.15" strokeOpacity="0.4" />
          <circle cx="240" cy="660" r="28" stroke="#C4B396" strokeWidth="0.95" strokeOpacity="0.38" />
          <circle cx="240" cy="660" r="3.2" fill="#A89272" fillOpacity="0.5" />
        </motion.g>

        <motion.g
          animate={reduce ? undefined : { x: [0, -24, 14, 0], y: [0, 18, -8, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="1220" cy="200" r="42" stroke="#111111" strokeWidth="1" strokeOpacity="0.18" />
          <circle cx="1220" cy="200" r="20" stroke="#A89272" strokeWidth="0.9" strokeOpacity="0.35" />
        </motion.g>

        <motion.g
          animate={
            reduce ? undefined : { x: [0, 16, -14, 0], y: [0, -12, 8, 0], rotate: [0, 6, -3, 0] }
          }
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "980px 720px" }}
        >
          <ellipse
            cx="980"
            cy="720"
            rx="34"
            ry="22"
            stroke="#C4B396"
            strokeWidth="1"
            strokeOpacity="0.38"
          />
        </motion.g>

        {/* Studs / riflessi metallo */}
        {[
          [180, 180, 7],
          [500, 740, 8],
          [780, 120, 6],
          [1060, 460, 9],
          [900, 340, 7],
          [360, 420, 6.5],
          [1300, 740, 8],
        ].map(([x, y, dur], i) => (
          <motion.circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="2.4"
            fill="#A89272"
            animate={
              reduce
                ? undefined
                : {
                    opacity: [0.12, 0.75, 0.18],
                    r: [1.8, 3.6, 1.8],
                    cy: [y, y - 16, y],
                  }
            }
            transition={{
              duration: Number(dur),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.45,
            }}
          />
        ))}
      </svg>

      {/* Grain leggero */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-paper/10 via-transparent to-paper/14" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(232,226,214,0.16) 100%)",
        }}
      />
    </div>
  );
}
