import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function statusLabel(status: string) {
  const map: Record<string, string> = {
    DISPONIBILE: "Disponibile",
    SU_ORDINE: "Su ordine",
    ESAURITO: "Esaurito",
    NUOVA: "Nuova",
    CONTATTATA: "Contattata",
    CONFERMATA: "Confermata",
    COMPLETATA: "Completata",
    ANNULLATA: "Annullata",
  };
  return map[status] ?? status;
}
