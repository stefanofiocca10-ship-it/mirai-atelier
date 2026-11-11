"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CATALOG_MODELS,
  getCatalogModelById,
  pickRandomCatalogModelId,
  pickRandomCatalogModelIdByGender,
  type CatalogModel,
  type CatalogModelGender,
} from "@/lib/catalog-models";

type CatalogModelContextValue = {
  model: CatalogModel;
  setGender: (gender: CatalogModelGender) => void;
};

const CatalogModelContext = createContext<CatalogModelContextValue | null>(
  null
);

/**
 * Sceglie un modello a caso a ogni caricamento completo della pagina
 * (priorità donna). Resta lo stesso in navigazione client-side; cambia al refresh
 * o quando l'utente cambia genere.
 */
export function CatalogModelProvider({ children }: { children: ReactNode }) {
  const [model, setModel] = useState<CatalogModel>(() =>
    getCatalogModelById(pickRandomCatalogModelId("donna", 0.85))
  );

  const setGender = useCallback((gender: CatalogModelGender) => {
    setModel((current) => {
      if (current.gender === gender) return current;
      return getCatalogModelById(pickRandomCatalogModelIdByGender(gender));
    });
  }, []);

  const value = useMemo(
    () => ({ model, setGender }),
    [model, setGender]
  );

  return (
    <CatalogModelContext.Provider value={value}>
      {children}
    </CatalogModelContext.Provider>
  );
}

export function useCatalogModel() {
  const ctx = useContext(CatalogModelContext);
  // Fallback se usato fuori dal provider (es. test)
  return (
    ctx ?? {
      model: CATALOG_MODELS[0],
      setGender: () => undefined,
    }
  );
}
