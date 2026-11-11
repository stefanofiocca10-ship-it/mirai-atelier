export type TimeSlot = { open: string; close: string };

export type DaySchedule = {
  /** 0 = Domenica … 6 = Sabato */
  day: number;
  closed: boolean;
  slots: TimeSlot[];
};

export type StudioInfo = {
  address: string;
  mapsUrl: string;
  schedule: DaySchedule[];
};

export const DAY_LABELS = [
  "Domenica",
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
] as const;

const WEEKDAY_SLOTS: TimeSlot[] = [
  { open: "09:30", close: "12:00" },
  { open: "15:00", close: "19:00" },
];

/** Orari indicativi di default (editabili da admin) */
export const DEFAULT_SCHEDULE: DaySchedule[] = [
  { day: 0, closed: true, slots: [] },
  { day: 1, closed: false, slots: WEEKDAY_SLOTS },
  { day: 2, closed: false, slots: WEEKDAY_SLOTS },
  { day: 3, closed: false, slots: WEEKDAY_SLOTS },
  { day: 4, closed: false, slots: WEEKDAY_SLOTS },
  { day: 5, closed: false, slots: WEEKDAY_SLOTS },
  { day: 6, closed: false, slots: WEEKDAY_SLOTS },
];

/**
 * Indirizzo placeholder: via completa da completare in admin
 * (non pubblicata online in modo affidabile al momento della setup).
 */
export const DEFAULT_ADDRESS =
  "Mirai Tattoo & Piercing Atelier, Domodossola (VB)";

export const SETTING_KEYS = {
  address: "studio.address",
  mapsUrl: "studio.mapsUrl",
  schedule: "studio.schedule",
} as const;

/** Link Google Maps Search (nessuna API key) */
export function mapsSearchUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address.trim()
  )}`;
}

/** Embed iframe Maps (nessuna API key) */
export function mapsEmbedUrl(address: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(
    address.trim()
  )}&z=16&output=embed`;
}

export function resolveMapsUrl(address: string, custom?: string | null) {
  const trimmed = custom?.trim();
  if (trimmed) return trimmed;
  return mapsSearchUrl(address);
}

export function normalizeSchedule(raw: unknown): DaySchedule[] {
  if (!Array.isArray(raw) || raw.length !== 7) return DEFAULT_SCHEDULE;
  return DEFAULT_SCHEDULE.map((fallback, i) => {
    const row = raw.find(
      (r) =>
        r &&
        typeof r === "object" &&
        "day" in r &&
        (r as DaySchedule).day === i
    ) as DaySchedule | undefined;
    if (!row) return fallback;
    return {
      day: i,
      closed: Boolean(row.closed),
      slots: Array.isArray(row.slots)
        ? row.slots
            .filter(
              (s) =>
                s &&
                typeof s.open === "string" &&
                typeof s.close === "string"
            )
            .map((s) => ({ open: s.open, close: s.close }))
        : [],
    };
  });
}

export function formatScheduleLine(day: DaySchedule) {
  if (day.closed || !day.slots.length) return "Chiuso";
  return day.slots.map((s) => `${s.open}–${s.close}`).join(" · ");
}

export const GALLERY_TYPES = [
  { value: "PIERCING", label: "Piercing" },
  { value: "TATTOO", label: "Tatuaggio" },
  { value: "JEWELRY", label: "Gioielleria" },
] as const;

export type GalleryType = (typeof GALLERY_TYPES)[number]["value"];
