"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/prodotti", label: "Prodotti" },
  { href: "/admin/prenotazioni", label: "Prenotazioni" },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-paper-soft">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Logo size="nav" href="/admin" />
            <div>
              <p className="label-atelier">Admin</p>
              <p className="text-sm text-muted">Pannello atelier</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
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
                    "px-3 py-2 text-sm transition",
                    active
                      ? "bg-ink text-paper"
                      : "text-muted hover:bg-paper-warm hover:text-ink"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="border border-line px-3 py-2 text-sm text-muted hover:text-ink"
            >
              Esci
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
