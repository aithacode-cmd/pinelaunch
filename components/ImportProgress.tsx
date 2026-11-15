"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import type { UseProgress } from "@/lib/progress";
import { Button } from "./Button";
import { Mono } from "./Mono";

/** A small import box for students who already started on another device. */
export function ImportProgress({ progress }: { progress: UseProgress }) {
  const id = useId();
  const router = useRouter();
  const [text, setText] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <details className="mt-10 rounded-[14px] border border-line2 bg-panel p-5">
      <summary className="cursor-pointer list-none font-body text-[13.5px] text-txt2 marker:content-none [&::-webkit-details-marker]:hidden">
        Already started on another device? Import your progress code.
      </summary>
      <div className="mt-4">
        <label htmlFor={`${id}-code`} className="block">
          <Mono className="text-muted">Paste your export code</Mono>
        </label>
        <textarea
          id={`${id}-code`}
          rows={3}
          className="pl-textarea mt-2 font-mono text-[11.5px]"
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
          <Mono className="text-muted" aria-live="polite">
            {msg ?? "You get a code from the dashboard on the device where you started"}
          </Mono>
        </div>
      </div>
    </details>
  );
}
