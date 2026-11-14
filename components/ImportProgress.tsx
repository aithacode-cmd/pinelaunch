"use client";

import { useId, useState } from "react";
import type { UseProgress } from "@/lib/progress";

/** A small import box for students who already started on another device. */
export function ImportProgress({ progress, onImported }: { progress: UseProgress; onImported?: () => void }) {
  const id = useId();
  const [text, setText] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <details className="panel mt-8 p-5">
      <summary className="cursor-pointer text-sm font-semibold text-pine-hi">
        Already started on another device? Import your progress
      </summary>
      <div className="mt-4">
        <label htmlFor={`${id}-code`} className="label">
          Paste your export code
        </label>
        <textarea
          id={`${id}-code`}
          className="input h-24 font-mono text-xs"
          placeholder="Starts with PL1."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn-secondary"
            disabled={!text.trim()}
            onClick={() => {
              const ok = progress.importFromCode(text);
              setMsg(ok ? "Imported." : "That code did not work. Check that you copied all of it.");
              if (ok) {
                setText("");
                onImported?.();
              }
            }}
          >
            Import
          </button>
          <span role="status" aria-live="polite" className="text-sm text-text-3">
            {msg}
          </span>
        </div>
        <p className="mt-2 text-xs text-text-3">You get an export code from the dashboard on the device where you started.</p>
      </div>
    </details>
  );
}
