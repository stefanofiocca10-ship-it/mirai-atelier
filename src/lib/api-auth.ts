import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function requireAdminSession(): Promise<
  | { ok: true; session: NonNullable<Awaited<ReturnType<typeof getServerSession>>> }
  | { ok: false; response: NextResponse }
> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Non autorizzato" }, { status: 401 }),
    };
  }
  return { ok: true, session };
}
