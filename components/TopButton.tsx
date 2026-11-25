"use client";

import { ArrowUp } from "lucide-react";

export function TopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="pl-press group inline-flex min-h-11 items-center gap-2 rounded-[8px] px-2 font-body text-[14px] text-ink-3 transition-colors hover:text-ink"
    >
      Back to top
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-line transition-colors group-hover:border-line-3">
        <ArrowUp className="h-3 w-3" aria-hidden="true" />
      </span>
    </button>
  );
}
