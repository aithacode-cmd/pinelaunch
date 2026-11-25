"use client";

import { useState } from "react";
import { launch } from "@/content";
import { useProgress } from "@/lib/progress";
import { fillPlaceholders } from "@/lib/fill";
import { Button } from "./Button";
import { CopyButton } from "./CopyButton";
import { Mono } from "./Mono";

export function LaunchView() {
  const { state } = useProgress();
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const template = fillPlaceholders(launch.postTemplate, state.card);
  const checkedCount = launch.checklist.filter((_, i) => checked[i]).length;

  return (
    <div className="pl-shell py-12 lg:py-20">
      <Mono className="text-accent">{launch.dateLabel}</Mono>
      <h1 className="mt-3 max-w-[18ch] font-heading text-[36px] font-medium leading-[1.02] tracking-[-0.04em] text-ink lg:text-[58px]">
        {launch.title}
      </h1>
      <p className="mt-4 max-w-[54ch] font-body text-[17px] leading-[1.65] text-ink-2">{launch.lead}</p>

      <section className="mt-12 grid gap-6 rounded-[22px] border border-line-2 bg-surface p-6 sm:p-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-12">
        <div>
          <Mono className="text-ink-3">What counts as launched</Mono>
          <h2 className="mt-3 font-heading text-[24px] font-medium leading-snug tracking-[-0.02em] text-ink">{launch.counts.title}</h2>
        </div>
        <ul className="space-y-3 border-t border-line pt-4 lg:border-l lg:border-t-0 lg:border-line lg:pl-10 lg:pt-0">
          {launch.counts.items.map((item) => (
            <li key={item} className="flex gap-3 font-body text-[16px] leading-[1.65] text-ink-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="checklist-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="checklist-heading" className="font-heading text-[24px] font-medium tracking-[-0.02em] text-ink">
            Pre-launch checklist
          </h2>
          <Mono className="text-ink-3">
            {checkedCount} of {launch.checklist.length} checked
          </Mono>
        </div>
        <ul className="mt-5 max-w-[760px] border-t border-line">
          {launch.checklist.map((item, i) => {
            const id = `launch-check-${i}`;
            const on = !!checked[i];
            return (
              <li key={item} className="border-b border-line">
                <div className="flex items-start gap-3 py-4">
                  <input
                    id={id}
                    type="checkbox"
                    checked={on}
                    onChange={(e) => setChecked((c) => ({ ...c, [i]: e.target.checked }))}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={id}
                    className="flex cursor-pointer items-start gap-3 rounded-[6px] font-body text-[16px] leading-snug text-ink-2 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent-strong"
                  >
                    <span
                      className={
                        "mt-0.5 flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[4px] border " +
                        (on ? "border-accent bg-accent" : "border-line-3")
                      }
                    >
                      {on && <span className="h-1.5 w-1.5 rounded-[1px] bg-white" />}
                    </span>
                    {item}
                  </label>
                </div>
              </li>
            );
          })}
        </ul>
        <Mono className="mt-3 block text-ink-3">This checklist is for this visit only</Mono>
        <p className="mt-4 max-w-[62ch] font-body text-[15px] leading-[1.65] text-ink-3">{launch.checklistNote}</p>
      </section>

      <section className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-12" aria-labelledby="post-heading">
        <div>
          <h2 id="post-heading" className="font-heading text-[24px] font-medium tracking-[-0.02em] text-ink">
            {launch.howToPost.title}
          </h2>
          <ol className="mt-5 space-y-3">
            {launch.howToPost.steps.map((s, i) => (
              <li key={s} className="flex gap-3 font-body text-[16px] leading-[1.65] text-ink-2">
                <span className="shrink-0 pt-0.5 font-mono text-[13px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 font-body text-[15px] leading-[1.65] text-ink-3">
            Then tick the last step on the Week 3 page to earn the Launched badge.
          </p>
        </div>
        <div className="rounded-[16px] border border-line-2 bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <Mono className="text-ink-3">Message template</Mono>
            <CopyButton text={template} className="h-8 px-3 text-[12px]" />
          </div>
          <pre className="mt-4 whitespace-pre-wrap break-words font-mono text-[13.5px] leading-[1.7] text-ink">{template}</pre>
        </div>
      </section>

      <section className="mt-14 rounded-[22px] border border-line-2 bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Mono className="text-ink-3">After you launch</Mono>
            <div className="pl-prose mt-3 max-w-[46ch] font-body text-[16px] leading-[1.65] text-ink-2">
              {launch.afterLaunch.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <Button to="/dashboard" variant="outline" className="shrink-0">
            Back to your dashboard
          </Button>
        </div>
      </section>
    </div>
  );
}
