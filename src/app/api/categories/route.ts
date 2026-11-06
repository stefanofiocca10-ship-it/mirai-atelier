import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: [{ group: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(categories);
}
