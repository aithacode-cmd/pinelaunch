import { STAGES, type StageId } from "@/lib/studio/project";
import { Button } from "../Button";

const details: Record<Exclude<StageId, "idea">, { title: string; points: string[] }> = {
  plan: {
    title: "A first version you can finish.",
    points: [
      "PineLaunch reads your idea and shrinks it to something you can build in about four weeks.",
      "You see what was kept, what was moved to later, and why.",
      "Then you get a milestone map made for your project, which you can change.",
    ],
  },
  starter: {
    title: "A starting point made for your project.",
    points: [
      "Three files written for your plan: a page, its styles and its script.",
      "They give you a real beginning. They are not a finished app.",
      "Notes in the code point to your own milestones.",
    ],
  },
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
  stage: Exclude<StageId, "idea">;
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
      <p className="font-body text-[13px] font-semibold text-pine-hi">{name}</p>
      <h1 className="mt-2 font-display text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] text-txt">{d.title}</h1>
      <ul className="mt-7 space-y-3.5 border-l border-line2 pl-5">
        {d.points.map((p) => (
          <li key={p} className="font-body text-[15px] leading-[1.6] text-txt2">
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-9 border-t border-line pt-6">
        {blocker ? (
          <>
            <p className="font-body text-[14px] leading-[1.6] text-txt2">This opens after you finish {blocker}.</p>
            <Button variant="outline" className="mt-4" onClick={() => onGoTo(blockedBy!)}>
              Go to {blocker}
            </Button>
          </>
        ) : (
          <p className="font-body text-[14px] leading-[1.6] text-txt2">
            You are ready for this stage. It is not open yet: it is still being built.
          </p>
        )}
      </div>
    </div>
  );
}
