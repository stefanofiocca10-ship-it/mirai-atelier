import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const bookings = await prisma.booking.findMany({
    orderBy: [{ createdAt: "desc" }],
  });

  return NextResponse.json(bookings);
}

/** Form pubblico rimosso: le richieste passano da WhatsApp / telefono / Instagram. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Le prenotazioni dal sito non sono più attive. Contattaci su WhatsApp, telefono o Instagram.",
    },
    { status: 410 }
  );
}
