"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Instagram } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CONTACT, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/catalogo", label: "Catalogo" },
  { href: "/prenota", label: "Prenota" },
  { href: "/contatti", label: "Contatti" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled || open
          ? "border-b border-line/80 bg-paper/85 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-atelier items-center justify-between px-4 py-3 sm:px-6 md:px-8">
        <Link
          href="/"
          className="text-[11px] tracking-[0.28em] text-ink uppercase"
        >
          {SITE.shortName}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex xl:gap-9">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[11px] tracking-[0.22em] uppercase transition",
                pathname === link.href ? "text-ink" : "text-muted hover:text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={CONTACT.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition hover:text-ink"
            aria-label="Instagram Mirai"
          >
            <Instagram className="h-4 w-4" />
          </a>
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-line bg-paper/95 backdrop-blur-md lg:hidden"
          >
            <div className="flex max-h-[80dvh] flex-col gap-1 overflow-y-auto px-4 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-sm px-2 py-3 font-display text-2xl text-ink",
                    pathname === link.href && "text-khaki-deep"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={CONTACT.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 px-2 py-3 text-muted"
              >
                <Instagram className="h-4 w-4" />
                Instagram studio
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
