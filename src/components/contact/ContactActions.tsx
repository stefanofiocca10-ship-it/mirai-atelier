"use client";

import { Instagram, MessageCircle, Phone } from "lucide-react";
import { CONTACT, whatsappUrl } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MotionAnchor } from "@/components/ui/MotionPressable";

type Variant = "inline" | "stack" | "hero" | "compact";

export function ContactActions({
  variant = "inline",
  className,
  showLabels = true,
}: {
  variant?: Variant;
  className?: string;
  showLabels?: boolean;
}) {
  const layout =
    variant === "stack"
      ? "flex flex-col gap-2"
      : variant === "hero"
        ? "flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center"
        : "flex flex-wrap items-center gap-2";

  return (
    <div className={cn(layout, className)}>
      <MotionAnchor
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border border-[#25D366]/35 bg-[#25D366]/10 px-4 py-2.5 text-sm text-ink transition hover:bg-[#25D366]/20"
      >
        <MessageCircle className="h-4 w-4 text-[#25D366]" />
        {showLabels && "WhatsApp"}
      </MotionAnchor>
      <MotionAnchor
        href={CONTACT.phone.href}
        className="inline-flex items-center gap-2 border border-line px-4 py-2.5 text-sm text-ink transition hover:border-khaki"
      >
        <Phone className="h-4 w-4 text-khaki-deep" />
        {showLabels && CONTACT.phone.display}
      </MotionAnchor>
      <MotionAnchor
        href={CONTACT.instagram.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border border-khaki/50 bg-khaki/10 px-4 py-2.5 text-sm text-ink transition hover:bg-khaki/20"
      >
        <Instagram className="h-4 w-4" />
        {showLabels && "Instagram"}
      </MotionAnchor>
    </div>
  );
}
