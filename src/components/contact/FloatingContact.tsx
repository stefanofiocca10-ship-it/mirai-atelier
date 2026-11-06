"use client";

import { useState } from "react";
import { Instagram, Mail, MessageCircle, Phone, Share2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CONTACT, SITE, whatsappUrl } from "@/lib/constants";
import { MotionAnchor, MotionButton } from "@/components/ui/MotionPressable";

export function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[60] flex flex-col items-end gap-2 md:bottom-8 md:right-8">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="flex flex-col gap-2"
          >
            <MotionAnchor
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-3 border border-line bg-white px-4 py-3 text-sm text-ink shadow-lg"
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-[#25D366]" />
              WhatsApp
            </MotionAnchor>
            <MotionAnchor
              href={CONTACT.phone.href}
              className="inline-flex min-h-11 items-center gap-3 border border-line bg-white px-4 py-3 text-sm text-ink shadow-lg"
            >
              <Phone className="h-4 w-4 shrink-0 text-khaki-deep" />
              Chiama
            </MotionAnchor>
            <MotionAnchor
              href={CONTACT.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-3 border border-line bg-white px-4 py-3 text-sm text-ink shadow-lg"
            >
              <Instagram className="h-4 w-4 shrink-0" />
              Instagram
            </MotionAnchor>
            <MotionAnchor
              href={`mailto:${SITE.email}`}
              className="inline-flex min-h-11 items-center gap-3 border border-line bg-white px-4 py-3 text-sm text-ink shadow-lg"
            >
              <Mail className="h-4 w-4 shrink-0 text-khaki-deep" />
              Email
            </MotionAnchor>
          </motion.div>
        )}
      </AnimatePresence>

      <MotionButton
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-lg ring-2 ring-khaki/50 transition hover:bg-ink-soft hover:ring-khaki"
        aria-label={open ? "Chiudi contatti" : "Apri contatti e social"}
        aria-expanded={open}
      >
        {open ? (
          <X className="h-6 w-6 text-white" strokeWidth={2} />
        ) : (
          <Share2 className="h-6 w-6 text-white" strokeWidth={2} />
        )}
      </MotionButton>
    </div>
  );
}
