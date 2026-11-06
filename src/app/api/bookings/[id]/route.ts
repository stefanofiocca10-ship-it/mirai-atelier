import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { BOOKING_STATUSES } from "@/lib/constants";

const bookingStatusEnum = BOOKING_STATUSES.map((s) => s.value) as [
  (typeof BOOKING_STATUSES)[number]["value"],
  ...(typeof BOOKING_STATUSES)[number]["value"][],
];

const patchSchema = z.object({
  status: z.enum(bookingStatusEnum),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dati non validi", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json(booking);
  } catch {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }
}
