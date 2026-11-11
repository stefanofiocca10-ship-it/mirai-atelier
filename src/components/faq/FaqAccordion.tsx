"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ToriiFrame } from "@/components/brand/ToriiFrame";
import type { FAQ_SECTIONS } from "@/lib/faq-piercing";
import { cn } from "@/lib/utils";

type Section = (typeof FAQ_SECTIONS)[number];

export function FaqAccordion({ sections }: { sections: Section[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <ToriiFrame
      variant="shinmei"
      className="mt-6 sm:mt-8"
      contentClassName="p-0 overflow-hidden"
    >
      <div className="divide-y divide-line">
        {sections.map((section) => (
          <div key={section.id}>
            <div className="bg-paper-soft/70 px-4 py-3 sm:px-5">
              <p className="label-atelier">{section.title}</p>
            </div>
            <div className="divide-y divide-line">
              {section.items.map((item) => {
                const open = openId === item.id;
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggle(item.id)}
                      aria-expanded={open}
                      className="flex w-full min-h-12 items-start gap-3 px-4 py-3.5 text-left sm:px-5 sm:py-4"
                    >
                      <span className="min-w-0 flex-1 font-display text-base leading-snug text-ink sm:text-lg">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={cn(
                          "mt-0.5 h-5 w-5 shrink-0 text-khaki-deep transition-transform duration-300",
                          open && "rotate-180"
                        )}
                        aria-hidden
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {open ? (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.28,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-3 px-4 pb-4 text-sm leading-relaxed text-muted sm:px-5 sm:pb-5 sm:text-base">
                            {item.answer.map((p) => (
                              <p key={p.slice(0, 32)}>{p}</p>
                            ))}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ToriiFrame>
  );
}
