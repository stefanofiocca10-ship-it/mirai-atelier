import { PrismaClient } from "@prisma/client";
import { existsSync, copyFileSync, mkdirSync } from "fs";
import path from "path";

/**
 * Su Vercel il filesystem è effimero: usiamo /tmp per SQLite in preview.
 * In locale resta prisma/dev.db via DATABASE_URL.
 */
function ensureVercelSqlite() {
  if (process.env.VERCEL !== "1") return;

  const tmpDir = "/tmp";
  const tmpDb = path.join(tmpDir, "mirai.db");
  const bundled = path.join(process.cwd(), "prisma", "seed.db");

  try {
    if (!existsSync(tmpDb)) {
      mkdirSync(tmpDir, { recursive: true });
      if (existsSync(bundled)) {
        copyFileSync(bundled, tmpDb);
      }
    }
    process.env.DATABASE_URL = `file:${tmpDb}`;
  } catch {
    process.env.DATABASE_URL = `file:${tmpDb}`;
  }
}

ensureVercelSqlite();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
