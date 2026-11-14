"use client";

import { useId, useState } from "react";
import type { UseProgress } from "@/lib/progress";
import { CopyButton } from "./CopyButton";

/** Export, import and reset. All local. Nothing is sent anywhere. */
export function ProgressTools({ progress }: { progress: UseProgress }) {
  const id = useId();
  const [code, setCode] = useState<string | null>(null);
  const [importText, setImportText] = useState("");
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <section className="card" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="text-lg font-semibold">
        Move or reset your progress
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Your progress is saved only in this browser. To use another device, export a code here and import it
        there.
      </p>

      <div className="mt-4 space-y-5">
        <div>
          <h3 className="text-sm font-medium">Export progress</h3>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button type="button" className="btn-secondary" onClick={() => setCode(progress.getExportCode())}>
              Create export code
            </button>
            {code && <CopyButton text={code} label="Copy code" />}
          </div>
          {code && (
            <textarea
              readOnly
              aria-label="Your export code"
              className="input mt-2 h-24 font-mono text-xs"
              value={code}
              onFocus={(e) => e.currentTarget.select()}
            />
          )}
        </div>

        <div>
          <label htmlFor={`${id}-import`} className="text-sm font-medium">
            Import progress
          </label>
          <textarea
            id={`${id}-import`}
            className="input mt-2 h-24 font-mono text-xs"
            placeholder="Paste a code that starts with PL1."
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn-secondary"
              disabled={!importText.trim()}
              onClick={() => {
                const ok = progress.importFromCode(importText);
                setImportMsg(ok ? "Imported. This replaced the progress that was in this browser." : "That code did not work. Check that you copied all of it.");
                if (ok) setImportText("");
              }}
            >
              Import
            </button>
            <span role="status" aria-live="polite" className="text-sm text-ink-soft">
              {importMsg}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium">Reset progress</h3>
          <p className="mt-1 text-sm text-ink-soft">Deletes your Project Card and every checked step from this browser.</p>
          {!confirmReset ? (
            <button type="button" className="btn-quiet mt-2 text-red-800 hover:bg-red-50" onClick={() => setConfirmReset(true)}>
              Reset progress
            </button>
          ) : (
            <div className="mt-2 flex flex-wrap items-center gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm">
              <span>Are you sure? This cannot be undone.</span>
              <button
                type="button"
                className="btn bg-red-800 text-white hover:bg-red-900"
                onClick={() => {
                  progress.reset();
                  setConfirmReset(false);
                  setCode(null);
                }}
              >
                Yes, reset everything
              </button>
              <button type="button" className="btn-secondary" onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
