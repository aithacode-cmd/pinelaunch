"use client";

import { useId, useState } from "react";
import { requestStarter, type AiFailure } from "@/lib/studio/aiClient";
import { IdeaInputSchema } from "@/lib/studio/plan";
import { FILE_NAMES, isStarterOutdated, type FileName, type Project, type ProjectFiles } from "@/lib/studio/project";
import { findTodos } from "@/lib/studio/starter";
import type { UseAccess } from "@/lib/studio/useAccess";
import type { SaveWhen } from "@/lib/studio/useProject";
import { Button } from "../Button";
import { AccessCodeForm } from "./AccessCodeForm";
import { CODE_PROBLEMS, Failure, ForgetCode, NeedCode } from "./AiParts";

interface Props {
  project: Project;
  update: (change: (prev: Project) => Project, when?: SaveWhen) => void;
  access: UseAccess;
  onGoToPlan: () => void;
  onGoToWorkspace: () => void;
  /**
   * Called just before new files are saved. Making the starter finishes this
   * stage, and the studio would otherwise move straight on to the next one
   * before the student has seen their files.
   */
  onMade: () => void;
}

const FILE_PURPOSE: Record<FileName, string> = {
  "index.html": "What is on the page",
  "styles.css": "How it looks",
  "script.js": "What it does",
};

/**
 * Stage 3. Writes three starting files for this student's plan, so nobody
 * begins with a blank page. One AI request. The files are checked before
 * they are saved, and existing files are never replaced without a clear yes.
 */
export function StarterStage({ project, update, access, onGoToPlan, onGoToWorkspace, onMade }: Props) {
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<AiFailure | null>(null);
  const [confirmingRedo, setConfirmingRedo] = useState(false);
  const [askingCode, setAskingCode] = useState(false);

  const idea = IdeaInputSchema.safeParse(project.idea);
  const planReady = Boolean(project.ideaConfirmedAt && idea.success && project.scope && project.milestones && project.planConfirmedAt);
  const files = project.files;

  /* ---------- nothing to show and nothing to make it from ---------- */
  if (!files && !planReady) {
    return (
      <div className="max-w-[640px]">
        <p className="font-body text-[13px] font-semibold text-accent">Starter</p>
        <h1 className="mt-2 font-display text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">Your plan comes first.</h1>
        <p className="mt-3 font-body text-[15px] leading-[1.6] text-ink-2">
          The starter is written from your plan and its milestones, so finish and confirm the plan before this stage.
        </p>
        <Button variant="outline" className="mt-6" onClick={onGoToPlan}>
          Go to Plan
        </Button>
      </div>
    );
  }

  if (!access.ready) {
    return <p className="font-body text-[14px] text-ink-3">Checking your access code…</p>;
  }
  // A code is needed to ask the AI for a starter, never to see files already saved on this device.
  const code = access.code;
  if (!code && (askingCode || !files)) {
    return (
      <AccessCodeForm
        stage="Starter"
        onEnter={access.enter}
        lapsed={access.lapsed}
        onBack={files ? () => setAskingCode(false) : undefined}
        backLabel="Back to my files"
      />
    );
  }

  async function makeStarter(replace: boolean) {
    if (!code || !idea.success || !project.scope || !project.milestones) return;
    const milestones = project.milestones;
    setFailure(null);
    setConfirmingRedo(false);
    setBusy(true);
    const result = await requestStarter(code, idea.data, project.scope, milestones);
    setBusy(false);
    if (!result.ok) {
      access.noteUsage(result.usage);
      setFailure(result);
      if (CODE_PROBLEMS.has(result.code)) access.expire();
      return;
    }
    access.noteUsage(result.usage);
    onMade();
    update(
      (p) =>
        // Files that already exist are replaced only when the student said so.
        p.files && !replace
          ? p
          : {
              ...p,
              files: result.files,
              starterSource: result.source,
              starterMadeAt: new Date().toISOString(),
              starterMilestones: milestones.map((m) => m.title),
            },
      "now",
    );
  }

  const left = access.usage ? access.usage.allowance - access.usage.used : null;
  const practice = access.source === "mock";

  /* ---------- working ---------- */
  if (busy) {
    return (
      <div className="max-w-[640px]" role="status" aria-live="polite">
        <p className="font-body text-[13px] font-semibold text-accent">Starter</p>
        <h1 className="mt-2 font-display text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">Writing your three files…</h1>
        <p className="mt-3 font-body text-[15px] leading-[1.6] text-ink-2">This can take a little while. Keep this tab open.</p>
      </div>
    );
  }

  /* ---------- no starter yet ---------- */
  if (!files) {
    return (
      <div className="max-w-[640px]">
        <p className="font-body text-[13px] font-semibold text-accent">Starter</p>
        <h1 className="mt-2 font-display text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">A beginning, not a blank page.</h1>
        <p className="mt-3 font-body text-[15px] leading-[1.6] text-ink-2">
          This step writes three files for your project: the page, its styles and its script. The page will open and look like
          the start of your project. It will not work yet. The notes inside point at your own milestones, and the building is
          yours.
        </p>

        <div className="mt-7 border-l border-line-2 pl-5">
          {practice ? (
            <p className="font-body text-[14px] leading-[1.6] text-ink-2">
              <span className="font-semibold text-ink">Practice mode. </span>
              No AI is connected yet. You will get one of three sample layouts with your project&apos;s title and milestone names
              filled in, so this stage can be tested. Nothing is sent to an AI company.
            </p>
          ) : (
            <p className="font-body text-[14px] leading-[1.6] text-ink-2">
              <span className="font-semibold text-ink">What gets sent. </span>
              Your five idea answers, your first-version plan and your milestone map go to an AI to write the files. Nothing else
              is sent, and PineLaunch does not keep a copy. The AI company keeps requests for a time under its own rules.
            </p>
          )}
        </div>

        <Failure failure={failure} />

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button onClick={() => void makeStarter(false)} disabled={!access.aiEnabled || left === 0}>
            Make my starter
          </Button>
          <span className="font-body text-[13px] text-ink-3">Uses 1 AI request.{left !== null && ` You have ${left} left.`}</span>
        </div>
        {!access.aiEnabled && <p className="mt-4 font-body text-[13.5px] text-ink-2">AI help is switched off right now. Try again later.</p>}
        <ForgetCode onForget={access.forget} />
      </div>
    );
  }

  /* ---------- the starter exists ---------- */
  const outdated = isStarterOutdated(project);
  const todos = findTodos(files);

  return (
    <div className="max-w-[860px]">
      <p className="font-body text-[13px] font-semibold text-accent">Starter</p>
      <h1 className="mt-2 font-display text-[40px] font-extrabold leading-[1.03] tracking-[-0.03em] text-ink">Your three files.</h1>
      <p className="mt-3 max-w-[640px] font-body text-[16px] leading-[1.6] text-ink-2">
        This is where your project begins. The page opens, but the main feature is not built: that part is yours. You will edit
        these files, and watch them run, in the Workspace.
      </p>

      {project.starterSource === "mock" && (
        <p className="mt-6 max-w-[640px] rounded-[12px] border border-line-2 bg-surface px-4 py-3 font-body text-[13.5px] leading-[1.6] text-ink-2">
          <span className="font-semibold text-ink">Practice starter. </span>
          No AI wrote this. It is one of three sample layouts, picked by simple word matching, with your project&apos;s title and
          milestone names filled in. A real starter will be written for your project once the AI is connected.
        </p>
      )}
      {outdated && (
        <p role="status" className="mt-6 max-w-[640px] rounded-[12px] border border-line-2 bg-surface px-4 py-3 font-body text-[13.5px] leading-[1.6] text-ink-2">
          <span className="font-semibold text-ink">Your milestone map changed after these files were made. </span>
          The notes in the code may point at old milestones. You can keep the files or make new ones.
        </p>
      )}
      {!planReady && (
        <p role="status" className="mt-6 max-w-[640px] rounded-[12px] border border-line-2 bg-surface px-4 py-3 font-body text-[13.5px] leading-[1.6] text-ink-2">
          <span className="font-semibold text-ink">Your plan is not confirmed right now. </span>
          Your files are still here. Confirm the plan before making new ones.
        </p>
      )}

      <FileViewer files={files} />

      {todos.length > 0 && (
        <section aria-labelledby="notes-heading" className="mt-10 max-w-[640px]">
          <h2 id="notes-heading" className="font-heading text-[22px] font-medium tracking-[-0.02em] text-ink">
            Where your milestones are
          </h2>
          <p className="mt-2 font-body text-[14px] leading-[1.6] text-ink-2">
            Each note in the code marks the place where one milestone&apos;s work happens.
          </p>
          <ul className="m-0 mt-4 list-none divide-y divide-line border-y border-line p-0">
            {todos.map((note, i) => (
              <li key={`${note.file}-${note.milestone}-${i}`} className="grid grid-cols-[112px_1fr_auto] items-baseline gap-4 py-3">
                <span className="font-body text-[13px] text-ink-3">Milestone {note.milestone}</span>
                <span className="font-body text-[14.5px] leading-[1.5] text-ink">{project.milestones?.[note.milestone - 1]?.title ?? note.text}</span>
                <span className="font-mono text-[12.5px] text-ink-2">{note.file}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-10 max-w-[640px] border-t border-line pt-7">
        <Failure failure={failure} />
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={onGoToWorkspace}>Go to Workspace</Button>
          {code && planReady && !confirmingRedo && (
            <Button variant="outline" onClick={() => setConfirmingRedo(true)} disabled={!access.aiEnabled || left === 0}>
              Make a new starter
            </Button>
          )}
        </div>
        {confirmingRedo && (
          <div className="mt-5 rounded-[12px] border border-line-2 bg-surface px-4 py-4">
            <p className="font-body text-[14px] leading-[1.6] text-ink-2">
              This replaces all three files with new ones. Anything you changed in them will be lost. It uses 1 AI request.
            </p>
            <div className="mt-3 flex gap-3">
              <Button className="h-10 px-4" onClick={() => void makeStarter(true)}>
                Replace my files
              </Button>
              <Button variant="ghost" className="h-10 px-4" onClick={() => setConfirmingRedo(false)}>
                Keep what I have
              </Button>
            </div>
          </div>
        )}
        {code ? (
          <ForgetCode
            onForget={() => {
              access.forget();
              setAskingCode(true);
            }}
          />
        ) : (
          <NeedCode lapsed={access.lapsed} kept="Your files are still here." onAsk={() => setAskingCode(true)} />
        )}
      </div>
    </div>
  );
}

/** The three files, one at a time, to read. Editing happens in the Workspace. */
function FileViewer({ files }: { files: ProjectFiles }) {
  const [open, setOpen] = useState<FileName>("index.html");
  const id = useId();
  const text = files[open];
  const lines = text.replace(/\n$/, "").split("\n").length;

  function onKey(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const index = FILE_NAMES.indexOf(open);
    const next = FILE_NAMES[(index + (event.key === "ArrowRight" ? 1 : FILE_NAMES.length - 1)) % FILE_NAMES.length];
    setOpen(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  }

  return (
    <section aria-label="Your starter files" className="mt-9 overflow-hidden rounded-[22px] border border-line-2 bg-surface-2">
      <div role="tablist" aria-label="Files" className="flex border-b border-line-2">
        {FILE_NAMES.map((name) => {
          const selected = name === open;
          return (
            <button
              key={name}
              id={`${id}-tab-${name}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setOpen(name)}
              onKeyDown={onKey}
              className={`border-r border-line-2 px-5 py-3 text-left ${selected ? "bg-surface" : "bg-surface-2 hover:bg-surface"}`}
            >
              <span className={`block font-mono text-[13px] ${selected ? "text-ink" : "text-ink-2"}`}>{name}</span>
              <span className="mt-0.5 block font-body text-[12px] text-ink-3">{FILE_PURPOSE[name]}</span>
            </button>
          );
        })}
        <span className="ml-auto self-center px-5 font-body text-[12.5px] text-ink-3">
          {lines} {lines === 1 ? "line" : "lines"}
        </span>
      </div>
      <pre
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${open}`}
        tabIndex={0}
        className="m-0 max-h-[460px] overflow-auto px-5 py-4 font-mono text-[12.5px] leading-[1.7] text-ink"
      >
        <code>{text}</code>
      </pre>
    </section>
  );
}
