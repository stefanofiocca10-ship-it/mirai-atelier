"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CATALOG_MODELS,
  getCatalogModelById,
  pickRandomCatalogModelId,
  type CatalogModel,
} from "@/lib/catalog-models";

const CatalogModelContext = createContext<CatalogModel | null>(null);

/**
 * Sceglie un modello a caso a ogni caricamento completo della pagina.
 * Resta lo stesso durante la navigazione client-side; cambia al refresh.
 */
export function CatalogModelProvider({ children }: { children: ReactNode }) {
  const [model] = useState<CatalogModel>(() =>
    getCatalogModelById(pickRandomCatalogModelId())
  );

  const value = useMemo(() => model, [model]);

  return (
    <CatalogModelContext.Provider value={value}>
      {children}
    </CatalogModelContext.Provider>
  );
}

export function useCatalogModel() {
  const ctx = useContext(CatalogModelContext);
  // Fallback se usato fuori dal provider (es. test)
  return ctx ?? CATALOG_MODELS[0];
}
