"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/contact/FloatingContact";
import { MiraiAtmosphere } from "@/components/atmosphere/MiraiAtmosphere";
import { CatalogModelProvider } from "@/components/catalog/CatalogModelProvider";

export function RootChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CatalogModelProvider>
      <div className="relative min-h-screen">
        <MiraiAtmosphere />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <FloatingContact />
      </div>
    </CatalogModelProvider>
  );
}
