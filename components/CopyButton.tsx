"use client";

import { useEffect, useState } from "react";
import { copyText } from "@/lib/clipboard";

interface Props {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({ text, label = "Copy", className = "btn-secondary" }: Props) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const t = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(t);
  }, [status]);

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        className={className}
        onClick={async () => setStatus((await copyText(text)) ? "copied" : "failed")}
      >
        {label}
      </button>
      <span role="status" aria-live="polite" className="text-sm text-ink-soft">
        {status === "copied" && "Copied"}
        {status === "failed" && "Could not copy. Select the text and copy it by hand."}
      </span>
    </span>
  );
}
