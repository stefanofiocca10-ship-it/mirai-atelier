import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { SERVICE_TYPES } from "@/lib/constants";

const serviceTypeEnum = SERVICE_TYPES.map((s) => s.value) as [
  (typeof SERVICE_TYPES)[number]["value"],
  ...(typeof SERVICE_TYPES)[number]["value"][],
];

const createBookingSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(3),
  serviceType: z.enum(serviceTypeEnum),
  preferredAt: z.string().datetime().nullable().optional(),
  message: z.string().nullable().optional(),
});

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const bookings = await prisma.booking.findMany({
    orderBy: [{ createdAt: "desc" }],
  });

  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = createBookingSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dati non validi", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const preferredAt =
    data.preferredAt === undefined || data.preferredAt === null
      ? null
      : new Date(data.preferredAt);

  const booking = await prisma.booking.create({
    data: {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      serviceType: data.serviceType,
      preferredAt,
      message: data.message?.trim() ?? null,
    },
  });

  return NextResponse.json(booking, { status: 201 });
}
