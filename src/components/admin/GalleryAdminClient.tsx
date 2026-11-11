"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { ToriiFrame } from "@/components/brand/ToriiFrame";
import { GALLERY_TYPES } from "@/lib/studio-shared";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  title: string | null;
  imageUrl: string;
  type: string;
  featured: boolean;
  sortOrder: number;
};

export function GalleryAdminClient({ initial }: { initial: Item[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(initial);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<(typeof GALLERY_TYPES)[number]["value"]>(
    "PIERCING"
  );
  const [featured, setFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Upload non riuscito.");
        return;
      }
      setImageUrl(data.url);
    } catch {
      setError("Errore di rete in upload.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl) {
      setError("Carica una foto prima di pubblicare.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim() || null,
          imageUrl,
          type,
          featured,
        }),
      });
      const data = (await res.json()) as Item & { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Salvataggio non riuscito.");
        return;
      }
      setItems((prev) => [data, ...prev]);
      setTitle("");
      setImageUrl("");
      setFeatured(false);
      router.refresh();
    } catch {
      setError("Errore di rete.");
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(id: string) {
    if (!confirm("Eliminare questa foto dalla galleria?")) return;
    const res = await fetch(`/api/gallery/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    router.refresh();
  }

  async function toggleFeatured(item: Item) {
    const res = await fetch(`/api/gallery/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ featured: !item.featured }),
    });
    if (!res.ok) return;
    const updated = (await res.json()) as Item;
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
  }

  async function move(item: Item, dir: -1 | 1) {
    const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex((i) => i.id === item.id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    await Promise.all([
      fetch(`/api/gallery/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sortOrder: swap.sortOrder }),
      }),
      fetch(`/api/gallery/${swap.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sortOrder: item.sortOrder }),
      }),
    ]);
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === item.id) return { ...i, sortOrder: swap.sortOrder };
        if (i.id === swap.id) return { ...i, sortOrder: item.sortOrder };
        return i;
      })
    );
  }

  return (
    <div className="space-y-8">
      <ToriiFrame variant="myojin" contentClassName="panel-mirai p-6">
        <form onSubmit={handleCreate} className="space-y-4">
          <p className="label-atelier">Aggiungi lavoro</p>
          <div>
            <label className="label-atelier mb-2 block" htmlFor="g-title">
              Titolo (opzionale)
            </label>
            <input
              id="g-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="field-atelier"
              placeholder="Es. Helix — titanio"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-atelier mb-2 block" htmlFor="g-type">
                Tipo
              </label>
              <select
                id="g-type"
                value={type}
                onChange={(e) =>
                  setType(e.target.value as (typeof GALLERY_TYPES)[number]["value"])
                }
                className="field-atelier"
              >
                {GALLERY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-end gap-3 pb-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              In evidenza
            </label>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFile}
          />
          <button
            type="button"
            className="btn-ghost"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Caricamento…" : "Carica foto"}
          </button>

          {imageUrl ? (
            <div className="relative h-40 w-full max-w-xs overflow-hidden border border-line">
              <Image
                src={imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
          ) : null}

          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button type="submit" className="btn-primary" disabled={saving || uploading}>
            {saving ? "Pubblicazione…" : "Pubblica in galleria"}
          </button>
        </form>
      </ToriiFrame>

      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted">Nessuna foto ancora.</p>
        ) : (
          [...items]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((item) => (
              <ToriiFrame
                key={item.id}
                variant="shinmei"
                contentClassName="panel-mirai p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden border border-line">
                    <Image
                      src={item.imageUrl}
                      alt={item.title || ""}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink">
                      {item.title || "Senza titolo"}
                    </p>
                    <p className="text-xs text-muted">
                      {GALLERY_TYPES.find((t) => t.value === item.type)?.label ??
                        item.type}
                      {item.featured ? " · Evidenza" : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn-ghost btn-sm"
                      onClick={() => move(item, -1)}
                    >
                      Su
                    </button>
                    <button
                      type="button"
                      className="btn-ghost btn-sm"
                      onClick={() => move(item, 1)}
                    >
                      Giù
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "btn-toggle btn-sm",
                        item.featured && "is-active"
                      )}
                      onClick={() => toggleFeatured(item)}
                    >
                      Evidenza
                    </button>
                    <button
                      type="button"
                      className="btn-ghost btn-sm"
                      onClick={() => removeItem(item.id)}
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              </ToriiFrame>
            ))
        )}
      </div>
    </div>
  );
}
