export type CatalogModelGender = "donna" | "uomo";

export type CatalogModel = {
  id: string;
  label: string;
  gender: CatalogModelGender;
  face: string;
  ear: string;
};

type CatalogModelDef = {
  id: string;
  label: string;
  gender: CatalogModelGender;
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
  { id: "w01", label: "Modello", gender: "donna" },
  { id: "w02", label: "Modello", gender: "donna" },
  { id: "w03", label: "Modello", gender: "donna" },
  { id: "w04", label: "Modello", gender: "donna" },
  { id: "w05", label: "Modello", gender: "donna" },
  { id: "w06", label: "Modello", gender: "donna" },
  { id: "w07", label: "Modello", gender: "donna" },
  { id: "w08", label: "Modello", gender: "donna" },
  { id: "w09", label: "Modello", gender: "donna" },
  { id: "w10", label: "Modello", gender: "donna" },
  { id: "m01", label: "Modello", gender: "uomo" },
  { id: "m02", label: "Modello", gender: "uomo" },
  { id: "m03", label: "Modello", gender: "uomo" },
  { id: "m04", label: "Modello", gender: "uomo" },
  { id: "m05", label: "Modello", gender: "uomo" },
  { id: "m06", label: "Modello", gender: "uomo" },
  { id: "m07", label: "Modello", gender: "uomo" },
  { id: "m08", label: "Modello", gender: "uomo" },
  { id: "m09", label: "Modello", gender: "uomo" },
  { id: "m10", label: "Modello", gender: "uomo" },
];

export const CATALOG_MODELS: CatalogModel[] = DEFS.map((d) => ({
  ...d,
  ...modelPaths(d.id),
}));

export function getCatalogModelById(id: string | null | undefined) {
  return CATALOG_MODELS.find((m) => m.id === id) ?? CATALOG_MODELS[0];
}

export function getCatalogModelsByGender(gender: CatalogModelGender) {
  return CATALOG_MODELS.filter((m) => m.gender === gender);
}

function pickFrom(pool: CatalogModel[]) {
  const list = pool.length ? pool : CATALOG_MODELS;
  return list[Math.floor(Math.random() * list.length)].id;
}

/**
 * Default: priorità donna (pubblico prevalentemente femminile).
 * `weight` = probabilità di scegliere il genere preferito (0–1).
 */
export function pickRandomCatalogModelId(
  preferGender: CatalogModelGender = "donna",
  weight = 0.85
) {
  const gender =
    Math.random() < weight
      ? preferGender
      : preferGender === "donna"
        ? "uomo"
        : "donna";
  return pickFrom(getCatalogModelsByGender(gender));
}

export function pickRandomCatalogModelIdByGender(gender: CatalogModelGender) {
  return pickFrom(getCatalogModelsByGender(gender));
}
