import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/api-auth";
import {
  DEFAULT_SCHEDULE,
  getStudioInfo,
  saveStudioInfo,
  type DaySchedule,
} from "@/lib/studio";

const slotSchema = z.object({
  open: z.string().min(4).max(5),
  close: z.string().min(4).max(5),
});

const daySchema = z.object({
  day: z.number().int().min(0).max(6),
  closed: z.boolean(),
  slots: z.array(slotSchema),
});

const bodySchema = z.object({
  address: z.string().min(3).max(240),
  mapsUrl: z.string().max(500).optional().default(""),
  schedule: z.array(daySchema).length(7),
});

export async function GET() {
  const info = await getStudioInfo();
  return NextResponse.json(info);
}

export async function PUT(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dati non validi", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const schedule = DEFAULT_SCHEDULE.map((fallback) => {
    const row = parsed.data.schedule.find((d) => d.day === fallback.day);
    return (row ?? fallback) as DaySchedule;
  });

  const info = await saveStudioInfo({
    address: parsed.data.address,
    mapsUrl: parsed.data.mapsUrl ?? "",
    schedule,
  });

  return NextResponse.json(info);
}
