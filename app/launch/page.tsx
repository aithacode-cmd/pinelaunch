import type { Metadata } from "next";
import Link from "next/link";
import { FormEmbed } from "@/components/FormEmbed";
import { PageShell } from "@/components/PageShell";
import { program, isPlaceholder } from "@/config/program";
import { launch } from "@/content";

export const metadata: Metadata = {
  title: "Launch Day",
};

export default function LaunchPage() {
  return (
    <PageShell title={launch.title} lead={launch.dateLabel}>
      <div className="space-y-10">
        <section aria-labelledby="means" className="max-w-prose">
          <h2 id="means" className="text-2xl font-semibold tracking-tight">
            What launched means
          </h2>
          <div className="prose-pl mt-3 text-[15px] leading-relaxed">
            {launch.whatLaunchedMeans.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby="checklist">
          <h2 id="checklist" className="text-2xl font-semibold tracking-tight">
            Pre-launch checklist
          </h2>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2">
            {launch.checklist.map((item, i) => (
              <li key={i} className="card flex gap-3 py-3">
                <span className="font-semibold text-pine-700">{i + 1}</span>
                <span className="text-[15px]">{item}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-ink-soft">
            The &quot;Pre-launch checklist for my project&quot; prompt on{" "}
            <Link href="/week/3" className="text-pine-700 underline">
              the Week 3 page
            </Link>{" "}
            makes a version of this list for your own project.
          </p>
        </section>

        <section aria-labelledby="post" className="rounded-lg border border-pine-200 bg-pine-50 p-5">
          <h2 id="post" className="text-2xl font-semibold tracking-tight">
            {launch.howToPost.title}
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px]">
            {launch.howToPost.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-ink-soft">
            Then check off &quot;Launch Day: post your link&quot; on the Week 3 page to earn the Launched badge.
          </p>
          {!isPlaceholder(program.discordInviteUrl) && (
            <a href={program.discordInviteUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-4 bg-paper">
              Open Discord
            </a>
          )}
        </section>

        <section aria-labelledby="after" className="max-w-prose">
          <h2 id="after" className="text-2xl font-semibold tracking-tight">
            After you post
          </h2>
          <div className="prose-pl mt-3 text-[15px] leading-relaxed">
            {launch.afterLaunch.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby="feedback">
          <h2 id="feedback" className="text-2xl font-semibold tracking-tight">
            Final feedback form
          </h2>
          <p className="mt-2 max-w-prose text-sm text-ink-soft">
            About five minutes. It asks for your first name and last initial and then your honest opinion of the
            program.
          </p>
          <div className="mt-4">
            <FormEmbed title="Final feedback form" url={program.forms.finalFeedback} />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
