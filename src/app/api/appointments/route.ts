import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { APPOINTMENT_STATUSES } from "@/lib/constants";

function revalidateCalendar() {
  revalidatePath("/calendario");
  revalidatePath("/");
  revalidatePath("/admin/calendario");
  revalidatePath("/admin");
}

const statusEnum = APPOINTMENT_STATUSES.map((s) => s.value) as [
  (typeof APPOINTMENT_STATUSES)[number]["value"],
  ...(typeof APPOINTMENT_STATUSES)[number]["value"][],
];

const createSchema = z.object({
  title: z.string().nullable().optional(),
  guestName: z.string().nullable().optional(),
  startsAt: z.string().min(1),
  endsAt: z.union([z.string(), z.null()]).optional(),
  status: z.enum(statusEnum).optional(),
  notes: z.string().nullable().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const includeCancelled = searchParams.get("all") === "1";

  const auth = await requireAdminSession();
  // Pubblico: solo non annullati in intervallo. Admin con ?all=1 vede tutto.
  if (!auth.ok && includeCancelled) {
    return auth.response;
  }

  const where: {
    startsAt?: { gte?: Date; lte?: Date };
    status?: { not: string };
  } = {};

  if (from || to) {
    where.startsAt = {};
    if (from) where.startsAt.gte = new Date(from);
    if (to) where.startsAt.lte = new Date(to);
  }

  if (!includeCancelled) {
    where.status = { not: "ANNULLATO" };
  }

  const appointments = await prisma.appointment.findMany({
    where,
    orderBy: { startsAt: "asc" },
    take: 200,
  });

  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dati non validi", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const startsAt = new Date(data.startsAt);
  if (Number.isNaN(startsAt.getTime())) {
    return NextResponse.json({ error: "Data/ora non valida" }, { status: 400 });
  }

  let endsAt: Date | null = null;
  if (data.endsAt) {
    endsAt = new Date(data.endsAt);
    if (Number.isNaN(endsAt.getTime())) {
      return NextResponse.json({ error: "Fine non valida" }, { status: 400 });
    }
  }

  const created = await prisma.appointment.create({
    data: {
      title: data.title?.trim() || null,
      guestName: data.guestName?.trim() || null,
      startsAt,
      endsAt,
      status: data.status ?? "PREVISTO",
      notes: data.notes?.trim() || null,
    },
  });

  revalidateCalendar();
  return NextResponse.json(created, { status: 201 });
}
