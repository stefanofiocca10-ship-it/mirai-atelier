import type { Metadata, Viewport } from "next";
import { Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { RootChrome } from "@/components/layout/RootChrome";
import { SITE, CONTACT } from "@/lib/constants";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F4F1EB",
};

const display = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: SITE.name,
    template: `%s · ${SITE.shortName}`,
  },
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    type: "website",
    locale: "it_IT",
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
    <html lang="it" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <RootChrome>{children}</RootChrome>
      </body>
    </html>
  );
}
