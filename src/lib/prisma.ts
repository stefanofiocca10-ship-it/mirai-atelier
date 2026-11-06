import { PrismaClient } from "@prisma/client";
import { copyFileSync, existsSync, mkdirSync, statSync } from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  miraiDbReady: boolean | undefined;
};

/**
 * Su Vercel il filesystem è read-only tranne /tmp.
 * Copiamo un DB pre-seedato (prisma/deploy.db) in /tmp al primo boot.
 */
function ensureVercelSqlite() {
  if (process.env.VERCEL !== "1") return;
  if (globalForPrisma.miraiDbReady) return;

  const tmpDir = "/tmp";
  const tmpDb = path.join(tmpDir, "mirai.db");
  const bundled = path.join(process.cwd(), "prisma", "deploy.db");

  try {
    mkdirSync(tmpDir, { recursive: true });
    const needsCopy =
      !existsSync(tmpDb) ||
      (existsSync(bundled) &&
        existsSync(tmpDb) &&
        statSync(tmpDb).size < 1024);

    if (needsCopy && existsSync(bundled)) {
      copyFileSync(bundled, tmpDb);
    }
  } catch {
    // best-effort: Prisma userà comunque il path sotto
  }

  process.env.DATABASE_URL = `file:${tmpDb}`;
  globalForPrisma.miraiDbReady = true;
}

ensureVercelSqlite();

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
