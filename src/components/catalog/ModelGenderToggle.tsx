"use client";

import { cn } from "@/lib/utils";
import { useCatalogModel } from "@/hooks/useCatalogModel";
import type { CatalogModelGender } from "@/lib/catalog-models";

const OPTIONS: { id: CatalogModelGender; label: string }[] = [
  { id: "donna", label: "Donna" },
  { id: "uomo", label: "Uomo" },
];

export function ModelGenderToggle({ className }: { className?: string }) {
  const { model, setGender } = useCatalogModel();

  return (
    <div
      className={cn("inline-flex items-center gap-2", className)}
      role="group"
      aria-label="Modello di riferimento"
    >
      <span className="label-atelier mr-1 hidden sm:inline">Modello</span>
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={cn(
            "btn-toggle btn-sm",
            model.gender === opt.id && "is-active"
          )}
          aria-pressed={model.gender === opt.id}
          onClick={() => setGender(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
