import { Check } from "lucide-react";
import { STAGES, type StageId, type StageState } from "@/lib/studio/project";

interface Props {
  states: Record<StageId, StageState>;
  /** The stage shown in the main panel. */
  selected: StageId;
  onSelect: (stage: StageId) => void;
}

/**
 * The five stages, top to bottom, joined by one line. It always answers three
 * questions: where am I, what is done, what comes next.
 */
export function StageRail({ states, selected, onSelect }: Props) {
  return (
    <nav aria-label="Stages">
      <ol className="m-0 list-none p-0">
        {STAGES.map((s, i) => {
          const state = states[s.id];
          const isSelected = s.id === selected;
          const last = i === STAGES.length - 1;
          return (
            <li key={s.id} className="relative">
              {!last && (
                <span
                  aria-hidden="true"
                  className={"absolute left-[23px] top-[46px] h-[calc(100%-32px)] w-px " + (state === "done" ? "bg-accent/60" : "bg-line-2")}
                />
              )}
              <button
                type="button"
                onClick={() => onSelect(s.id)}
                aria-current={isSelected ? "step" : undefined}
                className={
                  "group flex w-full items-start gap-3.5 rounded-[12px] px-2 py-3 text-left transition-colors " +
                  (isSelected ? "bg-white/[0.045]" : "hover:bg-white/[0.025]")
                }
              >
                <span
                  aria-hidden="true"
                  className={
                    "relative z-10 mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border font-heading text-[13px] font-medium " +
                    (state === "done"
                      ? "border-accent bg-accent text-on-accent"
                      : state === "current"
                        ? "border-accent bg-surface text-accent"
                        : "border-line-3 bg-surface text-ink-3")
                  }
                >
                  {state === "done" ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className={"block font-heading text-[15px] font-medium leading-tight tracking-[-0.01em] " + (state === "upcoming" && !isSelected ? "text-ink-2" : "text-ink")}>
                    {s.name}
                    <span className="sr-only">{state === "done" ? ", done" : state === "current" ? ", current stage" : ", not started"}</span>
                  </span>
                  <span className="mt-1 block font-body text-[12.5px] leading-[1.45] text-ink-3">{s.line}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
