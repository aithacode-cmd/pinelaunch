"use client";

import { ArrowUp } from "lucide-react";

export function TopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-txt"
    >
      Top
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.1] transition-colors group-hover:border-white/25">
        <ArrowUp className="h-3 w-3" aria-hidden="true" />
      </span>
    </button>
  );
}
