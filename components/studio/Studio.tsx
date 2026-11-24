"use client";

import Link from "next/link";
import { useState } from "react";
import { STAGES, currentStage, displayTitle, isStageDone, stageStates, type StageId } from "@/lib/studio/project";
import { useProject } from "@/lib/studio/useProject";
import { Logo } from "../Brand";
import { ComingStage } from "./ComingStage";
import { IdeaStage } from "./IdeaStage";
import { SaveIndicator } from "./SaveIndicator";
import { SmallScreen } from "./SmallScreen";
import { StageRail } from "./StageRail";

/**
 * The studio: one screen, five stages. The rail on the left always shows
 * where the student is. The panel on the right holds the stage they are
 * looking at. The project loads from, and saves to, this browser only.
 */
export function Studio() {
  const { project, saveState, recovered, update } = useProject();
  // Null means "follow the project": show whichever stage is current.
  const [picked, setPicked] = useState<StageId | null>(null);

  return (
    <>
      <div className="lg:hidden">
        <SmallScreen />
      </div>

      <div className="hidden h-dvh flex-col lg:flex">
        <header className="flex h-14 shrink-0 items-center justify-between gap-6 border-b border-line bg-deep px-5">
          <div className="flex min-w-0 items-center gap-3.5">
            <Link href="/" aria-label="PineLaunch home" className="shrink-0 rounded-[6px]">
              <Logo markClassName="h-5 w-5" />
            </Link>
            <span aria-hidden="true" className="h-4 w-px bg-line3" />
            <span className="truncate font-body text-[13.5px] text-txt2">{project ? displayTitle(project) : "Studio"}</span>
          </div>
          <SaveIndicator state={saveState} />
        </header>

        {!project ? (
          <div className="flex flex-1 items-center px-14">
            <p className="font-body text-[14px] text-muted">Opening your project…</p>
          </div>
        ) : (
          <StudioBody
            key={project.id}
            states={stageStates(project)}
            selected={picked ?? currentStage(project)}
            onSelect={setPicked}
            recovered={recovered}
            saveFailed={saveState === "error"}
          >
            {(selected) =>
              selected === "idea" ? (
                <IdeaStage project={project} update={update} onConfirmed={() => setPicked(null)} />
              ) : (
                <ComingStage stage={selected} blockedBy={firstUnfinishedBefore(project, selected)} onGoTo={setPicked} />
              )
            }
          </StudioBody>
        )}
      </div>
    </>
  );
}

/** The earliest stage before `stage` that is not done, or null when the way is clear. */
function firstUnfinishedBefore(project: Parameters<typeof isStageDone>[0], stage: StageId): StageId | null {
  for (const s of STAGES) {
    if (s.id === stage) return null;
    if (!isStageDone(project, s.id)) return s.id;
  }
  return null;
}

function StudioBody({
  states,
  selected,
  onSelect,
  recovered,
  saveFailed,
  children,
}: {
  states: ReturnType<typeof stageStates>;
  selected: StageId;
  onSelect: (stage: StageId) => void;
  recovered: boolean;
  saveFailed: boolean;
  children: (selected: StageId) => React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1">
      <aside className="flex w-[288px] shrink-0 flex-col justify-between overflow-y-auto border-r border-line bg-deep px-4 py-6">
        <StageRail states={states} selected={selected} onSelect={onSelect} />
        <p className="mt-8 px-2 font-body text-[12.5px] leading-[1.6] text-muted">
          Your project is saved in this browser only. Clearing your browser data removes it.
        </p>
      </aside>

      <main id="main" className="min-w-0 flex-1 overflow-y-auto bg-bg">
        <div className="px-14 py-12">
          {recovered && (
            <p role="status" className="mb-8 max-w-[640px] rounded-[12px] border border-line2 bg-panel px-4 py-3 font-body text-[13.5px] leading-[1.6] text-txt2">
              A project saved in this browser could not be opened. It was left as it is, and a new project was started.
            </p>
          )}
          {saveFailed && (
            <p role="alert" className="mb-8 max-w-[640px] rounded-[12px] border border-line2 bg-panel px-4 py-3 font-body text-[13.5px] leading-[1.6] text-txt2">
              This browser is not letting PineLaunch save. Your work will be lost if you close this tab. A private window or
              strict privacy settings can cause this.
            </p>
          )}
          {/* Remount on stage change so each stage starts from its own first view. */}
          <div key={selected}>{children(selected)}</div>
        </div>
      </main>
    </div>
  );
}
