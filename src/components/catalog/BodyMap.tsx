"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MotionButton } from "@/components/ui/MotionPressable";
import type { CatalogModel } from "@/lib/catalog-models";

/** Solo zone piercing sul viso (la gioielleria ha un percorso separato). */
export type PiercingZone =
  | "orecchio"
  | "naso"
  | "bridge"
  | "sopracciglio"
  | "labbra";

/** Zone gioielleria (scelta dopo il ramo Jewelry). */
export type JewelryZone = "collane" | "bracciali" | "anelli" | "orecchini-fini";

export type BodyZone = PiercingZone | JewelryZone;

type ZoneDef = {
  id: PiercingZone;
  label: string;
  hint: string;
  style: { top: string; left: string; width: string; height: string };
};

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
    // Foto frontale: orecchio SINISTRO della persona = lato DESTRO dello schermo
    hint: "Mappa dettagliata",
    style: { top: "36%", left: "76%", width: "14%", height: "22%" },
  },
];

type Props = {
  model: CatalogModel;
  onSelect: (zone: PiercingZone) => void;
};

export function BodyMap({ model, onSelect }: Props) {
  const [hovered, setHovered] = useState<PiercingZone | null>(null);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="media-mirai relative aspect-[3/4] touch-manipulation">
        <div className="media-mirai-inner">
          <Image
            key={`face-${model.id}`}
            src={model.face}
            alt="Mappa del viso per la scelta del piercing"
            fill
            priority
            className="object-cover object-[center_15%]"
            sizes="(max-width:768px) 100vw, 420px"
            unoptimized
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 55%, rgba(244,241,235,0.18) 100%)",
            }}
          />
        </div>

        {zones.map((zone) => {
          const active = hovered === zone.id;
          return (
            <button
              key={zone.id}
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

        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="surface absolute bottom-5 left-1/2 z-10 -translate-x-1/2 px-4 py-2 text-center"
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
              "btn-chip w-full flex-col items-start gap-0.5 text-left",
              hovered === zone.id && "is-active"
            )}
          >
            <span className="block text-sm font-medium text-ink">{zone.label}</span>
            <span className="block text-[11px] font-normal tracking-normal text-muted">
              {zone.hint}
            </span>
          </MotionButton>
        ))}
      </div>
    </div>
  );
}

export const JEWELRY_OPTIONS: {
  id: JewelryZone;
  label: string;
  hint: string;
}[] = [
  { id: "collane", label: "Collane", hint: "Gioielleria collo" },
  { id: "bracciali", label: "Bracciali", hint: "Gioielleria polso" },
  { id: "anelli", label: "Anelli", hint: "Gioielleria mano" },
  { id: "orecchini-fini", label: "Orecchini fini", hint: "Gioielleria orecchio" },
];
