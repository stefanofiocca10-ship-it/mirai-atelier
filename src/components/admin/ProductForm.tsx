"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import type { Category, Product } from "@prisma/client";
import { PRODUCT_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = {
  categories: Category[];
  mode: "create" | "edit";
  product?: Product;
};

export function ProductForm({ categories, mode, product }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [material, setMaterial] = useState(product?.material ?? "");
  const [status, setStatus] = useState(product?.status ?? "DISPONIBILE");
  const [categoryId, setCategoryId] = useState(
    product?.categoryId ?? categories[0]?.id ?? ""
  );
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      if (data.url) {
        setImageUrl(data.url);
      }
    } catch {
      setError("Errore di rete durante il caricamento.");
    } finally {
      setUploading(false);
      e.target.value = "";
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
        categoryId,
        featured,
        imageUrl: imageUrl.trim() || null,
      };

      if (!payload.title) {
        setError("Il titolo è obbligatorio.");
        setSaving(false);
        return;
      }
      if (!payload.categoryId) {
        setError("Seleziona una categoria.");
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
      className="max-w-2xl space-y-6 rounded-xl border border-[color-mix(in_srgb,var(--stone)_30%,transparent)] bg-[var(--charcoal)] p-6"
    >
      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--sand)]"
        >
          Titolo
        </label>
        <input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-[color-mix(in_srgb,var(--stone)_40%,transparent)] bg-[var(--ink)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--terracotta)] focus:ring-2"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--sand)]"
        >
          Descrizione
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-[color-mix(in_srgb,var(--stone)_40%,transparent)] bg-[var(--ink)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--terracotta)] focus:ring-2"
        />
      </div>

      <div>
        <label
          htmlFor="material"
          className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--sand)]"
        >
          Materiale
        </label>
        <input
          id="material"
          name="material"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          className="w-full rounded-md border border-[color-mix(in_srgb,var(--stone)_40%,transparent)] bg-[var(--ink)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--terracotta)] focus:ring-2"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="status"
            className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--sand)]"
          >
            Stato
          </label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-md border border-[color-mix(in_srgb,var(--stone)_40%,transparent)] bg-[var(--ink)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--terracotta)] focus:ring-2"
          >
            {PRODUCT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="categoryId"
            className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--sand)]"
          >
            Categoria
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-md border border-[color-mix(in_srgb,var(--stone)_40%,transparent)] bg-[var(--ink)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--terracotta)] focus:ring-2"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.group} · {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-[var(--stone)] bg-[var(--ink)] text-[var(--terracotta)] focus:ring-[var(--terracotta)]"
        />
        <span className="text-sm text-[var(--sand)]">In evidenza</span>
      </label>

      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[var(--sand)]">
          Immagine
        </p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-[var(--sand)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--terracotta)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--cream)] hover:file:bg-[var(--terracotta-deep)]"
        />
        {uploading ? (
          <p className="mt-2 text-xs text-[var(--gold)]">Caricamento…</p>
        ) : null}
        {imageUrl ? (
          <div className="mt-4 space-y-2">
            <div className="relative h-48 w-full overflow-hidden rounded-md border border-[color-mix(in_srgb,var(--stone)_30%,transparent)] bg-[var(--ink)]">
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
              className="text-xs text-[var(--terracotta)] underline hover:text-[var(--cream)]"
            >
              Rimuovi immagine
            </button>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm text-[var(--terracotta)]" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className={cn(
            "rounded-md bg-[var(--terracotta)] px-5 py-2.5 text-sm font-semibold text-[var(--cream)] transition-colors",
            "hover:bg-[var(--terracotta-deep)] disabled:cursor-not-allowed disabled:opacity-60"
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
