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
      className="btn-ghost btn-sm"
    >
      {loading ? "…" : "Elimina"}
    </button>
  );
}
