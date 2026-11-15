"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li";
  id?: string;
}

/**
 * Fades and lifts content once when it scrolls into view. Pure CSS classes
 * (see .pl-reveal in globals.css), so under reduced motion nothing moves and
 * without JavaScript the content is simply visible after the first paint.
 */
export function Reveal({ children, className = "", as: Tag = "div", id }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("pl-reveal-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("pl-reveal-in");
            io.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag id={id} ref={ref as never} className={`pl-reveal ${className}`}>
      {children}
    </Tag>
  );
}
