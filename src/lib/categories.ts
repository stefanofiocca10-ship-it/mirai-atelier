import type { Category } from "@prisma/client";
import type { CatalogKind } from "@/lib/constants";

export type CategoryNode = Category & { children?: CategoryNode[] };

export function isAssignableCategory(c: Pick<Category, "kind" | "parentId">) {
  // Jewelry: zone = leaf. Piercing: solo i sottotipi (hanno parent).
  return c.kind === "JEWELRY" || Boolean(c.parentId);
}

export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const byParent = new Map<string | null, Category[]>();
  for (const c of categories) {
    const key = c.parentId ?? null;
    const list = byParent.get(key) ?? [];
    list.push(c);
    byParent.set(key, list);
  }
  for (const list of Array.from(byParent.values())) {
    list.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  }

  function nest(parentId: string | null): CategoryNode[] {
    return (byParent.get(parentId) ?? []).map((c) => ({
      ...c,
      children: nest(c.id),
    }));
  }

  return nest(null);
}

export function groupAssignableByZone(categories: Category[]) {
  const assignable = categories.filter(isAssignableCategory);
  const map = new Map<string, Category[]>();
  for (const c of assignable) {
    const key = `${c.kind}:${c.zone}`;
    const list = map.get(key) ?? [];
    list.push(c);
    map.set(key, list);
  }
  for (const list of Array.from(map.values())) {
    list.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  }
  return map;
}

export function filterByKind(categories: Category[], kind: CatalogKind) {
  return categories.filter((c) => c.kind === kind);
}

export function primaryCategoryLabel(
  categories: { name: string; zone: string }[]
) {
  if (!categories.length) return "Senza categoria";
  if (categories.length === 1) return categories[0].name;
  return `${categories[0].name} +${categories.length - 1}`;
}
