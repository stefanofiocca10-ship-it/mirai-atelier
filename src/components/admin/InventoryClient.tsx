"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ToriiFrame } from "@/components/brand/ToriiFrame";
import { CATALOG_KINDS, PRODUCT_STATUSES } from "@/lib/constants";
import { primaryCategoryLabel } from "@/lib/categories";
import { cn, statusLabel } from "@/lib/utils";

export type InventoryCategory = {
  id: string;
  name: string;
  slug: string;
  kind: string;
  zone: string;
  parentId: string | null;
};

export type InventoryProduct = {
  id: string;
  title: string;
  slug: string;
  material: string | null;
  status: string;
  featured: boolean;
  quantity: number;
  categories: InventoryCategory[];
};

type CountRow = { key: string; label: string; count: number; hint?: string };

function countMapToRows(
  map: Map<string, number>,
  labelOf: (key: string) => string,
  hintOf?: (key: string) => string | undefined
): CountRow[] {
  return Array.from(map.entries())
    .map(([key, count]) => ({
      key,
      label: labelOf(key),
      count,
      hint: hintOf?.(key),
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function InventoryClient({
  products,
  categories,
}: {
  products: InventoryProduct[];
  categories: InventoryCategory[];
}) {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("");
  const [zone, setZone] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("");
  const [material, setMaterial] = useState("");
  const [featured, setFeatured] = useState("");

  const materials = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      const m = p.material?.trim();
      if (m) set.add(m);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const zones = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of categories) {
      if (kind && c.kind !== kind) continue;
      if (!map.has(`${c.kind}:${c.zone}`)) {
        map.set(`${c.kind}:${c.zone}`, c.zone);
      }
    }
    // Prefer zone labels from root categories when available
    const labels = new Map<string, string>();
    for (const c of categories) {
      if (c.parentId) continue;
      if (kind && c.kind !== kind) continue;
      labels.set(c.zone, c.name);
    }
    return Array.from(new Set(Array.from(map.values())))
      .sort((a, b) => a.localeCompare(b))
      .map((z) => ({ value: z, label: labels.get(z) ?? z }));
  }, [categories, kind]);

  const categoryOptions = useMemo(() => {
    return categories
      .filter((c) => {
        if (kind && c.kind !== kind) return false;
        if (zone && c.zone !== zone) return false;
        return true;
      })
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, kind, zone]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return products.filter((p) => {
      if (status && p.status !== status) return false;
      if (featured === "yes" && !p.featured) return false;
      if (featured === "no" && p.featured) return false;
      if (material) {
        if ((p.material ?? "").trim() !== material) return false;
      }
      if (kind && !p.categories.some((c) => c.kind === kind)) return false;
      if (zone && !p.categories.some((c) => c.zone === zone)) return false;
      if (categoryId && !p.categories.some((c) => c.id === categoryId)) {
        return false;
      }
      if (query) {
        const hay = [
          p.title,
          p.material ?? "",
          ...p.categories.map((c) => c.name),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [products, q, kind, zone, categoryId, status, material, featured]);

  const summary = useMemo(() => {
    const byStatus = new Map<string, number>();
    const byKind = new Map<string, number>();
    const byZone = new Map<string, number>();
    const byCategory = new Map<string, number>();
    const byMaterial = new Map<string, number>();
    let withoutCategory = 0;
    let featuredCount = 0;
    let pieces = 0;

    for (const p of filtered) {
      byStatus.set(p.status, (byStatus.get(p.status) ?? 0) + 1);
      if (p.featured) featuredCount += 1;
      pieces += p.quantity ?? 0;

      const mat = p.material?.trim() || "—";
      byMaterial.set(mat, (byMaterial.get(mat) ?? 0) + 1);

      if (!p.categories.length) {
        withoutCategory += 1;
        continue;
      }

      const kindsSeen = new Set<string>();
      const zonesSeen = new Set<string>();
      for (const c of p.categories) {
        kindsSeen.add(c.kind);
        zonesSeen.add(`${c.kind}:${c.zone}`);
        byCategory.set(c.id, (byCategory.get(c.id) ?? 0) + 1);
      }
      Array.from(kindsSeen).forEach((k) => {
        byKind.set(k, (byKind.get(k) ?? 0) + 1);
      });
      Array.from(zonesSeen).forEach((z) => {
        byZone.set(z, (byZone.get(z) ?? 0) + 1);
      });
    }

    const categoryMeta = new Map(categories.map((c) => [c.id, c]));
    const zoneLabel = (key: string) => {
      const [k, z] = key.split(":");
      const root = categories.find((c) => !c.parentId && c.kind === k && c.zone === z);
      return root?.name ?? z;
    };

    return {
      total: filtered.length,
      pieces,
      featuredCount,
      withoutCategory,
      statusRows: countMapToRows(byStatus, statusLabel),
      kindRows: countMapToRows(
        byKind,
        (k) => CATALOG_KINDS.find((x) => x.value === k)?.label ?? k
      ),
      zoneRows: countMapToRows(byZone, zoneLabel, (key) => key.split(":")[0]),
      categoryRows: countMapToRows(
        byCategory,
        (id) => categoryMeta.get(id)?.name ?? id,
        (id) => {
          const c = categoryMeta.get(id);
          if (!c) return undefined;
          const kindLabel =
            CATALOG_KINDS.find((x) => x.value === c.kind)?.label ?? c.kind;
          return `${kindLabel} · ${c.zone}`;
        }
      ),
      materialRows: countMapToRows(byMaterial, (m) => m),
    };
  }, [filtered, categories]);

  function resetFilters() {
    setQ("");
    setKind("");
    setZone("");
    setCategoryId("");
    setStatus("");
    setMaterial("");
    setFeatured("");
  }

  const hasFilters =
    Boolean(q.trim()) ||
    Boolean(kind) ||
    Boolean(zone) ||
    Boolean(categoryId) ||
    Boolean(status) ||
    Boolean(material) ||
    Boolean(featured);

  return (
    <div className="space-y-8">
      <ToriiFrame variant="myojin" contentClassName="panel-mirai p-6">
        <p className="label-atelier">Filtri</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor="inv-q" className="label-atelier mb-2 block">
              Cerca
            </label>
            <input
              id="inv-q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Titolo, materiale, categoria…"
              className="field-atelier"
            />
          </div>

          <div>
            <label htmlFor="inv-kind" className="label-atelier mb-2 block">
              Tipo
            </label>
            <select
              id="inv-kind"
              value={kind}
              onChange={(e) => {
                setKind(e.target.value);
                setZone("");
                setCategoryId("");
              }}
              className="field-atelier"
            >
              <option value="">Tutti</option>
              {CATALOG_KINDS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="inv-zone" className="label-atelier mb-2 block">
              Zona
            </label>
            <select
              id="inv-zone"
              value={zone}
              onChange={(e) => {
                setZone(e.target.value);
                setCategoryId("");
              }}
              className="field-atelier"
            >
              <option value="">Tutte</option>
              {zones.map((z) => (
                <option key={z.value} value={z.value}>
                  {z.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="inv-cat" className="label-atelier mb-2 block">
              Categoria
            </label>
            <select
              id="inv-cat"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="field-atelier"
            >
              <option value="">Tutte</option>
              {categoryOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="inv-status" className="label-atelier mb-2 block">
              Stato
            </label>
            <select
              id="inv-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="field-atelier"
            >
              <option value="">Tutti</option>
              {PRODUCT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="inv-material" className="label-atelier mb-2 block">
              Materiale
            </label>
            <select
              id="inv-material"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="field-atelier"
            >
              <option value="">Tutti</option>
              {materials.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="inv-featured" className="label-atelier mb-2 block">
              In evidenza
            </label>
            <select
              id="inv-featured"
              value={featured}
              onChange={(e) => setFeatured(e.target.value)}
              className="field-atelier"
            >
              <option value="">Tutti</option>
              <option value="yes">Solo in evidenza</option>
              <option value="no">Non in evidenza</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted">
            {summary.total} prodotti
            {hasFilters ? " con i filtri attivi" : " in totale"}
          </p>
          {hasFilters ? (
            <button type="button" onClick={resetFilters} className="btn-ghost btn-sm">
              Azzera filtri
            </button>
          ) : null}
        </div>
      </ToriiFrame>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <ToriiFrame variant="shinmei" contentClassName="panel-mirai p-5">
          <p className="label-atelier">Voci</p>
          <p className="mt-2 font-display text-3xl text-ink">{summary.total}</p>
        </ToriiFrame>
        <ToriiFrame variant="shinmei" contentClassName="panel-mirai p-5">
          <p className="label-atelier">Pezzi (qty)</p>
          <p className="mt-2 font-display text-3xl text-ink">{summary.pieces}</p>
        </ToriiFrame>
        <ToriiFrame variant="shinmei" contentClassName="panel-mirai p-5">
          <p className="label-atelier">In evidenza</p>
          <p className="mt-2 font-display text-3xl text-ink">
            {summary.featuredCount}
          </p>
        </ToriiFrame>
        <ToriiFrame variant="shinmei" contentClassName="panel-mirai p-5">
          <p className="label-atelier">Senza categoria</p>
          <p className="mt-2 font-display text-3xl text-ink">
            {summary.withoutCategory}
          </p>
        </ToriiFrame>
        <ToriiFrame variant="shinmei" contentClassName="panel-mirai p-5">
          <p className="label-atelier">Stati</p>
          <ul className="mt-3 space-y-1 text-sm">
            {summary.statusRows.length === 0 ? (
              <li className="text-muted">—</li>
            ) : (
              summary.statusRows.map((row) => (
                <li key={row.key} className="flex justify-between gap-3 text-ink">
                  <span className="text-muted">{row.label}</span>
                  <span className="font-medium">{row.count}</span>
                </li>
              ))
            )}
          </ul>
        </ToriiFrame>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CountTable
          title="Per tipo"
          empty="Nessun dato."
          rows={summary.kindRows}
        />
        <CountTable
          title="Per zona"
          empty="Nessun dato."
          rows={summary.zoneRows}
        />
        <CountTable
          title="Per categoria"
          empty="Nessuna categoria nei risultati."
          rows={summary.categoryRows}
        />
        <CountTable
          title="Per materiale"
          empty="Nessun materiale indicato."
          rows={summary.materialRows}
        />
      </div>

      <ToriiFrame variant="shinmei" contentClassName="panel-mirai overflow-x-auto p-0">
        <div className="border-b border-line px-4 py-3">
          <p className="label-atelier">Elenco filtrato</p>
        </div>
        <table className="min-w-full divide-y divide-line text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted">
              <th className="px-4 py-3">Titolo</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Categorie</th>
              <th className="px-4 py-3">Materiale</th>
              <th className="px-4 py-3">Stato</th>
              <th className="px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  Nessun prodotto con questi filtri.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="text-ink">
                  <td className="px-4 py-3">
                    <span className="font-medium">{p.title}</span>
                    {p.featured ? (
                      <span className="ml-2 text-[10px] uppercase tracking-wider text-khaki-deep">
                        Evidenza
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-muted">{p.quantity}</td>
                  <td className="px-4 py-3 text-muted">
                    <span title={p.categories.map((c) => c.name).join(", ")}>
                      {primaryCategoryLabel(p.categories)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {p.material?.trim() || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">{statusLabel(p.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/prodotti/${p.id}`}
                      className={cn("btn-ghost btn-sm")}
                    >
                      Modifica
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </ToriiFrame>
    </div>
  );
}

function CountTable({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: CountRow[];
  empty: string;
}) {
  return (
    <ToriiFrame variant="shinmei" contentClassName="panel-mirai overflow-hidden p-0">
      <div className="border-b border-line px-4 py-3">
        <p className="label-atelier">{title}</p>
      </div>
      {rows.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="divide-y divide-line text-sm">
          {rows.map((row) => (
            <li
              key={row.key}
              className="flex items-baseline justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{row.label}</p>
                {row.hint ? (
                  <p className="truncate text-xs text-muted">{row.hint}</p>
                ) : null}
              </div>
              <span className="shrink-0 font-display text-xl text-ink">
                {row.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </ToriiFrame>
  );
}
