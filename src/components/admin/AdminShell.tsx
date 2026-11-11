"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inventario", label: "Inventario" },
  { href: "/admin/prodotti", label: "Prodotti" },
  { href: "/admin/calendario", label: "Calendario" },
  { href: "/admin/galleria", label: "Galleria" },
  { href: "/admin/studio", label: "Studio" },
  { href: "/admin/categorie", label: "Categorie" },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-ink">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Logo size="nav" href="/admin" />
            <div className="min-w-0">
              <p className="label-atelier">Admin</p>
              <p className="truncate text-sm text-muted">Pannello atelier</p>
            </div>
          </div>
          <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:overflow-visible [&::-webkit-scrollbar]:hidden">
            {nav.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "btn-toggle btn-sm shrink-0",
                    active && "is-active"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="btn-ghost btn-sm shrink-0"
            >
              Esci
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-3 py-6 sm:px-4 sm:py-8">{children}</main>
    </div>
  );
}
