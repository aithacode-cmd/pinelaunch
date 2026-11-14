"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
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
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        className={className}
        onClick={async () => setStatus((await copyText(text)) ? "copied" : "failed")}
      >
        {status === "copied" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        {status === "copied" ? "Copied" : label}
      </button>
      <span role="status" aria-live="polite" className="text-sm text-text-3">
        {status === "copied" && <span className="sr-only">Copied</span>}
        {status === "failed" && "Could not copy. Select the text and copy it by hand."}
      </span>
    </span>
  );
}
