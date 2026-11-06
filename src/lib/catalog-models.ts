export type CatalogModel = {
  id: string;
  label: string;
  gender: "donna" | "uomo";
  face: string;
  ear: string;
};

/**
 * 10 modelle + 10 modelli per la mappa catalogo.
 * Uno viene scelto a caso a ogni refresh e resta fisso in navigazione.
 */
export const CATALOG_MODELS: CatalogModel[] = [
  // — Donne —
  {
    id: "w01",
    label: "Donna · bionda nordica",
    gender: "donna",
    face: "/images/models/w01-face.jpg",
    ear: "/images/models/w01-ear.jpg",
  },
  {
    id: "w02",
    label: "Donna · castana mediterranea",
    gender: "donna",
    face: "/images/models/w02-face.jpg",
    ear: "/images/models/w02-ear.jpg",
  },
  {
    id: "w03",
    label: "Donna · afro, carnagione scura",
    gender: "donna",
    face: "/images/models/w03-face.jpg",
    ear: "/images/models/w03-ear.jpg",
  },
  {
    id: "w04",
    label: "Donna · asiatica est, capelli neri",
    gender: "donna",
    face: "/images/models/w04-face.jpg",
    ear: "/images/models/w04-ear.jpg",
  },
  {
    id: "w05",
    label: "Donna · rossa naturale",
    gender: "donna",
    face: "/images/models/w05-face.jpg",
    ear: "/images/models/w05-ear.jpg",
  },
  {
    id: "w06",
    label: "Donna · latina, onde castane",
    gender: "donna",
    face: "/images/models/w06-face.jpg",
    ear: "/images/models/w06-ear.jpg",
  },
  {
    id: "w07",
    label: "Donna · sudasiatica",
    gender: "donna",
    face: "/images/models/w07-face.jpg",
    ear: "/images/models/w07-ear.jpg",
  },
  {
    id: "w08",
    label: "Donna · medio-orientale",
    gender: "donna",
    face: "/images/models/w08-face.jpg",
    ear: "/images/models/w08-ear.jpg",
  },
  {
    id: "w09",
    label: "Donna · scandinava, biondo miele",
    gender: "donna",
    face: "/images/models/w09-face.jpg",
    ear: "/images/models/w09-ear.jpg",
  },
  {
    id: "w10",
    label: "Donna · nordafricana, ricci scuri",
    gender: "donna",
    face: "/images/models/w10-face.jpg",
    ear: "/images/models/w10-ear.jpg",
  },
  // — Uomini —
  {
    id: "m01",
    label: "Uomo · nordico, biondo",
    gender: "uomo",
    face: "/images/models/m01-face.jpg",
    ear: "/images/models/m01-ear.jpg",
  },
  {
    id: "m02",
    label: "Uomo · mediterraneo, castano",
    gender: "uomo",
    face: "/images/models/m02-face.jpg",
    ear: "/images/models/m02-ear.jpg",
  },
  {
    id: "m03",
    label: "Uomo · afro, carnagione scura",
    gender: "uomo",
    face: "/images/models/m03-face.jpg",
    ear: "/images/models/m03-ear.jpg",
  },
  {
    id: "m04",
    label: "Uomo · asiatico est, capelli neri",
    gender: "uomo",
    face: "/images/models/m04-face.jpg",
    ear: "/images/models/m04-ear.jpg",
  },
  {
    id: "m05",
    label: "Uomo · rosso naturale",
    gender: "uomo",
    face: "/images/models/m05-face.jpg",
    ear: "/images/models/m05-ear.jpg",
  },
  {
    id: "m06",
    label: "Uomo · latino, capelli scuri",
    gender: "uomo",
    face: "/images/models/m06-face.jpg",
    ear: "/images/models/m06-ear.jpg",
  },
  {
    id: "m07",
    label: "Uomo · sudasiatico",
    gender: "uomo",
    face: "/images/models/m07-face.jpg",
    ear: "/images/models/m07-ear.jpg",
  },
  {
    id: "m08",
    label: "Uomo · medio-orientale",
    gender: "uomo",
    face: "/images/models/m08-face.jpg",
    ear: "/images/models/m08-ear.jpg",
  },
  {
    id: "m09",
    label: "Uomo · slavo, castano cenere",
    gender: "uomo",
    face: "/images/models/m09-face.jpg",
    ear: "/images/models/m09-ear.jpg",
  },
  {
    id: "m10",
    label: "Uomo · nordafricano, capelli ricci",
    gender: "uomo",
    face: "/images/models/m10-face.jpg",
    ear: "/images/models/m10-ear.jpg",
  },
];

export function getCatalogModelById(id: string | null | undefined) {
  return CATALOG_MODELS.find((m) => m.id === id) ?? CATALOG_MODELS[0];
}

export function pickRandomCatalogModelId() {
  const index = Math.floor(Math.random() * CATALOG_MODELS.length);
  return CATALOG_MODELS[index].id;
}
