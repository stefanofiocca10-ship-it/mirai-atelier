"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, ImageIcon, Upload } from "lucide-react";
import type { Category, Product } from "@prisma/client";
import { CATALOG_KINDS, PRODUCT_STATUSES, type CatalogKind } from "@/lib/constants";
import { isAssignableCategory } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { ToriiFrame } from "@/components/brand/ToriiFrame";

type ProductWithCategories = Product & {
  categories?: { categoryId: string; category?: Category }[];
  images?: { imageUrl: string; sortOrder: number }[];
};

type Props = {
  categories: Category[];
  mode: "create" | "edit";
  product?: ProductWithCategories;
};

function initialImageList(product?: ProductWithCategories) {
  const fromRelation = (product?.images ?? [])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((i) => i.imageUrl);
  if (fromRelation.length) return fromRelation;
  if (product?.imageUrl) return [product.imageUrl];
  return [] as string[];
}

export function ProductForm({ categories, mode, product }: Props) {
  const router = useRouter();
  const initialIds = product?.categories?.map((c) => c.categoryId) ?? [];

  const initialKind: CatalogKind = (() => {
    const first = categories.find((c) => initialIds.includes(c.id));
    return (first?.kind as CatalogKind) || "PIERCING";
  })();

  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [material, setMaterial] = useState(product?.material ?? "");
  const [status, setStatus] = useState(product?.status ?? "DISPONIBILE");
  const [quantity, setQuantity] = useState(product?.quantity ?? 0);
  const [kind, setKind] = useState<CatalogKind>(initialKind);
  const [categoryIds, setCategoryIds] = useState<string[]>(initialIds);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [imageUrls, setImageUrls] = useState<string[]>(() =>
    initialImageList(product)
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newLeafName, setNewLeafName] = useState("");
  const [newLeafZone, setNewLeafZone] = useState("");
  const [creatingLeaf, setCreatingLeaf] = useState(false);
  const [localCategories, setLocalCategories] = useState(categories);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const zones = useMemo(() => {
    const map = new Map<string, { zone: string; label: string }>();
    for (const c of localCategories) {
      if (c.kind !== kind) continue;
      if (c.parentId) continue;
      map.set(c.zone, { zone: c.zone, label: c.name });
    }
    return Array.from(map.values());
  }, [localCategories, kind]);

  const assignableByZone = useMemo(() => {
    const map = new Map<string, Category[]>();
    for (const c of localCategories) {
      if (c.kind !== kind || !isAssignableCategory(c)) continue;
      const list = map.get(c.zone) ?? [];
      list.push(c);
      map.set(c.zone, list);
    }
    for (const list of Array.from(map.values())) {
      list.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
    }
    return map;
  }, [localCategories, kind]);

  function toggleCategory(id: string) {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function switchKind(next: CatalogKind) {
    setKind(next);
    setCategoryIds((prev) =>
      prev.filter((id) => localCategories.find((c) => c.id === id)?.kind === next)
    );
    setNewLeafZone("");
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Caricamento non riuscito.");
        return;
      }
      if (data.url) setImageUrls((prev) => [...prev, data.url!]);
    } catch {
      setError("Errore di rete durante il caricamento.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function createLeaf() {
    const name = newLeafName.trim();
    const zone = newLeafZone || zones[0]?.zone;
    if (!name || !zone) {
      setError("Indica nome e zona per la nuova sottocategoria.");
      return;
    }
    setCreatingLeaf(true);
    setError(null);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, kind, zone }),
      });
      const data = (await res.json()) as Category & { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Creazione categoria non riuscita.");
        return;
      }
      setLocalCategories((prev) => [...prev, data]);
      setCategoryIds((prev) => [...prev, data.id]);
      setNewLeafName("");
    } catch {
      setError("Errore di rete durante la creazione della categoria.");
    } finally {
      setCreatingLeaf(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        material: material.trim() || null,
        status,
        quantity: Number.isFinite(quantity) ? Math.max(0, Math.floor(quantity)) : 0,
        categoryIds,
        featured,
        imageUrls,
        imageUrl: imageUrls[0] ?? null,
      };

      if (!payload.title) {
        setError("Il titolo è obbligatorio.");
        setSaving(false);
        return;
      }
      if (!payload.categoryIds.length) {
        setError("Seleziona almeno una categoria (puoi sceglierne più di una).");
        setSaving(false);
        return;
      }

      const url =
        mode === "create"
          ? "/api/products"
          : `/api/products/${product?.id ?? ""}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { error?: string; id?: string };
      if (!res.ok) {
        setError(data.error ?? "Salvataggio non riuscito.");
        setSaving(false);
        return;
      }

      if (mode === "create" && data.id) {
        router.push(`/admin/prodotti/${data.id}`);
        router.refresh();
      } else {
        router.refresh();
      }
    } catch {
      setError("Errore di rete durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ToriiFrame
      variant="myojin"
      className="max-w-2xl"
      contentClassName="panel-mirai p-6"
    >
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="label-atelier mb-2 block">
          Titolo
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="field-atelier"
        />
      </div>

      <div>
        <label htmlFor="description" className="label-atelier mb-2 block">
          Descrizione
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="field-atelier min-h-[7rem] py-3"
        />
      </div>

      <div>
        <label htmlFor="material" className="label-atelier mb-2 block">
          Materiale
        </label>
        <input
          id="material"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          className="field-atelier"
        />
      </div>

      <div>
        <label htmlFor="status" className="label-atelier mb-2 block">
          Stato inventario / vetrina
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="field-atelier"
        >
          {PRODUCT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="label-atelier mb-3">1 · Tipo catalogo</legend>
        <div className="flex flex-wrap gap-2">
          {CATALOG_KINDS.map((k) => (
            <button
              key={k.value}
              type="button"
              onClick={() => switchKind(k.value)}
              className={cn("btn-toggle", kind === k.value && "is-active")}
            >
              {k.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label-atelier mb-3">
          2 · Categorie (anche più di una)
        </legend>
        <p className="mb-3 text-xs text-muted">
          Es. un gioiello da naso può andare anche su un foro dell&apos;orecchio:
          seleziona tutte le posizioni adatte.
        </p>
        <div className="space-y-4">
          {zones.map((z) => {
            const leaves = assignableByZone.get(z.zone) ?? [];
            if (!leaves.length) return null;
            return (
              <div key={z.zone} className="panel-mirai p-3">
                <p className="text-sm font-medium text-ink">{z.label}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {leaves.map((leaf) => {
                    const checked = categoryIds.includes(leaf.id);
                    return (
                      <label
                        key={leaf.id}
                        className={cn(
                          "btn-chip cursor-pointer",
                          checked && "is-active"
                        )}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          onChange={() => toggleCategory(leaf.id)}
                        />
                        {leaf.name}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </fieldset>

      {kind === "PIERCING" ? (
        <div className="panel-mirai p-3">
          <p className="label-atelier">Nuova sottocategoria</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <select
              value={newLeafZone || zones[0]?.zone || ""}
              onChange={(e) => setNewLeafZone(e.target.value)}
              className="field-atelier"
            >
              {zones.map((z) => (
                <option key={z.zone} value={z.zone}>
                  {z.label}
                </option>
              ))}
            </select>
            <input
              value={newLeafName}
              onChange={(e) => setNewLeafName(e.target.value)}
              placeholder="Es. Rook alto"
              className="field-atelier flex-1"
            />
            <button
              type="button"
              onClick={createLeaf}
              disabled={creatingLeaf}
              className="btn-ghost"
            >
              {creatingLeaf ? "…" : "Aggiungi"}
            </button>
          </div>
        </div>
      ) : null}

      <div>
        <label htmlFor="quantity" className="label-atelier mb-2 block">
          Quantità in atelier
        </label>
        <input
          id="quantity"
          type="number"
          min={0}
          step={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="field-atelier max-w-[10rem]"
        />
        <p className="mt-2 text-xs text-muted">
          Pezzi fisici disponibili (0 = da aggiornare / non tracciato).
        </p>
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-line text-ink focus:ring-khaki-deep"
        />
        <span className="text-sm text-muted">In evidenza in vetrina</span>
      </label>

      <div>
        <p className="label-atelier mb-2">Foto prodotto</p>
        <p className="mb-3 text-xs text-muted">
          Puoi caricarne più di una: la prima è la cover del catalogo; sul sito
          pubblico si naviga tra tutte.
        </p>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          tabIndex={-1}
          disabled={uploading}
          onChange={handleFileChange}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/*"
          className="sr-only"
          tabIndex={-1}
          disabled={uploading}
          onChange={handleFileChange}
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            disabled={uploading}
            onClick={() => cameraInputRef.current?.click()}
            className="btn-ghost"
          >
            <Camera className="h-4 w-4 text-khaki-deep" />
            Scatta foto
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={() => galleryInputRef.current?.click()}
            className="btn-ghost sm:hidden"
          >
            <ImageIcon className="h-4 w-4 text-khaki-deep" />
            Dalla galleria
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={() => galleryInputRef.current?.click()}
            className="btn-primary"
          >
            <Upload className="h-4 w-4" />
            <span className="sm:hidden">Aggiungi foto</span>
            <span className="hidden sm:inline">Aggiungi dal computer</span>
          </button>
        </div>

        {uploading ? (
          <p className="mt-2 text-xs text-khaki-deep">
            Caricamento e ottimizzazione…
          </p>
        ) : null}

        {imageUrls.length ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {imageUrls.map((url, i) => (
              <li key={url + i} className="space-y-2">
                <div className="panel-mirai relative h-36 w-full overflow-hidden bg-paper-soft">
                  <Image
                    src={url}
                    alt={`Foto ${i + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, 20rem"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {i === 0 ? (
                    <span className="text-[10px] uppercase tracking-wider text-khaki-deep">
                      Cover
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="btn-ghost btn-sm"
                      onClick={() =>
                        setImageUrls((prev) => {
                          const next = [...prev];
                          const [item] = next.splice(i, 1);
                          next.unshift(item);
                          return next;
                        })
                      }
                    >
                      Imposta cover
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-ghost btn-sm"
                    onClick={() =>
                      setImageUrls((prev) => prev.filter((_, j) => j !== i))
                    }
                  >
                    Rimuovi
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="btn-primary"
        >
          {saving
            ? "Salvataggio…"
            : mode === "create"
              ? "Crea prodotto"
              : "Salva modifiche"}
        </button>
      </div>
    </form>
    </ToriiFrame>
  );
}
