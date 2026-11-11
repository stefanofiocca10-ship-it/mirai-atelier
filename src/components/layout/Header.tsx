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
  { href: "/calendario", label: "Calendario" },
  { href: "/galleria", label: "Galleria" },
  { href: "/faq", label: "FAQ" },
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
          ? "border-b border-line/60 bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent bg-paper/70 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex max-w-atelier items-center justify-between px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 md:px-8">
        <Link
          href="/"
          className="text-[11px] tracking-[0.28em] text-ink uppercase"
        >
          {SITE.shortName}
        </Link>

        <nav className="hidden items-center gap-5 xl:flex xl:gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[11px] tracking-[0.18em] uppercase transition xl:tracking-[0.22em]",
                pathname === link.href
                  ? "text-ink"
                  : "text-ink-soft hover:text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={CONTACT.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-soft transition hover:text-ink"
            aria-label="Instagram Mirai"
          >
            <Instagram className="h-4 w-4" />
          </a>
        </nav>

        <motion.button
          type="button"
          className="flex h-11 w-11 items-center justify-center text-ink xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          aria-expanded={open}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.06 }}
          transition={{ type: "spring", stiffness: 420, damping: 24 }}
        >
          {open ? <X /> : <Menu />}
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-line/60 bg-paper/95 backdrop-blur-md xl:hidden"
          >
            <div className="flex max-h-[min(80dvh,calc(100svh-4.5rem))] flex-col gap-0.5 overflow-y-auto overscroll-contain px-4 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "min-h-11 rounded-sm px-2 py-2.5 font-display text-xl text-ink sm:text-2xl",
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
                className="mt-2 inline-flex min-h-11 items-center gap-2 px-2 py-2.5 text-muted"
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
