import type { Metadata } from "next";
import { FontPreview } from "@/components/dev/FontPreview";

export const metadata: Metadata = {
  title: "Anteprima Font",
  robots: { index: false, follow: false },
};

export default function FontPreviewPage() {
  return <FontPreview />;
}
