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
            className="flex w-[min(100vw-5rem,14rem)] flex-col gap-2"
          >
            <MotionAnchor
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full justify-start shadow-lift"
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-khaki-deep" />
              WhatsApp
            </MotionAnchor>
            <MotionAnchor
              href={CONTACT.phone.href}
              className="btn-ghost w-full justify-start shadow-lift"
            >
              <Phone className="h-4 w-4 shrink-0 text-khaki-deep" />
              Chiama
            </MotionAnchor>
            <MotionAnchor
              href={CONTACT.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full justify-start shadow-lift"
            >
              <Instagram className="h-4 w-4 shrink-0 text-khaki-deep" />
              Instagram
            </MotionAnchor>
            <MotionAnchor
              href={`mailto:${SITE.email}`}
              className="btn-ghost w-full justify-start shadow-lift"
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
        className="btn-primary h-14 w-14 min-h-0 rounded-full p-0 shadow-lift"
        aria-label={open ? "Chiudi contatti" : "Apri contatti e social"}
        aria-expanded={open}
      >
        {open ? (
          <X className="h-6 w-6" strokeWidth={2} />
        ) : (
          <Share2 className="h-6 w-6" strokeWidth={2} />
        )}
      </MotionButton>
    </div>
  );
}
