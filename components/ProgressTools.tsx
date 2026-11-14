"use client";

import { useId, useState } from "react";
import { Download, RotateCcw, Upload } from "lucide-react";
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
    <section className="panel p-6" aria-labelledby={`${id}-title`}>
      <p className="t-mono">Saved in this browser</p>
      <h2 id={`${id}-title`} className="t-heading mt-1 text-2xl">
        Move or reset your progress
      </h2>
      <p className="mt-2 max-w-[56ch] text-[15px] text-text-2">
        Your progress lives only in this browser. To use another device, create a code here and import it there.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[16px] border border-line bg-bg-deep/50 p-4">
          <h3 className="flex items-center gap-2 font-semibold">
            <Download size={16} aria-hidden="true" className="text-pine" />
            Export
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button type="button" className="btn-secondary" onClick={() => setCode(progress.getExportCode())}>
              Create export code
            </button>
            {code && <CopyButton text={code} label="Copy code" />}
          </div>
          {code && (
            <textarea
              readOnly
              aria-label="Your export code"
              className="input mt-3 h-24 font-mono text-xs"
              value={code}
              onFocus={(e) => e.currentTarget.select()}
            />
          )}
        </div>

        <div className="rounded-[16px] border border-line bg-bg-deep/50 p-4">
          <label htmlFor={`${id}-import`} className="flex items-center gap-2 font-semibold">
            <Upload size={16} aria-hidden="true" className="text-pine" />
            Import
          </label>
          <textarea
            id={`${id}-import`}
            className="input mt-3 h-24 font-mono text-xs"
            placeholder="Paste a code that starts with PL1."
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn-secondary"
              disabled={!importText.trim()}
              onClick={() => {
                const ok = progress.importFromCode(importText);
                setImportMsg(
                  ok
                    ? "Imported. This replaced the progress that was in this browser."
                    : "That code did not work. Check that you copied all of it.",
                );
                if (ok) setImportText("");
              }}
            >
              Import
            </button>
            <span role="status" aria-live="polite" className="text-sm text-text-3">
              {importMsg}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-line pt-5">
        <h3 className="flex items-center gap-2 font-semibold">
          <RotateCcw size={16} aria-hidden="true" className="text-danger" />
          Reset
        </h3>
        <p className="mt-1 text-sm text-text-3">Deletes your Project Card and every checked step from this browser.</p>
        {!confirmReset ? (
          <button type="button" className="btn-quiet mt-3 text-danger" onClick={() => setConfirmReset(true)}>
            Reset progress
          </button>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-[12px] border border-danger/40 bg-danger/10 p-3 text-sm">
            <span>Are you sure? This cannot be undone.</span>
            <button
              type="button"
              className="btn bg-danger text-bg-deep hover:opacity-90"
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
    </section>
  );
}
