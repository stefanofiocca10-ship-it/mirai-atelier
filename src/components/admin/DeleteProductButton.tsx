"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (!confirm("Eliminare questo prodotto?")) return;
    setLoading(true);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={loading}
      className="text-muted hover:text-ink disabled:opacity-50"
    >
      {loading ? "…" : "Elimina"}
    </button>
  );
}
