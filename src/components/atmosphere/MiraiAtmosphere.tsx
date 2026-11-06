"use client";

import { motion } from "framer-motion";

/**
 * Sfondo atmosferico continuo: kanji 未来 dritti + tratti tattoo/piercing
 * in cachi caldo. Animazione fluida, senza rotazione dei kanji.
 */
export function MiraiAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Living gradient base */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: "#EFEBE3" }}
        animate={{
          background: [
            "radial-gradient(ellipse 100% 80% at 20% 15%, rgba(196,179,150,0.45), transparent 55%), radial-gradient(ellipse 90% 70% at 80% 85%, rgba(168,146,114,0.28), transparent 50%), linear-gradient(160deg, #F7F4EE 0%, #EDE7DC 45%, #F5F1EA 100%)",
            "radial-gradient(ellipse 100% 80% at 75% 25%, rgba(196,179,150,0.4), transparent 55%), radial-gradient(ellipse 90% 70% at 25% 80%, rgba(168,146,114,0.32), transparent 50%), linear-gradient(200deg, #F5F1EA 0%, #E8E0D0 50%, #F7F4EE 100%)",
            "radial-gradient(ellipse 100% 80% at 20% 15%, rgba(196,179,150,0.45), transparent 55%), radial-gradient(ellipse 90% 70% at 80% 85%, rgba(168,146,114,0.28), transparent 50%), linear-gradient(160deg, #F7F4EE 0%, #EDE7DC 45%, #F5F1EA 100%)",
          ],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Kanji — sempre dritti, solo drift + fade (no rotate) */}
      <motion.div
        className="absolute left-[-4%] top-[6%] select-none font-display text-[min(48vw,20rem)] leading-none text-khaki/30 md:left-[2%] md:text-[min(32vw,22rem)]"
        style={{ writingMode: "horizontal-tb" }}
        animate={{
          y: [0, -40, 12, 0],
          x: [0, 24, -8, 0],
          opacity: [0.18, 0.38, 0.22, 0.18],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      >
        未
      </motion.div>

      <motion.div
        className="absolute bottom-[2%] right-[-4%] select-none font-display text-[min(52vw,22rem)] leading-none text-khaki-deep/25 md:right-[2%] md:text-[min(34vw,24rem)]"
        animate={{
          y: [0, 32, -16, 0],
          x: [0, -20, 10, 0],
          opacity: [0.15, 0.35, 0.2, 0.15],
        }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
      >
        来
      </motion.div>

      <motion.div
        className="absolute left-[8%] bottom-[18%] select-none font-display text-[min(28vw,9rem)] leading-none text-khaki/20 md:left-[12%] md:text-[8rem]"
        animate={{
          y: [0, -18, 0],
          opacity: [0.1, 0.28, 0.1],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      >
        未
      </motion.div>

      <motion.div
        className="absolute right-[10%] top-[22%] select-none font-display text-[min(26vw,8rem)] leading-none text-khaki-deep/18 md:text-[7rem]"
        animate={{
          y: [0, 20, 0],
          opacity: [0.08, 0.26, 0.08],
        }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        来
      </motion.div>

      {/* Central 未来 — dritto, pulse lento */}
      <motion.div
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 select-none font-display text-[min(42vw,14rem)] tracking-[0.12em] text-khaki/12 md:text-[11rem]"
        animate={{
          opacity: [0.06, 0.18, 0.08, 0.06],
          scale: [1, 1.06, 1.02, 1],
          y: [0, -12, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        未来
      </motion.div>

      {/* Sinuous tattoo + piercing weave */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="khakiFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C4B396" stopOpacity="0" />
            <stop offset="35%" stopColor="#A89272" stopOpacity="0.55" />
            <stop offset="65%" stopColor="#C4B396" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C4B396" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="inkFlow" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#111111" stopOpacity="0" />
            <stop offset="40%" stopColor="#A89272" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#111111" stopOpacity="0" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ink ribbon — tattoo stroke */}
        <motion.path
          d="M-80 260 C160 40, 340 420, 560 200 S900 40, 1120 280 S1360 520, 1520 300"
          stroke="url(#khakiFlow)"
          strokeWidth="1.8"
          strokeLinecap="round"
          filter="url(#softGlow)"
          animate={{
            d: [
              "M-80 260 C160 40, 340 420, 560 200 S900 40, 1120 280 S1360 520, 1520 300",
              "M-80 300 C180 80, 360 380, 580 240 S920 80, 1140 320 S1380 480, 1520 340",
              "M-80 240 C140 100, 320 400, 540 180 S880 60, 1100 260 S1340 500, 1520 280",
              "M-80 260 C160 40, 340 420, 560 200 S900 40, 1120 280 S1360 520, 1520 300",
            ],
            opacity: [0.45, 0.85, 0.55, 0.45],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Second ribbon — piercing arc energy */}
        <motion.path
          d="M-40 620 C200 760, 400 380, 640 640 S980 820, 1220 560 S1400 380, 1520 640"
          stroke="url(#inkFlow)"
          strokeWidth="1.4"
          strokeLinecap="round"
          animate={{
            d: [
              "M-40 620 C200 760, 400 380, 640 640 S980 820, 1220 560 S1400 380, 1520 640",
              "M-40 580 C220 720, 420 420, 660 600 S1000 780, 1240 520 S1420 400, 1520 600",
              "M-40 640 C180 780, 380 360, 620 660 S960 800, 1200 580 S1380 360, 1520 660",
              "M-40 620 C200 760, 400 380, 640 640 S980 820, 1220 560 S1400 380, 1520 640",
            ],
            opacity: [0.35, 0.7, 0.4, 0.35],
          }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Thin accent thread */}
        <motion.path
          d="M200 100 C400 200, 500 80, 700 160 S1000 40, 1200 140"
          stroke="#C4B396"
          strokeWidth="0.9"
          strokeLinecap="round"
          animate={{
            pathLength: [0.2, 1, 0.3],
            opacity: [0.2, 0.65, 0.2],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Piercing rings drifting */}
        <motion.g
          animate={{ x: [0, 30, -10, 0], y: [0, -24, 12, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="240" cy="680" r="52" stroke="#C4B396" strokeWidth="1.1" strokeOpacity="0.4" />
          <circle cx="240" cy="680" r="28" stroke="#A89272" strokeWidth="0.9" strokeOpacity="0.35" />
          <circle cx="240" cy="680" r="3" fill="#A89272" fillOpacity="0.5" />
        </motion.g>

        <motion.g
          animate={{ x: [0, -26, 14, 0], y: [0, 20, -8, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="1200" cy="200" r="40" stroke="#A89272" strokeWidth="1" strokeOpacity="0.38" />
          <circle cx="1200" cy="200" r="18" stroke="#C4B396" strokeWidth="0.8" strokeOpacity="0.3" />
        </motion.g>

        <motion.g
          animate={{ x: [0, 18, -22, 0], y: [0, -16, 10, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        >
          <ellipse
            cx="980"
            cy="720"
            rx="34"
            ry="22"
            stroke="#C4B396"
            strokeWidth="1"
            strokeOpacity="0.35"
          />
        </motion.g>

        {/* Floating studs / spark points */}
        {[
          [140, 180, 6],
          [480, 740, 7],
          [720, 90, 5],
          [1080, 520, 8],
          [860, 380, 6.5],
          [320, 420, 5.5],
          [1300, 780, 7],
        ].map(([x, y, dur], i) => (
          <motion.circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="2.8"
            fill="#A89272"
            animate={{
              opacity: [0.1, 0.85, 0.15],
              r: [2, 4.5, 2],
              cy: [y, y - 18, y],
            }}
            transition={{
              duration: Number(dur),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.55,
            }}
          />
        ))}
      </svg>

      {/* Soft veil for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-paper/35 via-transparent to-paper/45" />
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.25), transparent 60%)",
        }}
      />
    </div>
  );
}
