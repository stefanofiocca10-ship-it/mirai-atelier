"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MotionButton } from "@/components/ui/MotionPressable";
import type { CatalogModel } from "@/lib/catalog-models";

export const EAR_ZONES = [
  { id: "helix", label: "Helix", top: "16%", left: "62%", size: "9%" },
  { id: "forward-helix", label: "Forward Helix", top: "20%", left: "36%", size: "8%" },
  { id: "industrial", label: "Industrial", top: "22%", left: "74%", size: "8%" },
  { id: "flat", label: "Flat", top: "30%", left: "64%", size: "8%" },
  { id: "rook", label: "Rook", top: "36%", left: "48%", size: "7%" },
  { id: "daith", label: "Daith", top: "44%", left: "42%", size: "7%" },
  { id: "snug", label: "Snug", top: "42%", left: "66%", size: "7%" },
  { id: "conch", label: "Conch", top: "50%", left: "56%", size: "9%" },
  { id: "tragus", label: "Trago", top: "54%", left: "32%", size: "7%" },
  { id: "anti-trago", label: "Anti-Trago", top: "60%", left: "64%", size: "7%" },
  { id: "lobo-superiore", label: "Lobo Superiore", top: "70%", left: "44%", size: "8%" },
  { id: "lobo", label: "Lobo", top: "80%", left: "50%", size: "10%" },
] as const;

export type EarZoneId = (typeof EAR_ZONES)[number]["id"];

type Props = {
  /** Stesso modello del viso: l'orecchio è sempre la coppia di model.id */
  model: CatalogModel;
  onSelect: (zone: EarZoneId) => void;
};

export function EarMap({ model, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="mx-auto w-full max-w-lg">
      <p className="mb-4 text-center label-atelier">Orecchio</p>

      <div className="media-mirai relative aspect-[3/4] touch-manipulation">
        <div className="media-mirai-inner">
          <Image
            key={`ear-${model.id}`}
            src={model.ear}
            alt="Mappa dell'orecchio per la scelta del piercing"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width:768px) 100vw, 512px"
            unoptimized
          />
        </div>

        {EAR_ZONES.map((zone) => {
          const active = hovered === zone.id;
          return (
            <button
              key={zone.id}
              type="button"
              aria-label={zone.label}
              onClick={() => onSelect(zone.id)}
              onMouseEnter={() => setHovered(zone.id)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-200",
                active
                  ? "border-khaki bg-khaki scale-110 shadow-[0_0_0_6px_rgba(196,179,150,0.3)]"
                  : "border-white bg-white/50 hover:border-khaki hover:bg-khaki/80"
              )}
              style={{
                top: zone.top,
                left: zone.left,
                width: zone.size,
                height: zone.size,
              }}
            />
          );
        })}

        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="surface absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2"
          >
            <p className="font-display text-sm text-ink">
              {EAR_ZONES.find((z) => z.id === hovered)?.label}
            </p>
          </motion.div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {EAR_ZONES.map((zone) => (
          <MotionButton
            key={zone.id}
            type="button"
            onClick={() => onSelect(zone.id)}
            onMouseEnter={() => setHovered(zone.id)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "btn-chip w-full text-[11px]",
              hovered === zone.id && "is-active"
            )}
          >
            {zone.label}
          </MotionButton>
        ))}
      </div>
    </div>
  );
}
