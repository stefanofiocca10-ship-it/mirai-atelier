"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@prisma/client";
import { CATALOG_KINDS, type CatalogKind } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = {
  zones: Category[];
  leaves: Category[];
};

export function CategoryAdminClient({ zones, leaves }: Props) {
  const router = useRouter();
  const [kind, setKind] = useState<CatalogKind>("PIERCING");
  const [zone, setZone] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const kindZones = useMemo(
    () => zones.filter((z) => z.kind === kind),
    [zones, kind]
  );

  const kindLeaves = useMemo(
    () => leaves.filter((l) => l.kind === kind),
    [leaves, kind]
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          kind,
          zone: zone || kindZones[0]?.zone || "",
        }),
      });
      const data = (await res.json()) as { error?: string; name?: string };
      if (!res.ok) {
        setError(data.error ?? "Creazione non riuscita.");
        return;
      }
      setName("");
      setOk(`Creata: ${data.name}`);
      router.refresh();
    } catch {
      setError("Errore di rete.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleCreate}
        className="space-y-4 rounded-xl border border-line bg-paper p-6"
      >
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Aggiungi categoria
        </p>
        <div className="flex flex-wrap gap-2">
          {CATALOG_KINDS.map((k) => (
            <button
              key={k.value}
              type="button"
              onClick={() => {
                setKind(k.value);
                setZone("");
              }}
              className={cn(
                "rounded-md border px-3 py-2 text-sm transition",
                kind === k.value
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-muted hover:text-ink"
              )}
            >
              {k.label}
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {kind === "PIERCING" ? (
            <select
              value={zone || kindZones[0]?.zone || ""}
              onChange={(e) => setZone(e.target.value)}
              className="rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink outline-none ring-khaki-deep focus:ring-2"
            >
              {kindZones.map((z) => (
                <option key={z.id} value={z.zone}>
                  {z.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="self-center text-xs text-muted sm:col-span-1">
              Nuova voce gioielleria (es. Cavigliere)
            </p>
          )}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={kind === "PIERCING" ? "Es. Helix doppio" : "Es. Cavigliere"}
            className="rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted-soft outline-none ring-khaki-deep focus:ring-2 sm:col-span-1"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-paper disabled:opacity-60"
          >
            {saving ? "…" : "Crea"}
          </button>
        </div>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {ok ? <p className="text-sm text-khaki-deep">{ok}</p> : null}
      </form>

      <div className="space-y-4">
        {kindZones.map((z) => {
          const items = kindLeaves.filter((l) => l.zone === z.zone);
          return (
            <div
              key={z.id}
              className="rounded-xl border border-line bg-paper p-4"
            >
              <p className="text-sm font-medium text-ink">
                {z.name}{" "}
                <span className="text-xs text-muted">({z.kind})</span>
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {items.map((leaf) => (
                  <li
                    key={leaf.id}
                    className="rounded-md border border-line px-3 py-1.5 text-xs text-muted"
                  >
                    {leaf.name}
                  </li>
                ))}
                {!items.length ? (
                  <li className="text-xs text-muted">Nessuna voce</li>
                ) : null}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
