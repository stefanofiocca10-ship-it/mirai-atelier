"use client";

import { useRouter } from "next/navigation";
import { BOOKING_STATUSES } from "@/lib/constants";

export function BookingStatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();

  return (
    <select
      defaultValue={status}
      className="border border-line bg-paper px-3 py-2 text-sm text-ink"
      onChange={async (e) => {
        await fetch(`/api/bookings/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: e.target.value }),
        });
        router.refresh();
      }}
    >
      {BOOKING_STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
