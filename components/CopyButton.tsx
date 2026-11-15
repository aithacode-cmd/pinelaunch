"use client";

import { useEffect, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { Button, type ButtonVariant } from "./Button";

interface Props {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  variant?: ButtonVariant;
}

export function CopyButton({ text, label = "Copy", copiedLabel = "Copied", className = "", variant = "quiet" }: Props) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const t = setTimeout(() => setStatus("idle"), 1800);
    return () => clearTimeout(t);
  }, [status]);

  return (
    <Button
      variant={variant}
      className={className}
      aria-live="polite"
      onClick={async () => setStatus((await copyText(text)) ? "copied" : "failed")}
    >
      {status === "copied" ? copiedLabel : status === "failed" ? "Select and copy by hand" : label}
    </Button>
  );
}
