"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ContactActions } from "@/components/contact/ContactActions";
import { MotionButton, MotionLink } from "@/components/ui/MotionPressable";
import { useCatalogModel } from "@/hooks/useCatalogModel";
import { statusLabel } from "@/lib/utils";
import { BodyMap, type BodyZone } from "./BodyMap";
import { EarMap, type EarZoneId } from "./EarMap";

type Category = {
  id: string;
  name: string;
  slug: string;
  group: string;
};

type Product = {
  id: string;
  title: string;
  slug: string;
  material: string | null;
  status: string;
  imageUrl: string | null;
  categoryId: string;
  category: Category;
};

type Step = "face" | "ear" | "results";

const bodyZoneToCategories: Record<BodyZone, string[]> = {
  orecchio: [
    "lobo",
    "lobo-superiore",
    "helix",
    "forward-helix",
    "flat",
    "tragus",
    "anti-trago",
    "conch",
    "industrial",
    "rook",
    "daith",
    "snug",
  ],
  naso: ["nostril", "septum"],
  bridge: ["bridge"],
  sopracciglio: ["sopracciglio", "eyebrow"],
  labbra: ["medusa", "labret", "monroe", "snake-eyes"],
  collane: ["collane"],
  bracciali: ["bracciali"],
  anelli: ["anelli"],
  "orecchini-fini": ["orecchini-fini"],
};

const earZoneToCategory: Record<EarZoneId, string[]> = {
  lobo: ["lobo"],
  "lobo-superiore": ["lobo-superiore", "lobo"],
  helix: ["helix"],
  "forward-helix": ["forward-helix", "helix"],
  tragus: ["tragus"],
  "anti-trago": ["anti-trago"],
  conch: ["conch"],
  daith: ["daith"],
  rook: ["rook"],
  snug: ["snug"],
  flat: ["flat"],
  industrial: ["industrial"],
};

const zoneTitles: Record<BodyZone, string> = {
  orecchio: "Orecchio",
  naso: "Naso",
  bridge: "Bridge",
  sopracciglio: "Sopracciglio",
  labbra: "Labbra",
  collane: "Collane",
  bracciali: "Bracciali",
  anelli: "Anelli",
  "orecchini-fini": "Orecchini fini",
};

export function CatalogClient({
  products,
}: {
  products: Product[];
  categories: Category[];
}) {
  // Un solo modello per tutta la sessione catalogo: stesso id per volto e orecchio
  const model = useCatalogModel();
  const [step, setStep] = useState<Step>("face");
  const [bodyZone, setBodyZone] = useState<BodyZone | null>(null);
  const [earZone, setEarZone] = useState<EarZoneId | null>(null);

  function handleFaceSelect(zone: BodyZone) {
    setBodyZone(zone);
    setEarZone(null);
    if (zone === "orecchio") {
      setStep("ear");
    } else {
      setStep("results");
    }
  }

  function handleEarSelect(zone: EarZoneId) {
    setEarZone(zone);
    setStep("results");
  }

  function goBack() {
    if (step === "results" && bodyZone === "orecchio") {
      setEarZone(null);
      setStep("ear");
      return;
    }
    if (step === "results" || step === "ear") {
      setBodyZone(null);
      setEarZone(null);
      setStep("face");
    }
  }

  const filtered = useMemo(() => {
    if (!bodyZone) return [];
    if (earZone) {
      const slugs = earZoneToCategory[earZone];
      return products.filter((p) =>
        slugs.some((s) => p.category.slug === s || p.category.slug.includes(s))
      );
    }
    const slugs = bodyZoneToCategories[bodyZone];
    return products.filter((p) =>
      slugs.some((s) => p.category.slug === s || p.category.slug.includes(s))
    );
  }, [products, bodyZone, earZone]);

  const selectionLabel = earZone
    ? `Orecchio · ${earZone.replace(/-/g, " ")}`
    : bodyZone
      ? zoneTitles[bodyZone]
      : "";

  return (
    <div>
      <AnimatePresence mode="wait">
        {step === "face" && (
          <motion.div
            key="face"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-xl"
          >
            <div className="surface mb-6 border border-line/80 px-4 py-6 text-center sm:mb-8 sm:px-6">
              <p className="label-atelier">Passo 1</p>
              <h2 className="mt-3 font-display text-2xl text-ink sm:text-3xl md:text-4xl">
                Dove ti interessa?
              </h2>
              <p className="mt-3 text-sm text-muted sm:text-base">
                Tocca una zona del viso per i piercing, oppure scegli collane,
                bracciali e altri accessori sotto.
              </p>
            </div>
            <BodyMap model={model} onSelect={handleFaceSelect} />
          </motion.div>
        )}

        {step === "ear" && (
          <motion.div
            key={`ear-${model.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-xl"
          >
            <MotionButton
              type="button"
              onClick={goBack}
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Torna al viso
            </MotionButton>
            <div className="mb-8 text-center">
              <p className="label-atelier">Passo 2</p>
              <h2 className="mt-3 font-display text-3xl text-ink">
                Quale piercing all&apos;orecchio?
              </h2>
              <p className="mt-3 text-muted">
                Stesso modello del viso: seleziona il punto esatto sulla mappa.
              </p>
            </div>
            <EarMap model={model} onSelect={handleEarSelect} />
          </motion.div>
        )}

        {step === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <MotionButton
              type="button"
              onClick={goBack}
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Cambia selezione
            </MotionButton>

            <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="label-atelier">Selezione</p>
                <h2 className="mt-2 font-display text-3xl capitalize text-ink">
                  {selectionLabel}
                </h2>
              </div>
              <p className="text-sm text-muted">
                {filtered.length} pezz{filtered.length === 1 ? "o" : "i"}
              </p>
            </div>

            {filtered.length === 0 ? (
              <EmptyCatalog selection={selectionLabel} />
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((product) => (
                  <MotionLink
                    key={product.id}
                    href={`/catalogo/${product.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden border border-line bg-paper-soft">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-105"
                          sizes="(max-width:768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center font-display text-4xl text-ink/10">
                          未来
                        </div>
                      )}
                    </div>
                    <div className="mt-3 space-y-1">
                      <p className="text-[10px] tracking-[0.2em] text-muted-soft uppercase">
                        {product.category.name}
                      </p>
                      <h3 className="font-display text-lg text-ink group-hover:text-khaki-deep">
                        {product.title}
                      </h3>
                      <p className="text-sm text-muted">
                        {product.material ?? "Su richiesta"} ·{" "}
                        {statusLabel(product.status)}
                      </p>
                    </div>
                  </MotionLink>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyCatalog({ selection }: { selection: string }) {
  return (
    <div className="surface border border-line/60 px-6 py-16 text-center">
      <p className="font-display text-2xl text-ink">Catalogo in arrivo</p>
      <p className="mx-auto mt-3 max-w-md text-muted">
        Al momento non ci sono pezzi pubblicati per{" "}
        <span className="text-ink">{selection}</span>. Contattaci per
        disponibilità, prove in atelier o pezzi su misura.
      </p>
      <div className="mt-8 flex justify-center">
        <ContactActions />
      </div>
      <MotionLink href="/prenota" className="btn-ghost mt-4">
        Prenota una consulenza
      </MotionLink>
    </div>
  );
}
