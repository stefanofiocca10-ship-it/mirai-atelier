export type CatalogModel = {
  id: string;
  label: string;
  gender: "donna" | "uomo";
  face: string;
  ear: string;
};

type CatalogModelDef = {
  id: string;
  label: string;
  gender: "donna" | "uomo";
};

/**
 * Path volto/orecchio derivati SEMPRE dallo stesso id → impossibile mischiare le coppie.
 */
function modelPaths(id: string) {
  return {
    face: `/images/models/${id}-face.jpg`,
    ear: `/images/models/${id}-ear.jpg`,
  };
}

const DEFS: CatalogModelDef[] = [
  { id: "w01", label: "Donna · bionda nordica", gender: "donna" },
  { id: "w02", label: "Donna · castana mediterranea", gender: "donna" },
  { id: "w03", label: "Donna · afro, carnagione scura", gender: "donna" },
  { id: "w04", label: "Donna · asiatica est, capelli neri", gender: "donna" },
  { id: "w05", label: "Donna · rossa naturale", gender: "donna" },
  { id: "w06", label: "Donna · latina, onde castane", gender: "donna" },
  { id: "w07", label: "Donna · sudasiatica", gender: "donna" },
  { id: "w08", label: "Donna · medio-orientale", gender: "donna" },
  { id: "w09", label: "Donna · scandinava, biondo miele", gender: "donna" },
  { id: "w10", label: "Donna · nordafricana, ricci scuri", gender: "donna" },
  { id: "m01", label: "Uomo · nordico, biondo", gender: "uomo" },
  { id: "m02", label: "Uomo · mediterraneo, castano", gender: "uomo" },
  { id: "m03", label: "Uomo · afro, carnagione scura", gender: "uomo" },
  { id: "m04", label: "Uomo · asiatico est, capelli neri", gender: "uomo" },
  { id: "m05", label: "Uomo · rosso naturale", gender: "uomo" },
  { id: "m06", label: "Uomo · latino, capelli scuri", gender: "uomo" },
  { id: "m07", label: "Uomo · sudasiatico", gender: "uomo" },
  { id: "m08", label: "Uomo · medio-orientale", gender: "uomo" },
  { id: "m09", label: "Uomo · slavo, castano cenere", gender: "uomo" },
  { id: "m10", label: "Uomo · nordafricano, capelli ricci", gender: "uomo" },
];

export const CATALOG_MODELS: CatalogModel[] = DEFS.map((d) => ({
  ...d,
  ...modelPaths(d.id),
}));

export function getCatalogModelById(id: string | null | undefined) {
  return CATALOG_MODELS.find((m) => m.id === id) ?? CATALOG_MODELS[0];
}

export function pickRandomCatalogModelId() {
  const index = Math.floor(Math.random() * CATALOG_MODELS.length);
  return CATALOG_MODELS[index].id;
}
