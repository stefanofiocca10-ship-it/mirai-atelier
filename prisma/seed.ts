import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CATALOG_TREE } from "../src/lib/constants";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email?.trim() || !password) {
    throw new Error(
      "Definisci ADMIN_EMAIL e ADMIN_PASSWORD nell'ambiente prima di eseguire il seed."
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email: email.toLowerCase().trim() },
    update: { passwordHash },
    create: {
      email: email.toLowerCase().trim(),
      passwordHash,
      name: "Margot",
      role: "ADMIN",
    },
  });

  // Reset albero categorie (prodotti restano; i link si ricollegano se gli slug coincidono)
  await prisma.productCategory.deleteMany();
  await prisma.category.deleteMany();

  let sortCursor = 0;

  for (const [kind, zones] of Object.entries(CATALOG_TREE) as [
    "PIERCING" | "JEWELRY",
    (typeof CATALOG_TREE)["PIERCING"] | (typeof CATALOG_TREE)["JEWELRY"],
  ][]) {
    for (const zoneDef of zones) {
      const items = zoneDef.items as readonly string[];

      // Jewelry: zona = leaf assegnabile (slug = zone id, es. collane)
      if (kind === "JEWELRY" || items.length === 0) {
        await prisma.category.create({
          data: {
            name: zoneDef.label,
            slug: slugify(zoneDef.zone),
            kind,
            zone: zoneDef.zone,
            parentId: null,
            sortOrder: sortCursor++,
          },
        });
        continue;
      }

      // Piercing: nodo zona (non assegnabile) + leaf sottotipi
      const zoneCat = await prisma.category.create({
        data: {
          name: zoneDef.label,
          slug: `zona-${slugify(zoneDef.zone)}`,
          kind,
          zone: zoneDef.zone,
          parentId: null,
          sortOrder: sortCursor++,
        },
      });

      for (const name of items) {
        let leafSlug = slugify(name);
        // evita collisione con slug già usati
        const clash = await prisma.category.findUnique({
          where: { slug: leafSlug },
        });
        if (clash) leafSlug = `${slugify(zoneDef.zone)}-${leafSlug}`;

        await prisma.category.create({
          data: {
            name,
            slug: leafSlug,
            kind,
            zone: zoneDef.zone,
            parentId: zoneCat.id,
            sortOrder: sortCursor++,
          },
        });
      }
    }
  }

  // Catalogo prodotti vuoto: Margot lo costruisce dall'admin
  await prisma.product.deleteMany();

  const leafCount = await prisma.category.count({
    where: {
      OR: [{ kind: "JEWELRY" }, { parentId: { not: null } }],
    },
  });

  console.log(
    `Seed completato: admin + ${leafCount} categorie assegnabili. Catalogo prodotti vuoto.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
