import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { FormLinkPanel } from "@/components/FormLinkPanel";
import { PageShell } from "@/components/PageShell";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { Reveal } from "@/components/Reveal";
import { program, isPlaceholder } from "@/config/program";
import { launch } from "@/content";
import { home } from "@/content/home";

export const metadata: Metadata = {
  title: "Launch Day",
};

export default function LaunchPage() {
  return (
    <PageShell kicker="03 Launch" title={launch.title} lead={launch.dateLabel}>
      <div className="space-y-16">
        <section className="panel-glow rounded-[24px] border border-line-2 p-6 sm:p-8" aria-label="Program timeline">
          <ProcessTimeline stages={home.process.stages} current={3} compact />
        </section>

        <Reveal as="section" aria-labelledby="means" className="max-w-[62ch]">
          <h2 id="means" className="t-heading text-3xl">
            What launched means
          </h2>
          <div className="prose-pl mt-4 text-[15.5px] leading-relaxed text-text-2">
            {launch.whatLaunchedMeans.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" aria-labelledby="checklist">
          <h2 id="checklist" className="t-heading text-3xl">
            Pre-launch checklist
          </h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {launch.checklist.map((item, i) => (
              <li key={i} className="panel flex gap-4 p-4 text-[15px]">
                <span className="t-mono mt-0.5 text-pine">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-text-2">{item}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-text-3">
            The &quot;Pre-launch checklist for my project&quot; prompt on{" "}
            <Link href="/week/3" className="text-pine-hi underline underline-offset-4">
              the Week 3 page
            </Link>{" "}
            makes a version of this list for your own project.
          </p>
        </Reveal>

        <Reveal as="section" aria-labelledby="post" className="panel-2 p-6 sm:p-8">
          <p className="t-mono text-pine">Launch Day</p>
          <h2 id="post" className="t-heading mt-2 text-3xl">
            {launch.howToPost.title}
          </h2>
          <ol className="mt-5 grid gap-3">
            {launch.howToPost.steps.map((s, i) => (
              <li key={i} className="flex gap-4 text-[15.5px] text-text-2">
                <span className="t-mono mt-1 shrink-0 text-pine">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm text-text-3">
            Then check off &quot;Launch Day: post your link&quot; on the Week 3 page to earn the Launched badge.
          </p>
          {!isPlaceholder(program.discordInviteUrl) && (
            <a href={program.discordInviteUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-5">
              <MessageSquare size={16} aria-hidden="true" />
              Open Discord
            </a>
          )}
        </Reveal>

        <Reveal as="section" aria-labelledby="after" className="max-w-[62ch]">
          <h2 id="after" className="t-heading text-3xl">
            After you post
          </h2>
          <div className="prose-pl mt-4 text-[15.5px] leading-relaxed text-text-2">
            {launch.afterLaunch.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" aria-labelledby="feedback">
          <h2 id="feedback" className="t-heading text-3xl">
            Final feedback
          </h2>
          <div className="mt-6">
            <FormLinkPanel
              title="Final feedback form"
              body="About five minutes. It asks for your first name and last initial and then your honest opinion of the program."
              url={program.forms.finalFeedback}
              buttonLabel="Open the feedback form"
            />
          </div>
        </Reveal>
      </div>
    </PageShell>
  );
}
