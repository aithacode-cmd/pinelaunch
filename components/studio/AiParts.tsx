import type { AiFailure } from "@/lib/studio/aiClient";

/** Error names that mean the access code itself stopped working. */
export const CODE_PROBLEMS: ReadonlySet<string> = new Set(["code_missing", "code_invalid", "code_inactive"]);

/** The plain message that came back when an AI request did not work. */
export function Failure({ failure }: { failure: AiFailure | null }) {
  if (!failure) return null;
  return (
    <p role="alert" className="mb-5 mt-6 rounded-[12px] border border-line-2 bg-surface px-4 py-3 font-body text-[14px] leading-[1.6] text-ink">
      {failure.message}
    </p>
  );
}

export function ForgetCode({ onForget }: { onForget: () => void }) {
  return (
    <p className="mt-8 font-body text-[13px] text-ink-3">
      Using a different access code?{" "}
      <button type="button" onClick={onForget} className="rounded-[4px] text-ink-2 underline decoration-line-3 underline-offset-4 hover:text-ink">
        Enter another one
      </button>
    </p>
  );
}

/**
 * Shown in place of the AI buttons when no working code is saved. What the
 * student already made stays readable: a code is only needed to ask the AI
 * for something new.
 */
export function NeedCode({ lapsed, kept, onAsk }: { lapsed: boolean; kept: string; onAsk: () => void }) {
  return (
    <p className="mt-6 font-body text-[13.5px] leading-[1.6] text-ink-2">
      {lapsed ? "The access code saved on this device no longer works. " : "No access code is saved on this device. "}
      {kept} To ask the AI for anything new,{" "}
      <button type="button" onClick={onAsk} className="rounded-[4px] text-ink underline decoration-line-3 underline-offset-4 hover:text-accent">
        enter an access code
      </button>
      .
    </p>
  );
}
