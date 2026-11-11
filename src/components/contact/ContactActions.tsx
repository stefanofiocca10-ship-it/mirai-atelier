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

  const fullOnMobile =
    variant === "hero" || variant === "stack"
      ? "w-full justify-center sm:w-auto"
      : "";

  return (
    <div className={cn(layout, className)}>
      <MotionAnchor
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("btn-ghost", fullOnMobile)}
      >
        <MessageCircle className="h-4 w-4 shrink-0 text-khaki-deep" />
        {showLabels && "WhatsApp"}
      </MotionAnchor>
      <MotionAnchor
        href={CONTACT.phone.href}
        className={cn("btn-ghost", fullOnMobile)}
      >
        <Phone className="h-4 w-4 shrink-0 text-khaki-deep" />
        {showLabels && (
          <span className="truncate">{CONTACT.phone.display}</span>
        )}
      </MotionAnchor>
      <MotionAnchor
        href={CONTACT.instagram.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("btn-ghost", fullOnMobile)}
      >
        <Instagram className="h-4 w-4 shrink-0 text-khaki-deep" />
        {showLabels && "Instagram"}
      </MotionAnchor>
    </div>
  );
}
