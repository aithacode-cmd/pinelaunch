"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import type { UseProgress } from "@/lib/progress";
import { ChevronDown } from "lucide-react";
import { Button } from "./Button";
import { Mono } from "./Mono";

/** A small import box for students who already started on another device. */
export function ImportProgress({ progress }: { progress: UseProgress }) {
  const id = useId();
  const router = useRouter();
  const [text, setText] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <details className="group mt-10 rounded-[16px] border border-line bg-surface">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-[16px] px-5 py-3 font-body text-[16px] text-ink-2 marker:content-none hover:text-ink [&::-webkit-details-marker]:hidden">
        Already started on another device? Import your progress code.
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 ease-out group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
      </summary>
      <div className="border-t border-line px-5 pb-5 pt-4">
        <label htmlFor={`${id}-code`} className="block">
          <Mono className="text-ink-3">Paste your export code</Mono>
        </label>
        <textarea
          id={`${id}-code`}
          rows={3}
          className="pl-textarea mt-2 font-mono text-[13px]"
          placeholder="Starts with PL1."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button
            variant="quiet"
            disabled={!text.trim()}
            onClick={() => {
              const ok = progress.importFromCode(text);
              setMsg(ok ? "Imported." : "That code did not work. Check that you copied all of it.");
              if (ok) {
                setText("");
                router.push("/dashboard");
              }
            }}
          >
            Import
          </Button>
          <Mono className="text-ink-3" aria-live="polite">
            {msg ?? "You get a code from the dashboard on the device where you started"}
          </Mono>
        </div>
      </div>
    </details>
  );
}
