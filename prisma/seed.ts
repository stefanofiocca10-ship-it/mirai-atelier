import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CATEGORY_GROUPS } from "../src/lib/constants";
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
      name: "Amministratore",
      role: "ADMIN",
    },
  });

  let sortCursor = 0;

  for (const grp of CATEGORY_GROUPS) {
    for (const name of grp.items) {
      const slug = slugify(name);
      await prisma.category.upsert({
        where: { slug },
        update: { name, group: grp.id, sortOrder: sortCursor },
        create: {
          name,
          slug,
          group: grp.id,
          sortOrder: sortCursor,
        },
      });
      sortCursor += 1;
    }
  }

  // Catalogo intenzionalmente vuoto: i prodotti si caricano dall'admin
  await prisma.product.deleteMany();

  console.log(
    "Seed completato: admin + categorie. Catalogo prodotti vuoto (gestito da admin)."
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
