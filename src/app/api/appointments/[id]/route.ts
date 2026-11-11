import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { APPOINTMENT_STATUSES } from "@/lib/constants";

const statusEnum = APPOINTMENT_STATUSES.map((s) => s.value) as [
  (typeof APPOINTMENT_STATUSES)[number]["value"],
  ...(typeof APPOINTMENT_STATUSES)[number]["value"][],
];

const updateSchema = z.object({
  title: z.string().nullable().optional(),
  guestName: z.string().nullable().optional(),
  startsAt: z.string().min(1).optional(),
  endsAt: z.union([z.string(), z.null()]).optional(),
  status: z.enum(statusEnum).optional(),
  notes: z.string().nullable().optional(),
});

type RouteContext = { params: { id: string } | Promise<{ id: string }> };

async function resolveId(params: RouteContext["params"]) {
  return (await params).id;
}

function revalidateCalendar() {
  revalidatePath("/calendario");
  revalidatePath("/");
  revalidatePath("/admin/calendario");
  revalidatePath("/admin");
}

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const id = await resolveId(context.params);
  if (!id) {
    return NextResponse.json({ error: "ID mancante" }, { status: 400 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dati non validi", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }

  const data = parsed.data;
  const patch: {
    title?: string | null;
    guestName?: string | null;
    startsAt?: Date;
    endsAt?: Date | null;
    status?: string;
    notes?: string | null;
  } = {};

  if (data.title !== undefined) patch.title = data.title?.trim() || null;
  if (data.guestName !== undefined) {
    patch.guestName = data.guestName?.trim() || null;
  }
  if (data.status !== undefined) patch.status = data.status;
  if (data.notes !== undefined) patch.notes = data.notes?.trim() || null;

  if (data.startsAt !== undefined) {
    const startsAt = new Date(data.startsAt);
    if (Number.isNaN(startsAt.getTime())) {
      return NextResponse.json({ error: "Data/ora non valida" }, { status: 400 });
    }
    patch.startsAt = startsAt;
  }

  if (data.endsAt !== undefined) {
    if (data.endsAt === null || data.endsAt === "") {
      patch.endsAt = null;
    } else {
      const endsAt = new Date(data.endsAt);
      if (Number.isNaN(endsAt.getTime())) {
        return NextResponse.json({ error: "Fine non valida" }, { status: 400 });
      }
      const start = patch.startsAt ?? existing.startsAt;
      if (endsAt <= start) {
        return NextResponse.json(
          { error: "La fine deve essere dopo l'inizio." },
          { status: 400 }
        );
      }
      patch.endsAt = endsAt;
    }
  }

  try {
    const updated = await prisma.appointment.update({
      where: { id },
      data: patch,
    });
    revalidateCalendar();
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[appointments PUT]", err);
    return NextResponse.json(
      { error: "Aggiornamento non riuscito" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const id = await resolveId(context.params);
  if (!id) {
    return NextResponse.json({ error: "ID mancante" }, { status: 400 });
  }

  try {
    await prisma.appointment.delete({ where: { id } });
    revalidateCalendar();
  } catch {
    return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
