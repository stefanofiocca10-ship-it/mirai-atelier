"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  alt: string;
  priority?: boolean;
};

export function ProductImageGallery({ images, alt, priority }: Props) {
  const [index, setIndex] = useState(0);
  const list = images.length ? images : [];
  const current = list[index] ?? null;

  if (!current) {
    return (
      <div className="flex h-full items-center justify-center bg-paper-soft font-display text-7xl text-ink/15">
        未来
      </div>
    );
  }

  const hasMany = list.length > 1;

  function go(dir: -1 | 1) {
    setIndex((i) => (i + dir + list.length) % list.length);
  }

  return (
    <div className="relative h-full w-full">
      <Image
        key={current}
        src={current}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width:768px) 100vw, 50vw"
        priority={priority && index === 0}
      />

      {hasMany ? (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            className="btn-ghost absolute left-1.5 top-1/2 z-10 h-11 w-11 min-h-0 -translate-y-1/2 rounded-full p-0 sm:left-2 sm:h-10 sm:w-10"
            aria-label="Foto precedente"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="btn-ghost absolute right-1.5 top-1/2 z-10 h-11 w-11 min-h-0 -translate-y-1/2 rounded-full p-0 sm:right-2 sm:h-10 sm:w-10"
            aria-label="Foto successiva"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2">
            {list.map((src, i) => (
              <button
                key={src + i}
                type="button"
                aria-label={`Vai alla foto ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition sm:h-1.5 sm:w-1.5",
                  i === index ? "bg-ink" : "bg-paper/70"
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
