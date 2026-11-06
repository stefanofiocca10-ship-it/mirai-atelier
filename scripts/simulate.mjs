#!/usr/bin/env node
/**
 * Simulazione offline locale di Mirai Atelier.
 * - prepara SQLite + seed
 * - avvia Next.js in modalità production (build) o development
 *
 * Uso:
 *   node scripts/simulate.mjs          → build + start (più vicino al server)
 *   node scripts/simulate.mjs --dev    → next dev (hot reload)
 *   npm run simulate
 *   npm run simulate:dev
 */

import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const isDev = process.argv.includes("--dev");
const skipBuild = process.argv.includes("--skip-build");
const port = process.env.PORT || "3000";

function run(command, args, opts = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, ...opts.env },
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function ensureEnv() {
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) {
    console.log("→ Creo .env da .env.example");
    run("node", [
      "-e",
      "require('fs').copyFileSync('.env.example','.env')",
    ]);
  }
}

function ensureUploads() {
  const uploads = join(root, "public", "uploads");
  if (!existsSync(uploads)) {
    mkdirSync(uploads, { recursive: true });
    console.log("→ Cartella public/uploads creata");
  }
}

console.log("");
console.log("╔══════════════════════════════════════════╗");
console.log("║   MIRAI ATELIER — simulazione offline    ║");
console.log("╚══════════════════════════════════════════╝");
console.log("");
console.log(`Modalità: ${isDev ? "development (hot reload)" : "production locale"}`);
console.log(`URL:      http://localhost:${port}`);
console.log(`Admin:    http://localhost:${port}/admin/login`);
console.log("");

ensureEnv();
ensureUploads();

console.log("→ Prisma generate");
run("npx", ["prisma", "generate"]);

console.log("→ Database SQLite (db push)");
run("npx", ["prisma", "db", "push"]);

console.log("→ Seed dati dimostrativi");
run("npx", ["tsx", "prisma/seed.ts"]);

if (isDev) {
  console.log("→ Avvio next dev (Ctrl+C per uscire)");
  console.log("");
  const child = spawn("npx", ["next", "dev", "-p", port], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
  child.on("exit", (code) => process.exit(code ?? 0));
} else {
  if (!skipBuild) {
    console.log("→ Build production");
    run("npx", ["next", "build"]);
  }
  console.log("→ Avvio next start (Ctrl+C per uscire)");
  console.log("");
  const child = spawn("npx", ["next", "start", "-p", port], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
  child.on("exit", (code) => process.exit(code ?? 0));
}
