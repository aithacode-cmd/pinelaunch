"use client";

import { useState } from "react";
import type { AiFailure } from "@/lib/studio/aiClient";
import { Button } from "../Button";

interface Props {
  onEnter: (typed: string) => Promise<AiFailure | null>;
  /** True when the code saved on this device stopped working. */
  lapsed?: boolean;
  /** Shown as a way out when the student already has work to go back to. */
  onBack?: () => void;
  /** The stage this form is shown in. */
  stage?: string;
  /** The words on the way-out button. */
  backLabel?: string;
}

/**
 * Asks for the access code the first time AI help is needed. The code is
 * permission to use the AI, not an account: it has no name attached.
 */
export function AccessCodeForm({ onEnter, lapsed, onBack, stage = "Plan", backLabel = "Back to my plan" }: Props) {
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className="max-w-[560px]"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        if (typed.trim().length < 8) {
          setError("Type the whole code. It looks like PL-XXXX-XXXX-XXXX-XXXX.");
          return;
        }
        setBusy(true);
        setError("");
        const failure = await onEnter(typed);
        setBusy(false);
        if (failure) setError(failure.message);
      }}
    >
      <p className="font-body text-[13px] font-semibold text-accent">{stage}</p>
      <h1 className="mt-2 font-display text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
        <label htmlFor="access-code">Enter your access code.</label>
      </h1>
      <p id="access-code-hint" className="mt-3 font-body text-[15px] leading-[1.6] text-ink-2">
        The adult running your beta gave it to you. It unlocks your AI requests. It is not an account, and it has no name
        attached.
      </p>
      {lapsed && (
        <p role="status" className="mt-5 rounded-[12px] border border-line-2 bg-surface px-4 py-3 font-body text-[14px] leading-[1.6] text-ink">
          The code saved on this device no longer works. Ask the adult running your beta for a new one. Your project is still
          saved here.
        </p>
      )}
      <input
        id="access-code"
        autoFocus
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        value={typed}
        onChange={(e) => {
          setTyped(e.target.value);
          setError("");
        }}
        placeholder="PL-XXXX-XXXX-XXXX-XXXX"
        aria-describedby={error ? "access-code-error" : "access-code-hint"}
        aria-invalid={!!error || undefined}
        className="pl-input mt-6 !h-12 !rounded-[12px] font-mono !text-[15px] tracking-[0.06em]"
      />
      {error && (
        <p id="access-code-error" role="alert" className="mt-3 font-body text-[13.5px] text-danger">
          {error}
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Checking…" : "Continue"}
        </Button>
        {onBack && (
          <Button type="button" variant="ghost" onClick={onBack}>
            {backLabel}
          </Button>
        )}
      </div>
      <p className="mt-6 font-body text-[13px] leading-[1.6] text-ink-3">
        The code is saved on this device so you only type it once. Do not share it: anyone who has it can use your requests.
      </p>
    </form>
  );
}
