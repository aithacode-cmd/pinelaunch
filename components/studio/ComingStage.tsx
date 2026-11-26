import { STAGES, type StageId } from "@/lib/studio/project";
import { Button } from "../Button";

type LaterStage = Exclude<StageId, "idea" | "plan" | "starter">;

const details: Record<LaterStage, { title: string; points: string[] }> = {
  workspace: {
    title: "Build it and watch it run.",
    points: [
      "Edit your code on one side and see your project run on the other.",
      "An AI mentor that knows your project gives hints when you are stuck. It does not write the project for you.",
      "Your work saves on this device as you type.",
    ],
  },
  finish: {
    title: "Test it and take it with you.",
    points: [
      "A short checklist to confirm the main feature works.",
      "Export a ZIP with your real files and a README.",
      "The files are yours and run on any computer.",
    ],
  },
};

interface Props {
  stage: LaterStage;
  /** The stage that has to be finished first, if it is not done yet. */
  blockedBy: StageId | null;
  onGoTo: (stage: StageId) => void;
}

/** What a later stage will be, shown until that stage is built or reached. */
export function ComingStage({ stage, blockedBy, onGoTo }: Props) {
  const d = details[stage];
  const name = STAGES.find((s) => s.id === stage)!.name;
  const blocker = blockedBy ? STAGES.find((s) => s.id === blockedBy)!.name : null;
  return (
    <div className="max-w-[640px]">
      <p className="font-body text-[13px] font-semibold text-accent">{name}</p>
      <h1 className="mt-2 font-display text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">{d.title}</h1>
      <ul className="mt-7 space-y-3.5 border-l border-line-2 pl-5">
        {d.points.map((p) => (
          <li key={p} className="font-body text-[15px] leading-[1.6] text-ink-2">
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-9 border-t border-line pt-6">
        {blocker ? (
          <>
            <p className="font-body text-[14px] leading-[1.6] text-ink-2">This opens after you finish {blocker}.</p>
            <Button variant="outline" className="mt-4" onClick={() => onGoTo(blockedBy!)}>
              Go to {blocker}
            </Button>
          </>
        ) : (
          <p className="font-body text-[14px] leading-[1.6] text-ink-2">
            You are ready for this stage. It is not open yet: it is still being built.
          </p>
        )}
      </div>
    </div>
  );
}
