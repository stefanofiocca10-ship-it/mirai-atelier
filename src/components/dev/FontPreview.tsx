"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Pair = {
  id: string;
  name: string;
  vibe: string;
  display: string;
  displayWeights: string;
  sans: string;
  sansWeights: string;
  google: string;
};

const PAIRS: Pair[] = [
  {
    id: "a",
    name: "A · Cormorant + Manrope",
    vibe: "Elegante, editoriale, vicino al logo Mirai",
    display: '"Cormorant Garamond", serif',
    displayWeights: "500;600;700",
    sans: '"Manrope", sans-serif',
    sansWeights: "300;400;500;600",
    google:
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@300;400;500;600&display=swap",
  },
  {
    id: "b",
    name: "B · Bodoni Moda + Figtree",
    vibe: "Fashion, alto contrasto, atelier di lusso",
    display: '"Bodoni Moda", serif',
    displayWeights: "400;500;600;700",
    sans: '"Figtree", sans-serif',
    sansWeights: "300;400;500;600",
    google:
      "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500;6..96,600;6..96,700&family=Figtree:wght@300;400;500;600&display=swap",
  },
  {
    id: "c",
    name: "C · Instrument Serif + Plus Jakarta",
    vibe: "Contemporaneo, pulito, giapponese-moderno",
    display: '"Instrument Serif", serif',
    displayWeights: "400",
    sans: '"Plus Jakarta Sans", sans-serif',
    sansWeights: "300;400;500;600",
    google:
      "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap",
  },
  {
    id: "d",
    name: "D · Playfair Display + DM Sans",
    vibe: "Classico raffinato, molto leggibile",
    display: '"Playfair Display", serif',
    displayWeights: "400;500;600;700",
    sans: '"DM Sans", sans-serif',
    sansWeights: "300;400;500;600",
    google:
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap",
  },
  {
    id: "e",
    name: "E · Marcellus + Outfit",
    vibe: "Sobrio, tipografia romana, minimal",
    display: '"Marcellus", serif',
    displayWeights: "400",
    sans: '"Outfit", sans-serif',
    sansWeights: "300;400;500;600",
    google:
      "https://fonts.googleapis.com/css2?family=Marcellus&family=Outfit:wght@300;400;500;600&display=swap",
  },
  {
    id: "f",
    name: "F · Libre Baskerville + Source Sans 3",
    vibe: "Tradizionale, tipografico, calmo",
    display: '"Libre Baskerville", serif',
    displayWeights: "400;700",
    sans: '"Source Sans 3", sans-serif',
    sansWeights: "300;400;500;600",
    google:
      "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@300;400;500;600&display=swap",
  },
  {
    id: "g",
    name: "G · Cinzel + Plus Jakarta (attuale)",
    vibe: "Inciso / monumentale — quello ora sul sito",
    display: '"Cinzel", serif',
    displayWeights: "400;500;600;700",
    sans: '"Plus Jakarta Sans", sans-serif',
    sansWeights: "300;400;500;600",
    google:
      "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap",
  },
  {
    id: "h",
    name: "H · EB Garamond + Synonym-like (Geist via system)",
    vibe: "Letterpress giapponese-europeo, molto soft",
    display: '"EB Garamond", serif',
    displayWeights: "400;500;600;700",
    sans: '"IBM Plex Sans", sans-serif',
    sansWeights: "300;400;500;600",
    google:
      "https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap",
  },
];

export function FontPreview() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-paper px-5 pb-24 pt-28 md:px-8">
      {/* load all font stylesheets */}
      {PAIRS.map((p) => (
        <link key={p.id} rel="stylesheet" href={p.google} />
      ))}

      <div className="mx-auto max-w-atelier">
        <p className="label-atelier">Scelta tipografica</p>
        <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
          Anteprima font
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Otto abbinamenti serif + sans pensati per Mirai (logo nero su bianco,
          estetistica atelier). Clicca quello che preferisci e dimmi la lettera
          (A–H).
        </p>

        {selected && (
          <p className="mt-4 border border-khaki bg-khaki/15 px-4 py-3 text-sm text-ink">
            Selezionato: <strong>{PAIRS.find((p) => p.id === selected)?.name}</strong>
            {" — "}dimmi pure in chat la lettera da applicare al sito.
          </p>
        )}

        <div className="mt-12 space-y-8">
          {PAIRS.map((pair) => (
            <button
              key={pair.id}
              type="button"
              onClick={() => setSelected(pair.id)}
              className={cn(
                "block w-full border p-6 text-left transition md:p-8",
                selected === pair.id
                  ? "border-ink shadow-soft"
                  : "border-line hover:border-khaki"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs tracking-[0.2em] text-khaki-deep uppercase">
                    Opzione {pair.id.toUpperCase()}
                  </p>
                  <p className="mt-1 text-sm text-muted">{pair.vibe}</p>
                </div>
                {selected === pair.id && (
                  <span className="bg-ink px-3 py-1 text-xs text-paper">
                    Scelta
                  </span>
                )}
              </div>

              <p
                className="mt-8 text-5xl leading-none text-ink md:text-6xl"
                style={{ fontFamily: pair.display, fontWeight: 500 }}
              >
                Mirai
              </p>
              <p
                className="mt-3 text-xl tracking-[0.18em] text-ink uppercase"
                style={{ fontFamily: pair.display, fontWeight: 400 }}
              >
                Tattoo Piercing Atelier
              </p>

              <div className="divider-atelier my-6" />

              <p
                className="text-base leading-relaxed text-muted md:text-lg"
                style={{ fontFamily: pair.sans, fontWeight: 400 }}
              >
                Atelier di tatuaggio e piercing — precisione, calore, essenza.
                Ogni pezzo nasce da un dialogo su anatomia, materiale e
                proporzione.
              </p>

              <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted">
                <span style={{ fontFamily: pair.display }}>
                  Titoli: {pair.display.replace(/"/g, "")}
                </span>
                <span style={{ fontFamily: pair.sans }}>
                  Testi: {pair.sans.replace(/"/g, "")}
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {["Contatti", "Catalogo", "Chi siamo"].map((label) => (
                  <div
                    key={label}
                    className="border border-line px-4 py-3 text-center text-sm tracking-wide"
                    style={{ fontFamily: pair.sans, fontWeight: 500 }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
