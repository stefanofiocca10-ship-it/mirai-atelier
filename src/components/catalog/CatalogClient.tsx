"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Gem,
  Instagram,
  MessageCircle,
  PenLine,
  Phone,
  Sparkles,
} from "lucide-react";
import { ContactActions } from "@/components/contact/ContactActions";
import { MotionAnchor, MotionButton, MotionLink } from "@/components/ui/MotionPressable";
import { useCatalogModel } from "@/hooks/useCatalogModel";
import { ARTISTS, CONTACT, whatsappUrl } from "@/lib/constants";
import { statusLabel } from "@/lib/utils";
import {
  BodyMap,
  JEWELRY_OPTIONS,
  type BodyZone,
  type JewelryZone,
  type PiercingZone,
} from "./BodyMap";
import { EarMap, type EarZoneId } from "./EarMap";

type Category = {
  id: string;
  name: string;
  slug: string;
  kind: string;
  zone: string;
};

type Product = {
  id: string;
  title: string;
  slug: string;
  material: string | null;
  status: string;
  imageUrl: string | null;
  categories: { category: Category }[];
};

function productMatchesSlugs(product: Product, slugs: string[]) {
  return product.categories.some((pc) =>
    slugs.some((s) => pc.category.slug === s || pc.category.slug.includes(s))
  );
}

function productMatchesZone(product: Product, zone: string, kind?: string) {
  return product.categories.some(
    (pc) =>
      pc.category.zone === zone &&
      (!kind || pc.category.kind === kind)
  );
}

function productCategoryLabel(product: Product) {
  const names = product.categories.map((pc) => pc.category.name);
  if (!names.length) return "Catalogo";
  if (names.length === 1) return names[0];
  return `${names[0]} +${names.length - 1}`;
}

type Branch = "piercing" | "jewelry" | "tattoo";
type Step = "branch" | "face" | "ear" | "jewelry" | "tattoo" | "results";

const VALENTINA = ARTISTS.find((a) => a.id === "valentina")!;

const piercingZoneToCategories: Record<PiercingZone, string[]> = {
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
};

const jewelryZoneToCategories: Record<JewelryZone, string[]> = {
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

const piercingTitles: Record<PiercingZone, string> = {
  orecchio: "Orecchio sinistro",
  naso: "Naso",
  bridge: "Bridge",
  sopracciglio: "Sopracciglio",
  labbra: "Labbra",
};

const jewelryTitles: Record<JewelryZone, string> = {
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
  const model = useCatalogModel();
  const [step, setStep] = useState<Step>("branch");
  const [branch, setBranch] = useState<Branch | null>(null);
  const [bodyZone, setBodyZone] = useState<BodyZone | null>(null);
  const [earZone, setEarZone] = useState<EarZoneId | null>(null);

  function chooseBranch(next: Branch) {
    setBranch(next);
    setBodyZone(null);
    setEarZone(null);
    if (next === "piercing") setStep("face");
    else if (next === "jewelry") setStep("jewelry");
    else setStep("tattoo");
  }

  function handleFaceSelect(zone: PiercingZone) {
    setBodyZone(zone);
    setEarZone(null);
    if (zone === "orecchio") {
      setStep("ear");
    } else {
      setStep("results");
    }
  }

  function handleJewelrySelect(zone: JewelryZone) {
    setBodyZone(zone);
    setEarZone(null);
    setStep("results");
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
    if (step === "results" && branch === "jewelry") {
      setBodyZone(null);
      setStep("jewelry");
      return;
    }
    if (step === "results" || step === "ear") {
      setBodyZone(null);
      setEarZone(null);
      setStep("face");
      return;
    }
    if (step === "face" || step === "jewelry" || step === "tattoo") {
      setBranch(null);
      setBodyZone(null);
      setEarZone(null);
      setStep("branch");
    }
  }

  const filtered = useMemo(() => {
    if (!bodyZone) return [];
    if (earZone) {
      const slugs = earZoneToCategory[earZone];
      return products.filter((p) => productMatchesSlugs(p, slugs));
    }
    if (branch === "jewelry") {
      const zone = bodyZone as JewelryZone;
      const slugs = jewelryZoneToCategories[zone];
      return products.filter(
        (p) =>
          productMatchesZone(p, zone, "JEWELRY") ||
          productMatchesSlugs(p, slugs)
      );
    }
    const zone = bodyZone as PiercingZone;
    const slugs = piercingZoneToCategories[zone];
    return products.filter(
      (p) =>
        productMatchesZone(p, zone, "PIERCING") ||
        productMatchesSlugs(p, slugs)
    );
  }, [products, bodyZone, earZone, branch]);

  const selectionLabel = earZone
    ? `Orecchio sinistro · ${earZone.replace(/-/g, " ")}`
    : bodyZone
      ? branch === "jewelry"
        ? jewelryTitles[bodyZone as JewelryZone]
        : piercingTitles[bodyZone as PiercingZone]
      : "";

  return (
    <div>
      <AnimatePresence mode="wait">
        {step === "branch" && (
          <motion.div
            key="branch"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-3xl"
          >
            <div className="surface mb-8 border border-line/60 px-5 py-8 text-center sm:px-8 sm:py-10">
              <p className="label-atelier">Catalogo</p>
              <h2 className="mt-3 font-display text-2xl text-ink sm:text-3xl md:text-4xl">
                Cosa stai cercando?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-muted sm:text-base">
                Tre percorsi, stessa cura: piercing, gioielleria o tatuaggio.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
              <MotionButton
                type="button"
                onClick={() => chooseBranch("piercing")}
                className="surface group flex flex-col items-start border border-line/60 p-5 text-left transition hover:border-khaki sm:p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center border border-line/70 bg-paper/40 text-khaki-deep">
                  <Sparkles className="h-5 w-5" />
                </span>
                <span className="mt-4 font-display text-xl text-ink sm:text-2xl">
                  Piercing
                </span>
                <span className="mt-2 text-sm leading-relaxed text-muted">
                  Mappa del viso: orecchio, naso, labbra, sopracciglio e bridge.
                </span>
              </MotionButton>

              <MotionButton
                type="button"
                onClick={() => chooseBranch("jewelry")}
                className="surface group flex flex-col items-start border border-line/60 p-5 text-left transition hover:border-khaki sm:p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center border border-line/70 bg-paper/40 text-khaki-deep">
                  <Gem className="h-5 w-5" />
                </span>
                <span className="mt-4 font-display text-xl text-ink sm:text-2xl">
                  Gioielleria
                </span>
                <span className="mt-2 text-sm leading-relaxed text-muted">
                  Collane, bracciali, anelli e orecchini fini.
                </span>
              </MotionButton>

              <MotionButton
                type="button"
                onClick={() => chooseBranch("tattoo")}
                className="surface group flex flex-col items-start border border-line/60 p-5 text-left transition hover:border-khaki sm:p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center border border-line/70 bg-paper/40 text-khaki-deep">
                  <PenLine className="h-5 w-5" />
                </span>
                <span className="mt-4 font-display text-xl text-ink sm:text-2xl">
                  Tatuaggi
                </span>
                <span className="mt-2 text-sm leading-relaxed text-muted">
                  Consulenza con Valentina — stile, pelle, progetto su misura.
                </span>
              </MotionButton>
            </div>
          </motion.div>
        )}

        {step === "face" && (
          <motion.div
            key={`face-${model.id}`}
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
              Cosa stai cercando
            </MotionButton>
            <div className="surface mb-6 border border-line/60 px-4 py-6 text-center sm:mb-8 sm:px-6">
              <p className="label-atelier">Piercing · Passo 1</p>
              <h2 className="mt-3 font-display text-2xl text-ink sm:text-3xl md:text-4xl">
                Dove ti interessa?
              </h2>
              <p className="mt-3 text-sm text-muted sm:text-base">
                Tocca una zona del viso. Per l&apos;orecchio usa solo il
                sinistro della persona.
              </p>
            </div>
            <BodyMap model={model} onSelect={handleFaceSelect} />
          </motion.div>
        )}

        {step === "jewelry" && (
          <motion.div
            key="jewelry"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-2xl"
          >
            <MotionButton
              type="button"
              onClick={goBack}
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Cosa stai cercando
            </MotionButton>
            <div className="surface mb-8 border border-line/60 px-4 py-6 text-center sm:px-6">
              <p className="label-atelier">Gioielleria</p>
              <h2 className="mt-3 font-display text-2xl text-ink sm:text-3xl md:text-4xl">
                Scegli la categoria
              </h2>
              <p className="mt-3 text-sm text-muted sm:text-base">
                Quattro linee, stessa attenzione al dettaglio.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {JEWELRY_OPTIONS.map((opt) => (
                <MotionButton
                  key={opt.id}
                  type="button"
                  onClick={() => handleJewelrySelect(opt.id)}
                  className="surface border border-line/60 px-5 py-6 text-left transition hover:border-khaki sm:px-6 sm:py-8"
                >
                  <span className="font-display text-xl text-ink sm:text-2xl">
                    {opt.label}
                  </span>
                  <span className="mt-2 block text-sm text-muted">{opt.hint}</span>
                </MotionButton>
              ))}
            </div>
          </motion.div>
        )}

        {step === "tattoo" && (
          <motion.div
            key="tattoo"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-2xl"
          >
            <MotionButton
              type="button"
              onClick={goBack}
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Cosa stai cercando
            </MotionButton>

            <article className="surface border border-line/60 p-6 sm:p-8 md:p-10">
              <p className="label-atelier">{VALENTINA.role}</p>
              <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
                {VALENTINA.name}
              </h2>
              <p className="mt-2 text-sm text-khaki-deep">{VALENTINA.specialty}</p>
              <div className="divider-atelier my-6" />
              <p className="text-sm leading-relaxed text-muted sm:text-base">
                {VALENTINA.bio} In atelier accompagniamo il progetto dal primo
                schizzo alla seduta: stile, posizionamento e tempi di
                guarigione vengono definiti insieme, con calma e precisione.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                Per ora questa sezione è dedicata al contatto diretto: scrivi o
                chiama per una consulenza tatuaggio con Valentina. I testi e i
                dettagli li affineremo insieme.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <MotionAnchor
                  href={VALENTINA.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex gap-2"
                >
                  <Instagram className="h-4 w-4" />
                  {VALENTINA.instagram.handle}
                </MotionAnchor>
                <MotionAnchor
                  href={whatsappUrl(
                    "Ciao! Vorrei una consulenza tatuaggio con Valentina."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost inline-flex gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp studio
                </MotionAnchor>
                <MotionAnchor
                  href={CONTACT.phone.href}
                  className="btn-ghost inline-flex gap-2"
                >
                  <Phone className="h-4 w-4" />
                  {CONTACT.phone.display}
                </MotionAnchor>
                <MotionLink href="/prenota" className="btn-ghost">
                  Prenota dal sito
                </MotionLink>
              </div>
            </article>
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
              <p className="label-atelier">Piercing · Passo 2</p>
              <h2 className="mt-3 font-display text-3xl text-ink">
                Orecchio sinistro
              </h2>
              <p className="mt-3 text-muted">
                Seleziona il punto esatto sulla mappa.
              </p>
              <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-line/60 bg-paper/45 px-3 py-2 backdrop-blur-sm">
                <span className="relative h-10 w-10 overflow-hidden rounded-full border border-line/70">
                  <Image
                    src={model.face}
                    alt=""
                    fill
                    className="object-cover object-[center_20%]"
                    sizes="40px"
                    unoptimized
                  />
                </span>
                <span className="text-left text-xs text-muted">
                  Stesso modello
                  <span className="block text-ink">{model.label}</span>
                </span>
              </div>
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
                    <div className="surface mt-3 space-y-1 border border-line/50 px-3 py-3">
                      <p className="text-[10px] tracking-[0.2em] text-ink-soft uppercase">
                        {productCategoryLabel(product)}
                      </p>
                      <h3 className="font-display text-lg text-ink group-hover:text-khaki-deep">
                        {product.title}
                      </h3>
                      <p className="text-sm text-ink-soft">
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
