import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  size?: "nav" | "md" | "hero";
  href?: string | null;
  className?: string;
  priority?: boolean;
};

const sizes = {
  nav: { width: 96, height: 96, className: "h-11 w-11 md:h-12 md:w-12" },
  md: { width: 180, height: 180, className: "h-20 w-20 md:h-24 md:w-24" },
  hero: {
    width: 640,
    height: 640,
    className: "h-52 w-52 sm:h-64 sm:w-64 md:h-80 md:w-80",
  },
} as const;

export function Logo({
  size = "nav",
  href = "/",
  className,
  priority = false,
}: Props) {
  const s = sizes[size];
  const image = (
    <Image
      src="/images/logo-mirai.png"
      alt="Mirai Tattoo Piercing Atelier"
      width={s.width}
      height={s.height}
      priority={priority}
      className={cn(
        "object-contain drop-shadow-[0_8px_24px_rgba(17,17,17,0.08)]",
        s.className,
        className
      )}
    />
  );

  if (href === null) return image;

  return (
    <Link href={href} className="inline-flex shrink-0" aria-label="Mirai — Home">
      {image}
    </Link>
  );
}
