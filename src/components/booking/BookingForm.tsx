"use client";

import { FormEvent, useState } from "react";
import { SERVICE_TYPES, whatsappUrl } from "@/lib/constants";

export function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      serviceType: String(form.get("serviceType") || ""),
      preferredAt: String(form.get("preferredAt") || "") || null,
      message: String(form.get("message") || "") || null,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Invio non riuscito");
      }
      setDone(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="border border-line bg-paper-soft p-8 text-center">
        <p className="font-display text-2xl text-ink">Richiesta inviata</p>
        <p className="mt-3 text-muted">
          Ti ricontatteremo al più presto. Per urgenze puoi scriverci su WhatsApp.
        </p>
        <a
          href={whatsappUrl(
            "Ciao! Ho appena inviato una richiesta di consulenza dal sito."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex bg-[#25D366] px-5 py-3 text-sm text-white"
        >
          Apri WhatsApp
        </a>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-4 block w-full text-sm text-muted hover:text-ink"
        >
          Invia un&apos;altra richiesta
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="surface space-y-5 border border-line/80 p-5 sm:p-6 md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-2 block text-muted">Nome</span>
          <input name="name" required className="field-atelier" />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-muted">Email</span>
          <input name="email" type="email" required className="field-atelier" />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-muted">Telefono</span>
          <input name="phone" required className="field-atelier" />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-muted">Servizio</span>
          <select
            name="serviceType"
            required
            className="field-atelier"
            defaultValue=""
          >
            <option value="" disabled>
              Seleziona…
            </option>
            {SERVICE_TYPES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-2 block text-muted">Data preferita (opzionale)</span>
        <input name="preferredAt" type="datetime-local" className="field-atelier" />
      </label>

      <label className="block text-sm">
        <span className="mb-2 block text-muted">Messaggio</span>
        <textarea name="message" rows={4} className="field-atelier" />
      </label>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? "Invio…" : "Invia richiesta"}
      </button>
    </form>
  );
}
