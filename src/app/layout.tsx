import type { Metadata, Viewport } from "next";
import "@fontsource/cinzel/latin-400.css";
import "@fontsource/cinzel/latin-500.css";
import "@fontsource/cinzel/latin-600.css";
import "@fontsource/cinzel/latin-700.css";
import "@fontsource/plus-jakarta-sans/latin-300.css";
import "@fontsource/plus-jakarta-sans/latin-400.css";
import "@fontsource/plus-jakarta-sans/latin-500.css";
import "@fontsource/plus-jakarta-sans/latin-600.css";
import "./globals.css";
import { RootChrome } from "@/components/layout/RootChrome";
import { SITE, CONTACT } from "@/lib/constants";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F4F1EB",
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE.name,
    template: `%s · ${SITE.shortName}`,
  },
  description: SITE.description,
  applicationName: SITE.shortName,
  keywords: [
    "piercing Domodossola",
    "tatuaggio Domodossola",
    "Mirai atelier",
    "gioielleria piercing",
    "body piercing",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    type: "website",
    locale: "it_IT",
    siteName: SITE.name,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
  alternates: {
    canonical: siteUrl,
  },
  other: {
    "instagram:profile": CONTACT.instagram.href,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="font-sans antialiased">
        <RootChrome>{children}</RootChrome>
      </body>
    </html>
  );
}
