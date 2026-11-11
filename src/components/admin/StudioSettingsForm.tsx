"use client";

import { useState } from "react";
import { ToriiFrame } from "@/components/brand/ToriiFrame";
import {
  DAY_LABELS,
  mapsSearchUrl,
  type DaySchedule,
  type StudioInfo,
} from "@/lib/studio-shared";

export function StudioSettingsForm({ initial }: { initial: StudioInfo }) {
  const [address, setAddress] = useState(initial.address);
  const [mapsUrl, setMapsUrl] = useState(
    initial.mapsUrl === mapsSearchUrl(initial.address) ? "" : initial.mapsUrl
  );
  const [schedule, setSchedule] = useState<DaySchedule[]>(initial.schedule);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateDay(day: number, patch: Partial<DaySchedule>) {
    setSchedule((prev) =>
      prev.map((d) => (d.day === day ? { ...d, ...patch } : d))
    );
  }

  function updateSlot(
    day: number,
    slotIndex: number,
    field: "open" | "close",
    value: string
  ) {
    setSchedule((prev) =>
      prev.map((d) => {
        if (d.day !== day) return d;
        const slots = d.slots.map((s, i) =>
          i === slotIndex ? { ...s, [field]: value } : s
        );
        return { ...d, slots };
      })
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setOk(null);
    setError(null);
    try {
      const res = await fetch("/api/studio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          address,
          mapsUrl,
          schedule: schedule.map((d) =>
            d.closed
              ? { ...d, slots: [] }
              : {
                  ...d,
                  slots:
                    d.slots.length > 0
                      ? d.slots
                      : [
                          { open: "09:30", close: "12:00" },
                          { open: "15:00", close: "19:00" },
                        ],
                }
          ),
        }),
      });
      const data = (await res.json()) as StudioInfo & { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Salvataggio non riuscito.");
        return;
      }
      setAddress(data.address);
      setMapsUrl(
        data.mapsUrl === mapsSearchUrl(data.address) ? "" : data.mapsUrl
      );
      setSchedule(data.schedule);
      setOk("Orari e indirizzo aggiornati.");
    } catch {
      setError("Errore di rete.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ToriiFrame variant="myojin" contentClassName="panel-mirai p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <p className="label-atelier">Dove siamo</p>
          <label htmlFor="address" className="label-atelier mb-2 mt-4 block">
            Indirizzo (via completa)
          </label>
          <input
            id="address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="field-atelier"
            placeholder="Via …, CAP Domodossola (VB)"
          />
          <p className="mt-2 text-xs text-muted">
            Su Contatti apriamo Google Maps con questo indirizzo (nessuna API
            key). Se hai un link Maps ufficiale della scheda, incollalo sotto.
          </p>
          <label htmlFor="mapsUrl" className="label-atelier mb-2 mt-4 block">
            Link Google Maps (opzionale)
          </label>
          <input
            id="mapsUrl"
            value={mapsUrl}
            onChange={(e) => setMapsUrl(e.target.value)}
            className="field-atelier"
            placeholder="https://maps.google.com/…"
          />
        </div>

        <div>
          <p className="label-atelier">Orari di apertura</p>
          <p className="mt-2 text-xs text-muted">
            Indicativi: puoi chiudere un giorno o cambiare le fasce.
          </p>
          <ul className="mt-4 space-y-4">
            {schedule.map((day) => (
              <li
                key={day.day}
                className="border border-line bg-paper-soft/60 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-medium text-ink">{DAY_LABELS[day.day]}</p>
                  <label className="flex items-center gap-2 text-sm text-muted">
                    <input
                      type="checkbox"
                      checked={day.closed}
                      onChange={(e) =>
                        updateDay(day.day, {
                          closed: e.target.checked,
                          slots: e.target.checked
                            ? []
                            : day.slots.length
                              ? day.slots
                              : [
                                  { open: "09:30", close: "12:00" },
                                  { open: "15:00", close: "19:00" },
                                ],
                        })
                      }
                    />
                    Chiuso
                  </label>
                </div>
                {!day.closed ? (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {(day.slots.length
                      ? day.slots
                      : [
                          { open: "09:30", close: "12:00" },
                          { open: "15:00", close: "19:00" },
                        ]
                    ).map((slot, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="time"
                          value={slot.open}
                          onChange={(e) =>
                            updateSlot(day.day, i, "open", e.target.value)
                          }
                          className="field-atelier"
                        />
                        <span className="text-muted">–</span>
                        <input
                          type="time"
                          value={slot.close}
                          onChange={(e) =>
                            updateSlot(day.day, i, "close", e.target.value)
                          }
                          className="field-atelier"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted">Chiuso tutto il giorno</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {ok ? <p className="text-sm text-khaki-deep">{ok}</p> : null}

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Salvataggio…" : "Salva studio"}
        </button>
      </form>
    </ToriiFrame>
  );
}
