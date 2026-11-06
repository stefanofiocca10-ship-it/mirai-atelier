"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Category, Product } from "@prisma/client";
import { CATALOG_KINDS, PRODUCT_STATUSES, type CatalogKind } from "@/lib/constants";
import { isAssignableCategory } from "@/lib/categories";
import { cn } from "@/lib/utils";

type ProductWithCategories = Product & {
  categories?: { categoryId: string; category?: Category }[];
};

type Props = {
  categories: Category[];
  mode: "create" | "edit";
  product?: ProductWithCategories;
};

const fieldClass =
  "w-full rounded-md border border-line bg-paper px-3 py-2 text-ink outline-none ring-khaki-deep placeholder:text-muted-soft focus:ring-2";

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
  const [kind, setKind] = useState<CatalogKind>(initialKind);
  const [categoryIds, setCategoryIds] = useState<string[]>(initialIds);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newLeafName, setNewLeafName] = useState("");
  const [newLeafZone, setNewLeafZone] = useState("");
  const [creatingLeaf, setCreatingLeaf] = useState(false);
  const [localCategories, setLocalCategories] = useState(categories);

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
    for (const list of map.values()) {
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
      if (data.url) setImageUrl(data.url);
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
        categoryIds,
        featured,
        imageUrl: imageUrl.trim() || null,
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
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6 rounded-xl border border-line bg-paper p-6"
    >
      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted"
        >
          Titolo
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted"
        >
          Descrizione
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label
          htmlFor="material"
          className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted"
        >
          Materiale
        </label>
        <input
          id="material"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted"
        >
          Stato inventario / vetrina
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={fieldClass}
        >
          {PRODUCT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
          1 · Tipo catalogo
        </legend>
        <div className="flex flex-wrap gap-2">
          {CATALOG_KINDS.map((k) => (
            <button
              key={k.value}
              type="button"
              onClick={() => switchKind(k.value)}
              className={cn(
                "rounded-md border px-4 py-2 text-sm transition",
                kind === k.value
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-muted hover:text-ink"
              )}
            >
              {k.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
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
              <div key={z.zone} className="rounded-md border border-line p-3">
                <p className="text-sm font-medium text-ink">{z.label}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {leaves.map((leaf) => {
                    const checked = categoryIds.includes(leaf.id);
                    return (
                      <label
                        key={leaf.id}
                        className={cn(
                          "cursor-pointer rounded-md border px-3 py-1.5 text-xs transition",
                          checked
                            ? "border-khaki-deep bg-khaki-soft text-ink"
                            : "border-line text-muted hover:border-khaki-deep"
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
        <div className="rounded-md border border-dashed border-line p-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Nuova sottocategoria
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <select
              value={newLeafZone || zones[0]?.zone || ""}
              onChange={(e) => setNewLeafZone(e.target.value)}
              className="rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none ring-khaki-deep focus:ring-2"
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
              className="flex-1 rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted-soft outline-none ring-khaki-deep focus:ring-2"
            />
            <button
              type="button"
              onClick={createLeaf}
              disabled={creatingLeaf}
              className="rounded-md border border-khaki-deep px-3 py-2 text-sm text-khaki-deep hover:bg-khaki-soft disabled:opacity-60"
            >
              {creatingLeaf ? "…" : "Aggiungi"}
            </button>
          </div>
        </div>
      ) : null}

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
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">
          Immagine
        </p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-medium file:text-paper hover:file:bg-ink-soft"
        />
        {uploading ? (
          <p className="mt-2 text-xs text-khaki-deep">Caricamento…</p>
        ) : null}
        {imageUrl ? (
          <div className="mt-4 space-y-2">
            <div className="relative h-48 w-full overflow-hidden rounded-md border border-line bg-paper-soft">
              <Image
                src={imageUrl}
                alt="Anteprima"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, 42rem"
              />
            </div>
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="text-xs text-muted underline hover:text-ink"
            >
              Rimuovi immagine
            </button>
          </div>
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
          className={cn(
            "rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors",
            "hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          {saving
            ? "Salvataggio…"
            : mode === "create"
              ? "Crea prodotto"
              : "Salva modifiche"}
        </button>
      </div>
    </form>
  );
}
