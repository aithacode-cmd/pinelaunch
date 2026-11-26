"use client";

import { useState } from "react";
import { requestMilestones, requestScope, type AiFailure } from "@/lib/studio/aiClient";
import { IdeaInputSchema, totalHours, type Milestone, type ScopePlan } from "@/lib/studio/plan";
import { isPlanOutdated, type Project } from "@/lib/studio/project";
import type { UseAccess } from "@/lib/studio/useAccess";
import type { SaveWhen } from "@/lib/studio/useProject";
import { Button } from "../Button";
import { AccessCodeForm } from "./AccessCodeForm";
import { CODE_PROBLEMS, Failure, ForgetCode, NeedCode } from "./AiParts";
import { MilestoneList } from "./MilestoneList";

interface Props {
  project: Project;
  update: (change: (prev: Project) => Project, when?: SaveWhen) => void;
  access: UseAccess;
  /** Called when the student accepts the plan, or asks to move on. */
  onConfirmed: () => void;
  onGoToIdea: () => void;
}

type Busy = null | "scope" | "milestones";

/**
 * Stage 2. Shrinks the idea to a four-week first version and builds a
 * milestone map for it. Each of the two steps uses one AI request. Nothing is
 * written to the project until an answer has been checked.
 */
export function PlanStage({ project, update, access, onConfirmed, onGoToIdea }: Props) {
  const [busy, setBusy] = useState<Busy>(null);
  const [failure, setFailure] = useState<AiFailure | null>(null);
  const [confirmingRedo, setConfirmingRedo] = useState(false);
  const [askingCode, setAskingCode] = useState(false);

  const idea = IdeaInputSchema.safeParse(project.idea);

  if (!project.ideaConfirmedAt || !idea.success) {
    return (
      <div className="max-w-[640px]">
        <p className="font-body text-[13px] font-semibold text-accent">Plan</p>
        <h1 className="mt-2 font-display text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">Your idea comes first.</h1>
        <p className="mt-3 font-body text-[15px] leading-[1.6] text-ink-2">The plan is made from your idea, so finish and confirm that before this stage.</p>
        <Button variant="outline" className="mt-6" onClick={onGoToIdea}>
          Go to Idea
        </Button>
      </div>
    );
  }

  if (!access.ready) {
    return <p className="font-body text-[14px] text-ink-3">Checking your access code…</p>;
  }
  // A code is needed to ask the AI for something, never to see a plan that is
  // already saved on this device.
  const code = access.code;
  if (!code && (askingCode || !project.scope)) {
    return <AccessCodeForm onEnter={access.enter} lapsed={access.lapsed} onBack={project.scope ? () => setAskingCode(false) : undefined} />;
  }
  const ideaInput = idea.data;

  function noteFailure(f: AiFailure) {
    access.noteUsage(f.usage);
    setFailure(f);
    // A code that stopped working is forgotten, so the form comes back.
    if (CODE_PROBLEMS.has(f.code)) access.expire();
  }

  async function buildMilestones(scope: ScopePlan) {
    if (!code) return;
    setBusy("milestones");
    const result = await requestMilestones(code, ideaInput, scope);
    setBusy(null);
    if (!result.ok) return noteFailure(result);
    access.noteUsage(result.usage);
    update((p) => ({ ...p, milestones: result.milestones, currentMilestone: 0, planSource: result.source, planConfirmedAt: null }), "now");
  }

  async function makePlan() {
    if (!code) return;
    setFailure(null);
    setConfirmingRedo(false);
    setBusy("scope");
    const result = await requestScope(code, ideaInput);
    if (!result.ok) {
      setBusy(null);
      return noteFailure(result);
    }
    access.noteUsage(result.usage);
    const madeAt = new Date().toISOString();
    update(
      (p) => ({
        ...p,
        title: result.scope.projectTitle,
        scope: result.scope,
        milestones: null,
        currentMilestone: 0,
        planSource: result.source,
        planMadeAt: madeAt,
        planIdea: { ...p.idea },
        planConfirmedAt: null,
      }),
      "now",
    );
    await buildMilestones(result.scope);
  }

  async function redoMilestones() {
    if (!project.scope) return;
    setFailure(null);
    setConfirmingRedo(false);
    await buildMilestones(project.scope);
  }

  const left = access.usage ? access.usage.allowance - access.usage.used : null;
  const practice = access.source === "mock";

  /* ---------- working ---------- */
  if (busy) {
    return (
      <div className="max-w-[640px]" role="status" aria-live="polite">
        <p className="font-body text-[13px] font-semibold text-accent">Plan</p>
        <h1 className="mt-2 font-display text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
          {busy === "scope" ? "Shrinking your idea to a first version…" : "Building your milestone map…"}
        </h1>
        <p className="mt-3 font-body text-[15px] leading-[1.6] text-ink-2">This can take a little while. Keep this tab open.</p>
      </div>
    );
  }

  /* ---------- no plan yet ---------- */
  if (!project.scope) {
    return (
      <div className="max-w-[640px]">
        <p className="font-body text-[13px] font-semibold text-accent">Plan</p>
        <h1 className="mt-2 font-display text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">A first version you can finish.</h1>
        <p className="mt-3 font-body text-[15px] leading-[1.6] text-ink-2">
          Most first ideas are too big for four weeks. This step keeps the heart of your idea, moves the rest to a later list,
          and tells you why. Then it lays out four weeks of milestones.
        </p>

        <div className="mt-7 border-l border-line-2 pl-5">
          {practice ? (
            <p className="font-body text-[14px] leading-[1.6] text-ink-2">
              <span className="font-semibold text-ink">Practice mode. </span>
              No AI is connected yet. You will get a sample plan built around your own words, so this stage can be tested. Nothing
              is sent to an AI company.
            </p>
          ) : (
            <p className="font-body text-[14px] leading-[1.6] text-ink-2">
              <span className="font-semibold text-ink">What gets sent. </span>
              Your five idea answers go to an AI to write the plan. Nothing else is sent, and PineLaunch does not keep a copy.
              The AI company keeps requests for a time under its own rules. If any answer has something personal in it, go back
              and take it out first.
            </p>
          )}
        </div>

        <Failure failure={failure} />

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button onClick={makePlan} disabled={!access.aiEnabled || left === 0 || left === 1}>
            Make my plan
          </Button>
          <span className="font-body text-[13px] text-ink-3">
            Uses 2 AI requests.{left !== null && ` You have ${left} left.`}
          </span>
        </div>
        {!access.aiEnabled && <p className="mt-4 font-body text-[13.5px] text-ink-2">AI help is switched off right now. Try again later.</p>}
        <ForgetCode onForget={access.forget} />
      </div>
    );
  }

  /* ---------- a plan exists ---------- */
  const scope = project.scope;
  const outdated = isPlanOutdated(project);

  return (
    <div className="max-w-[760px]">
      <p className="font-body text-[13px] font-semibold text-accent">Plan</p>
      <h1 className="mt-2 font-display text-[40px] font-extrabold leading-[1.03] tracking-[-0.03em] text-ink">{scope.projectTitle}</h1>
      <p className="mt-3 font-body text-[16px] leading-[1.6] text-ink-2">{scope.projectGoal}</p>

      {project.planSource === "mock" && (
        <p className="mt-6 rounded-[12px] border border-line-2 bg-surface px-4 py-3 font-body text-[13.5px] leading-[1.6] text-ink-2">
          <span className="font-semibold text-ink">Practice plan. </span>
          No AI wrote this. It is sample text built around your own words, so the plan stage can be tested. A real plan will be
          written for your idea once the AI is connected.
        </p>
      )}
      {outdated && (
        <p role="status" className="mt-6 rounded-[12px] border border-line-2 bg-surface px-4 py-3 font-body text-[13.5px] leading-[1.6] text-ink-2">
          <span className="font-semibold text-ink">Your idea changed after this plan was made. </span>
          The plan below may not fit it any more. You can keep it or make a new one.
        </p>
      )}

      <section aria-labelledby="scope-heading" className="mt-9">
        <h2 id="scope-heading" className="font-heading text-[22px] font-medium tracking-[-0.02em] text-ink">
          Your first version
        </h2>
        <p className="mt-3 font-body text-[15px] leading-[1.65] text-ink-2">{scope.fourWeekScope}</p>

        <div className="mt-6 border-l-2 border-accent pl-4">
          <p className="font-body text-[12.5px] text-ink-3">The one thing it must do</p>
          <p className="mt-1 font-heading text-[19px] font-medium leading-snug tracking-[-0.01em] text-ink">{scope.coreFeature}</p>
        </div>

        <dl className="mt-7 grid gap-x-10 gap-y-7 sm:grid-cols-2">
          {scope.secondaryFeatures.length > 0 && <ScopeList term="Also in this version" items={scope.secondaryFeatures} />}
          <ScopeList term="You are finished when" items={scope.completionCriteria} />
          <ScopeList term="How you will test it" items={scope.testingCriteria} />
          {scope.futureIdeas.length > 0 && <ScopeList term="Ideas kept for later" items={scope.futureIdeas} />}
        </dl>

        {scope.excludedFeatures.length > 0 && (
          <div className="mt-7">
            <p className="font-body text-[12.5px] text-ink-3">Moved out of this version, and why</p>
            <ul className="m-0 mt-2 list-none divide-y divide-line border-y border-line p-0">
              {scope.excludedFeatures.map((x) => (
                <li key={x.feature} className="py-3">
                  <p className="font-body text-[14.5px] font-semibold text-ink">{x.feature}</p>
                  <p className="mt-0.5 font-body text-[14px] leading-[1.55] text-ink-2">{x.reason}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section aria-labelledby="map-heading" className="mt-12">
        <h2 id="map-heading" className="font-heading text-[22px] font-medium tracking-[-0.02em] text-ink">
          Your milestone map
        </h2>
        {project.milestones ? (
          <>
            <p className="mt-2 font-body text-[14px] text-ink-2">
              {project.milestones.length} milestones, about {totalHours(project.milestones)} hours over four weeks. Edit any of them to
              make the plan yours.
            </p>
            <MilestoneList
              milestones={project.milestones}
              onChange={(next: Milestone[]) => update((p) => ({ ...p, milestones: next }), "now")}
            />
          </>
        ) : (
          <>
            <p className="mt-2 font-body text-[14px] leading-[1.6] text-ink-2">Your first version is set. The milestone map has not been built yet.</p>
            <Failure failure={failure} />
            {code ? (
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Button onClick={() => void redoMilestones()} disabled={!access.aiEnabled || left === 0}>
                  Build my milestone map
                </Button>
                <span className="font-body text-[13px] text-ink-3">Uses 1 AI request.{left !== null && ` You have ${left} left.`}</span>
              </div>
            ) : (
              <NeedCode lapsed={access.lapsed} kept="Your plan is still here." onAsk={() => setAskingCode(true)} />
            )}
          </>
        )}
      </section>

      {project.milestones && (
        <div className="mt-10 border-t border-line pt-7">
          <Failure failure={failure} />
          <div className="flex flex-wrap items-center gap-3">
            {project.planConfirmedAt ? (
              <Button onClick={onConfirmed}>Go to Starter</Button>
            ) : (
              <Button
                onClick={() => {
                  update((p) => ({ ...p, planConfirmedAt: new Date().toISOString() }), "now");
                  onConfirmed();
                }}
              >
                This plan works for me
              </Button>
            )}
            {code && !confirmingRedo && (
              <Button variant="outline" onClick={() => setConfirmingRedo(true)} disabled={!access.aiEnabled || left === 0}>
                {outdated ? "Make a new plan" : "Make a new milestone map"}
              </Button>
            )}
          </div>
          {confirmingRedo && (
            <div className="mt-5 rounded-[12px] border border-line-2 bg-surface px-4 py-4">
              <p className="font-body text-[14px] leading-[1.6] text-ink-2">
                {outdated
                  ? "This replaces the whole plan with one made from your changed idea. Your edits to milestones will be lost. It uses 2 AI requests."
                  : "This replaces your milestone map, including any edits you made. It uses 1 AI request."}
              </p>
              <div className="mt-3 flex gap-3">
                <Button className="h-10 px-4" onClick={() => void (outdated ? makePlan() : redoMilestones())}>
                  Replace it
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
            <NeedCode lapsed={access.lapsed} kept="Your plan is still here." onAsk={() => setAskingCode(true)} />
          )}
        </div>
      )}
    </div>
  );
}

function ScopeList({ term, items }: { term: string; items: readonly string[] }) {
  return (
    <div>
      <dt className="font-body text-[12.5px] text-ink-3">{term}</dt>
      <dd className="mt-2">
        <ul className="m-0 list-disc space-y-1.5 pl-5 font-body text-[14.5px] leading-[1.55] text-ink marker:text-line-3">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </dd>
    </div>
  );
}
