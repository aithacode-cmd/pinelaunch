"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Render as a different element. */
  as?: "div" | "section" | "li";
}

/** Fades and lifts content slightly when it scrolls into view. Static under reduced motion. */
export function Reveal({ children, className = "", delay = 0, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const M = as === "section" ? motion.section : as === "li" ? motion.li : motion.div;
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </M>
  );
}
