export const SITE = {
  name: "Mirai Tattoo & Piercing Atelier",
  shortName: "Mirai",
  kanji: "未来",
  tagline: "Atelier di tatuaggio e piercing — precisione, calore, essenza.",
  description:
    "Studio di tatuaggio e piercing con anima wabi-sabi. Gioielleria curata, consulenze su misura e un'atmosfera d'atelier.",
  address: "Italia",
  email: "info@miraiatelier.it",
} as const;

/** Contatti ufficiali studio */
export const CONTACT = {
  whatsapp: {
    display: "+39 393 288 0540",
    e164: "393932880540",
    href: "https://wa.me/393932880540",
    message:
      "Ciao Mirai! Vorrei informazioni su una consulenza / piercing / gioiello.",
  },
  phone: {
    display: "+39 0324 208899",
    href: "tel:+390324208899",
  },
  instagram: {
    handle: "@miraitattoopiercingatelier",
    href: "https://www.instagram.com/miraitattoopiercingatelier/",
  },
} as const;

export function whatsappUrl(customMessage?: string) {
  const text = encodeURIComponent(customMessage ?? CONTACT.whatsapp.message);
  return `${CONTACT.whatsapp.href}?text=${text}`;
}

/** Artiste dello studio */
export const ARTISTS = [
  {
    id: "margot",
    name: "Margot",
    role: "Piercing",
    specialty: "Body piercing & gioielleria",
    bio: "Specializzata in piercing e gioielli per il corpo. Attenzione all'anatomia, ai materiali sicuri e a un risultato preciso, discreto e duraturo.",
    instagram: {
      handle: "@maargotzbodypiercing",
      href: "https://www.instagram.com/maargotzbodypiercing/",
    },
  },
  {
    id: "valentina",
    name: "Valentina",
    role: "Tattoo",
    specialty: "Tatuaggio artistico",
    bio: "Dedicata al tatuaggio con un approccio curato e personale. Ogni pezzo nasce da un dialogo sullo stile, sulla pelle e sulla storia di chi lo porta.",
    instagram: {
      handle: "@valentina_utt",
      href: "https://www.instagram.com/valentina_utt/",
    },
  },
] as const;

export const CATALOG_KINDS = [
  { value: "PIERCING", label: "Piercing" },
  { value: "JEWELRY", label: "Gioielleria" },
] as const;

export type CatalogKind = (typeof CATALOG_KINDS)[number]["value"];

/**
 * Albero catalogo allineato alla mappa pubblica.
 * Piercing: zona → sottotipi (leaf assegnabili).
 * Jewelry: la zona è già leaf assegnabile (items vuoti).
 */
export const CATALOG_TREE = {
  PIERCING: [
    {
      zone: "orecchio",
      label: "Orecchio",
      items: [
        "Lobo",
        "Lobo Superiore",
        "Helix",
        "Forward Helix",
        "Flat",
        "Tragus",
        "Anti-Trago",
        "Conch",
        "Industrial",
        "Rook",
        "Daith",
        "Snug",
      ],
    },
    {
      zone: "naso",
      label: "Naso",
      items: ["Nostril", "Septum"],
    },
    {
      zone: "bridge",
      label: "Bridge",
      items: ["Bridge"],
    },
    {
      zone: "sopracciglio",
      label: "Sopracciglio",
      items: ["Sopracciglio"],
    },
    {
      zone: "labbra",
      label: "Labbra",
      items: ["Medusa", "Labret", "Monroe", "Snake Eyes"],
    },
    {
      zone: "speciali",
      label: "Speciali",
      items: ["Dermal Anchor", "Piercing Corpo"],
    },
  ],
  JEWELRY: [
    { zone: "collane", label: "Collane", items: [] as string[] },
    { zone: "bracciali", label: "Bracciali", items: [] as string[] },
    { zone: "anelli", label: "Anelli", items: [] as string[] },
    {
      zone: "orecchini-fini",
      label: "Orecchini fini",
      items: [] as string[],
    },
  ],
} as const;

/** @deprecated usa CATALOG_TREE — mantenuto per compatibilità seed legacy */
export const CATEGORY_GROUPS = [
  ...CATALOG_TREE.PIERCING.map((z) => ({
    id: z.zone,
    label: z.label,
    items: z.items,
  })),
  ...CATALOG_TREE.JEWELRY.map((z) => ({
    id: z.zone,
    label: z.label,
    items: z.items.length ? z.items : [z.label],
  })),
] as const;

export const PRODUCT_STATUSES = [
  { value: "DISPONIBILE", label: "Disponibile" },
  { value: "SU_ORDINE", label: "Su ordine" },
  { value: "ESAURITO", label: "Esaurito" },
] as const;

export const SERVICE_TYPES = [
  { value: "CONSULENZA_TATTOO", label: "Consulenza Tattoo" },
  { value: "CONSULENZA_PIERCING", label: "Consulenza Piercing" },
  { value: "GIOIELLERIA", label: "Gioielleria / Cambio gioiello" },
  { value: "ALTRO", label: "Altro" },
] as const;

export const BOOKING_STATUSES = [
  { value: "NUOVA", label: "Nuova" },
  { value: "CONTATTATA", label: "Contattata" },
  { value: "CONFERMATA", label: "Confermata" },
  { value: "COMPLETATA", label: "Completata" },
  { value: "ANNULLATA", label: "Annullata" },
] as const;
