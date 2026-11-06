"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 420, damping: 24 };

function usePressMotion() {
  const reduce = useReducedMotion();
  if (reduce) {
    return {
      whileHover: undefined,
      whileTap: undefined,
      transition: { duration: 0 },
    };
  }
  return {
    whileHover: { scale: 1.03, y: -1 },
    whileTap: { scale: 0.97 },
    transition: spring,
  };
}

type MotionButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
  className?: string;
};

export function MotionButton({
  children,
  className,
  type = "button",
  ...props
}: MotionButtonProps) {
  const press = usePressMotion();
  return (
    <motion.button
      type={type}
      className={cn(className)}
      whileHover={press.whileHover}
      whileTap={press.whileTap}
      transition={press.transition}
      {...props}
    >
      {children}
    </motion.button>
  );
}

type MotionLinkProps = Omit<ComponentProps<typeof Link>, "legacyBehavior"> & {
  children: ReactNode;
  className?: string;
};

export function MotionLink({ children, className, ...props }: MotionLinkProps) {
  const press = usePressMotion();
  const full = typeof className === "string" && className.includes("w-full");
  return (
    <motion.span
      className={cn("inline-flex", full && "w-full")}
      whileHover={press.whileHover}
      whileTap={press.whileTap}
      transition={press.transition}
    >
      <Link className={cn(className)} {...props}>
        {children}
      </Link>
    </motion.span>
  );
}

type MotionAnchorProps = HTMLMotionProps<"a"> & {
  children: ReactNode;
  className?: string;
};

export function MotionAnchor({
  children,
  className,
  ...props
}: MotionAnchorProps) {
  const press = usePressMotion();
  return (
    <motion.a
      className={cn(className)}
      whileHover={press.whileHover}
      whileTap={press.whileTap}
      transition={press.transition}
      {...props}
    >
      {children}
    </motion.a>
  );
}
