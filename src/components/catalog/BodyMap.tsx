"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MotionButton } from "@/components/ui/MotionPressable";

export type BodyZone =
  | "orecchio"
  | "naso"
  | "bridge"
  | "sopracciglio"
  | "labbra"
  | "collane"
  | "bracciali"
  | "anelli"
  | "orecchini-fini";

type ZoneDef = {
  id: BodyZone;
  label: string;
  hint: string;
  /** percentage hotspot box */
  style: { top: string; left: string; width: string; height: string };
};

const jewelryZones: { id: BodyZone; label: string; hint: string }[] = [
  { id: "collane", label: "Collane", hint: "Gioielleria collo" },
  { id: "bracciali", label: "Bracciali", hint: "Gioielleria polso" },
  { id: "anelli", label: "Anelli", hint: "Gioielleria mano" },
  { id: "orecchini-fini", label: "Orecchini fini", hint: "Gioielleria orecchio" },
];

const zones: ZoneDef[] = [
  {
    id: "sopracciglio",
    label: "Sopracciglio",
    hint: "Eyebrow piercing",
    style: { top: "34%", left: "29%", width: "42%", height: "5%" },
  },
  {
    id: "bridge",
    label: "Bridge",
    hint: "Parte alta del naso",
    style: { top: "41%", left: "45%", width: "10%", height: "6%" },
  },
  {
    id: "naso",
    label: "Naso",
    hint: "Nostril · Septum",
    style: { top: "48%", left: "41%", width: "18%", height: "10%" },
  },
  {
    id: "labbra",
    label: "Labbra",
    hint: "Medusa · Labret · Monroe",
    style: { top: "61%", left: "38%", width: "24%", height: "8%" },
  },
  {
    id: "orecchio",
    label: "Orecchio",
    hint: "Mappa dettagliata",
    style: { top: "39%", left: "12%", width: "12%", height: "18%" },
  },
];

// Second ear hotspot (right)
const rightEar = {
  id: "orecchio" as BodyZone,
  label: "Orecchio",
  hint: "Mappa dettagliata",
  style: { top: "39%", left: "76%", width: "12%", height: "18%" },
};

type Props = {
  onSelect: (zone: BodyZone) => void;
};

export function BodyMap({ onSelect }: Props) {
  const [hovered, setHovered] = useState<BodyZone | null>(null);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="relative aspect-[3/4] overflow-hidden border border-line/80 bg-paper/40 shadow-soft touch-manipulation">
        <Image
          src="/images/face-map.jpg"
          alt="Mappa interattiva del viso — seleziona una zona"
          fill
          priority
          className="object-cover object-[center_15%]"
          sizes="(max-width:768px) 100vw, 420px"
          unoptimized
        />

        {/* Soft vignette for readability */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 45%, rgba(255,255,255,0.35) 100%)",
          }}
        />

        {[...zones, rightEar].map((zone, i) => {
          const active = hovered === zone.id;
          return (
            <button
              key={`${zone.id}-${i}`}
              type="button"
              aria-label={`${zone.label}: ${zone.hint}`}
              onClick={() => onSelect(zone.id)}
              onMouseEnter={() => setHovered(zone.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(zone.id)}
              onBlur={() => setHovered(null)}
              className={cn(
                "absolute rounded-full border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-khaki",
                active
                  ? "border-khaki bg-khaki/25 shadow-[0_0_0_6px_rgba(196,179,150,0.25)]"
                  : "border-white/70 bg-white/10 hover:border-khaki hover:bg-khaki/20"
              )}
              style={zone.style}
            />
          );
        })}

        {/* Hover label */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 border border-line bg-paper/95 px-4 py-2 text-center shadow-lift backdrop-blur-sm"
          >
            <p className="font-display text-sm text-ink">
              {zones.find((z) => z.id === hovered)?.label}
            </p>
            <p className="text-[11px] text-muted">
              {zones.find((z) => z.id === hovered)?.hint}
            </p>
          </motion.div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {zones.map((zone) => (
          <MotionButton
            key={zone.id}
            type="button"
            onClick={() => onSelect(zone.id)}
            onMouseEnter={() => setHovered(zone.id)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "border px-3 py-2.5 text-left transition",
              hovered === zone.id
                ? "border-khaki bg-khaki/15"
                : "border-line hover:border-khaki/60"
            )}
          >
            <span className="block text-sm text-ink">{zone.label}</span>
            <span className="block text-[11px] text-muted">{zone.hint}</span>
          </MotionButton>
        ))}
      </div>

      <div className="mt-8 border-t border-line pt-6">
        <p className="mb-3 text-center text-[11px] tracking-[0.22em] text-khaki-deep uppercase">
          Gioielleria &amp; accessori
        </p>
        <div className="grid grid-cols-2 gap-2">
          {jewelryZones.map((zone) => (
            <MotionButton
              key={zone.id}
              type="button"
              onClick={() => onSelect(zone.id)}
              className="border border-line bg-paper px-3 py-3 text-left transition hover:border-khaki hover:bg-khaki/10"
            >
              <span className="block text-sm text-ink">{zone.label}</span>
              <span className="block text-[11px] text-muted">{zone.hint}</span>
            </MotionButton>
          ))}
        </div>
      </div>
    </div>
  );
}
