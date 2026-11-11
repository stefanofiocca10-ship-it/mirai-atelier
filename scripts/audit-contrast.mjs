import { chromium } from "playwright";
import { mkdirSync } from "fs";
import path from "path";

const OUT = path.join(process.cwd(), "tmp", "contrast-audit");
mkdirSync(OUT, { recursive: true });

const pages = ["/", "/catalogo", "/chi-siamo", "/contatti", "/prenota"];
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch({ headless: true });

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  for (const route of pages) {
    const url = `http://localhost:3000${route}`;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      await page.waitForTimeout(800);
      const safe = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
      const file = path.join(OUT, `${vp.name}-${safe}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log("ok", file);
    } catch (e) {
      console.error("fail", route, vp.name, e.message);
    }
  }

  // Catalog piercing flow: open face step
  try {
    await page.goto("http://localhost:3000/catalogo", {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    await page.waitForTimeout(500);
    const piercing = page.getByRole("button", { name: /Piercing/i }).first();
    if (await piercing.count()) {
      await piercing.click();
      await page.waitForTimeout(900);
      const safeFace = path.join(OUT, `${vp.name}-catalogo-piercing-face.png`);
      await page.screenshot({ path: safeFace, fullPage: true });
      console.log("ok", safeFace);
    }
  } catch (e) {
    console.error("fail piercing flow", vp.name, e.message);
  }

  await context.close();
}

await browser.close();
console.log("done", OUT);
