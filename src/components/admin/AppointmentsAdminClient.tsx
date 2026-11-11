"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { ToriiFrame } from "@/components/brand/ToriiFrame";
import { APPOINTMENT_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type AppointmentRow = {
  id: string;
  title: string | null;
  guestName: string | null;
  startsAt: string;
  endsAt: string | null;
  status: string;
  notes: string | null;
};

function toLocalInput(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function parseLocalInput(value: string): Date | null {
  if (!value?.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalizeRow(data: AppointmentRow): AppointmentRow {
  return {
    id: data.id,
    title: data.title,
    guestName: data.guestName,
    startsAt:
      typeof data.startsAt === "string"
        ? data.startsAt
        : new Date(data.startsAt).toISOString(),
    endsAt: data.endsAt
      ? typeof data.endsAt === "string"
        ? data.endsAt
        : new Date(data.endsAt).toISOString()
      : null,
    status: data.status,
    notes: data.notes,
  };
}

function emptyForm() {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  now.setHours(now.getHours() + 1);
  return {
    title: "",
    guestName: "",
    startsAt: toLocalInput(now.toISOString()),
    endsAt: "",
    status: "PREVISTO",
    notes: "",
  };
}

function validEndInput(startsAtIso: string, endsAtIso: string | null) {
  if (!endsAtIso) return "";
  const start = new Date(startsAtIso);
  const end = new Date(endsAtIso);
  if (Number.isNaN(end.getTime()) || end <= start) return "";
  return toLocalInput(endsAtIso);
}

function readPayload(formEl: HTMLFormElement) {
  const fd = new FormData(formEl);
  const startsAt = parseLocalInput(String(fd.get("startsAt") ?? ""));
  const endsRaw = String(fd.get("endsAt") ?? "").trim();
  const endsAt = endsRaw ? parseLocalInput(endsRaw) : null;

  if (!startsAt) {
    return { error: "Indica una data/ora di inizio valida." as const };
  }
  if (endsRaw && !endsAt) {
    return { error: "Data/ora di fine non valida." as const };
  }
  if (endsAt && endsAt <= startsAt) {
    return {
      error: "La fine deve essere dopo l'inizio, oppure lasciala vuota." as const,
    };
  }

  return {
    payload: {
      title: String(fd.get("title") ?? "").trim() || null,
      guestName: String(fd.get("guestName") ?? "").trim() || null,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt ? endsAt.toISOString() : null,
      status: String(fd.get("status") ?? "PREVISTO"),
      notes: String(fd.get("notes") ?? "").trim() || null,
    },
  };
}

export function AppointmentsAdminClient({
  initial,
}: {
  initial: AppointmentRow[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(() => initial.map(normalizeRow));
  const [createForm, setCreateForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const sorted = useMemo(
    () =>
      [...items].sort(
        (a, b) =>
          new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
      ),
    [items]
  );

  async function persist(
    formEl: HTMLFormElement,
    id: string | null
  ) {
    const read = readPayload(formEl);
    if ("error" in read && read.error) {
      setError(read.error);
      return;
    }
    if (!("payload" in read) || !read.payload) return;

    setSaving(true);
    setError(null);
    setSavedId(null);

    try {
      const res = await fetch(id ? `/api/appointments/${id}` : "/api/appointments", {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(read.payload),
      });
      const data = (await res.json()) as AppointmentRow & { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Salvataggio non riuscito.");
        return;
      }

      const normalized = normalizeRow(data);
      setItems((prev) =>
        id
          ? prev.map((row) => (row.id === id ? normalized : row))
          : [...prev, normalized]
      );
      setSavedId(normalized.id);
      setEditingId(null);
      if (!id) setCreateForm(emptyForm());
      router.refresh();
    } catch {
      setError("Errore di rete durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(id: string) {
    if (!confirm("Eliminare questo appuntamento?")) return;
    const res = await fetch(`/api/appointments/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      setError("Eliminazione non riuscita.");
      return;
    }
    setItems((prev) => prev.filter((row) => row.id !== id));
    if (editingId === id) setEditingId(null);
    setSavedId(null);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <ToriiFrame variant="myojin" contentClassName="panel-mirai p-4 sm:p-6">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void persist(e.currentTarget, null);
          }}
        >
          <p className="label-atelier">Nuovo appuntamento</p>
          <AppointmentFields
            values={createForm}
            onChange={(patch) => setCreateForm((prev) => ({ ...prev, ...patch }))}
          />
          {!editingId && error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving && !editingId ? "Salvataggio…" : "Aggiungi in calendario"}
          </button>
        </form>
      </ToriiFrame>

      <ToriiFrame
        variant="shinmei"
        contentClassName="panel-mirai overflow-x-auto p-0"
      >
        <div className="border-b border-line px-4 py-3">
          <p className="label-atelier">Appuntamenti</p>
          <p className="mt-2 text-sm text-muted">
            Per cambiare un appuntamento già inserito usa Modifica sulla sua riga.
          </p>
        </div>
        {sorted.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">
            Nessun appuntamento. Aggiungine uno sopra: comparirà sul calendario
            pubblico.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {sorted.map((row) => {
              const statusLabel =
                APPOINTMENT_STATUSES.find((s) => s.value === row.status)
                  ?.label ?? row.status;
              const editing = editingId === row.id;
              return (
                <li key={row.id} className="px-4 py-4">
                  {editing ? (
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        void persist(e.currentTarget, row.id);
                      }}
                    >
                      <p className="label-atelier">Modifica appuntamento</p>
                      <AppointmentFields
                        values={{
                          title: row.title ?? "",
                          guestName: row.guestName ?? "",
                          startsAt: toLocalInput(row.startsAt),
                          endsAt: validEndInput(row.startsAt, row.endsAt),
                          status: row.status || "PREVISTO",
                          notes: row.notes ?? "",
                        }}
                      />
                      {error ? (
                        <p className="text-sm text-red-700" role="alert">
                          {error}
                        </p>
                      ) : null}
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="submit"
                          className="btn-primary"
                          disabled={saving}
                        >
                          {saving ? "Salvataggio…" : "Salva modifiche"}
                        </button>
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => {
                            setEditingId(null);
                            setError(null);
                          }}
                        >
                          Annulla
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-medium text-ink">
                          {row.guestName || row.title || "Appuntamento"}
                        </p>
                        <p className="text-sm text-muted">
                          {format(new Date(row.startsAt), "EEE d MMM yyyy · HH:mm", {
                            locale: it,
                          })}
                          {row.title && row.guestName ? ` · ${row.title}` : ""}
                        </p>
                        <p className="mt-1 text-xs text-khaki-deep">{statusLabel}</p>
                        {savedId === row.id ? (
                          <p className="mt-1 text-sm text-khaki-deep">
                            Modifica salvata.
                          </p>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className={cn("btn-toggle btn-sm")}
                          onClick={() => {
                            setEditingId(row.id);
                            setError(null);
                            setSavedId(null);
                          }}
                        >
                          Modifica
                        </button>
                        <button
                          type="button"
                          className="btn-ghost btn-sm"
                          onClick={() => removeItem(row.id)}
                        >
                          Elimina
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </ToriiFrame>
    </div>
  );
}

function AppointmentFields({
  values,
  onChange,
}: {
  values: {
    title: string;
    guestName: string;
    startsAt: string;
    endsAt: string;
    status: string;
    notes: string;
  };
  onChange?: (patch: Partial<{
    title: string;
    guestName: string;
    startsAt: string;
    endsAt: string;
    status: string;
    notes: string;
  }>) => void;
}) {
  const controlled = Boolean(onChange);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="label-atelier mb-2 block">Ospite</label>
        <input
          name="guestName"
          className="field-atelier"
          value={controlled ? values.guestName : undefined}
          defaultValue={controlled ? undefined : values.guestName}
          onChange={
            onChange
              ? (e) => onChange({ guestName: e.target.value })
              : undefined
          }
          placeholder="Nome ospite"
        />
      </div>
      <div>
        <label className="label-atelier mb-2 block">Titolo / servizio</label>
        <input
          name="title"
          className="field-atelier"
          value={controlled ? values.title : undefined}
          defaultValue={controlled ? undefined : values.title}
          onChange={
            onChange ? (e) => onChange({ title: e.target.value }) : undefined
          }
          placeholder="Es. Piercing helix"
        />
      </div>
      <div>
        <label className="label-atelier mb-2 block">Inizio</label>
        <input
          name="startsAt"
          type="datetime-local"
          required
          className="field-atelier"
          value={controlled ? values.startsAt : undefined}
          defaultValue={controlled ? undefined : values.startsAt}
          onChange={
            onChange
              ? (e) => onChange({ startsAt: e.target.value })
              : undefined
          }
        />
      </div>
      <div>
        <label className="label-atelier mb-2 block">Fine (opzionale)</label>
        <input
          name="endsAt"
          type="datetime-local"
          className="field-atelier"
          value={controlled ? values.endsAt : undefined}
          defaultValue={controlled ? undefined : values.endsAt}
          onChange={
            onChange ? (e) => onChange({ endsAt: e.target.value }) : undefined
          }
        />
      </div>
      <div>
        <label className="label-atelier mb-2 block">Stato</label>
        <select
          name="status"
          className="field-atelier"
          value={controlled ? values.status : undefined}
          defaultValue={controlled ? undefined : values.status}
          onChange={
            onChange ? (e) => onChange({ status: e.target.value }) : undefined
          }
        >
          {APPOINTMENT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label-atelier mb-2 block">Note</label>
        <input
          name="notes"
          className="field-atelier"
          value={controlled ? values.notes : undefined}
          defaultValue={controlled ? undefined : values.notes}
          onChange={
            onChange ? (e) => onChange({ notes: e.target.value }) : undefined
          }
          placeholder="Interno atelier"
        />
      </div>
    </div>
  );
}
