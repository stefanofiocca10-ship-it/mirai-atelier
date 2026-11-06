"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BOOKING_STATUSES } from "@/lib/constants";

type BookingStatus = (typeof BOOKING_STATUSES)[number]["value"];
const allowed = new Set<string>(
  BOOKING_STATUSES.map((s) => s.value)
);

export async function updateBookingStatusAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Non autorizzato");
  }

  const id = formData.get("id");
  const status = formData.get("status");
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("ID non valido");
  }
  if (typeof status !== "string" || !allowed.has(status)) {
    throw new Error("Stato non valido");
  }

  await prisma.booking.update({
    where: { id },
    data: { status: status as BookingStatus },
  });
  revalidatePath("/admin/prenotazioni");
}
