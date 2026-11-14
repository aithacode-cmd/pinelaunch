import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { program, isPlaceholder } from "@/config/program";
import { formatLong } from "@/lib/dates";

export const metadata: Metadata = {
  title: "For parents",
  description: "What students do in PineLaunch, the time it takes, the tools used, and how the site handles data.",
};

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

export default function ParentsPage() {
  const tools = Object.values(program.tools);
  return (
    <PageShell
      title="For parents"
      lead="A plain description of what your teen will do, what it takes, and how this site handles their information."
    >
      <div className="prose-pl max-w-prose space-y-10 text-[15px] leading-relaxed text-ink">
        <section aria-labelledby="what">
          <H2 id="what">What students do</H2>
          <p className="mt-3">
            {program.name} is a free three-week online program. Each student picks one small project idea, builds a
            first working version, has three people try it, fixes the biggest problem, and publishes it so anyone can
            open it. The projects are small on purpose: a simple app, a website, a tool, or a one-screen game.
          </p>
          <p>
            The pilot runs from {formatLong(program.cohort.startDate)} to {formatLong(program.cohort.launchDate)} with{" "}
            {program.cohort.sizeNote}. Week 1 is choosing and scoping. Week 2 is building. Week 3 is testing, fixing
            and launching.
          </p>
        </section>

        <section aria-labelledby="time">
          <H2 id="time">Time commitment</H2>
          <p className="mt-3">
            About {program.hoursPerWeek} a week, at whatever time suits your teen. There are no live sessions to attend.
            Each week ends with a short check-in form.
          </p>
        </section>

        <section aria-labelledby="tools">
          <H2 id="tools">Tools used</H2>
          <p className="mt-3">Students use three outside tools. Each one requires a parent&apos;s permission for users under 18.</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {tools.map((t) => (
              <li key={t.name}>
                <a href={t.url} target="_blank" rel="noopener noreferrer" className="font-medium text-pine-700 underline">
                  {t.name}
                </a>
                : {t.oneLiner} Students use one of the two to build their project.
              </li>
            ))}
            <li>
              <a href={program.aiHelper.url} target="_blank" rel="noopener noreferrer" className="font-medium text-pine-700 underline">
                {program.aiHelper.name}
              </a>
              : used as a study helper. The site gives students copy-and-paste prompts that are written to ask for
              hints and small steps rather than finished answers. The site itself has no AI built in.
            </li>
          </ul>
          <p>
            Your teen will need you to sit with them for a few minutes when they create these accounts. We recommend
            reviewing each tool&apos;s terms yourself before agreeing.
          </p>
        </section>

        <section aria-labelledby="chat">
          <H2 id="chat">How the group chat works</H2>
          <p className="mt-3">
            The group talks in a private Discord server run by the founder. It is invite-only. A parent of the founder
            is a member and can see everything posted. Students are asked to keep all conversation in the shared
            channels and not to send private direct messages to each other. Discord itself requires users to be 13 or
            older.
          </p>
        </section>

        <section aria-labelledby="data">
          <H2 id="data">Information and privacy</H2>
          <p className="mt-3">
            This website collects no personal information. There are no accounts, no logins, no cookies for tracking,
            and no analytics. Your teen&apos;s progress, including their project card and checked steps, is stored only
            in their own browser on their own device. It is never sent to us.
          </p>
          <p>
            The only information we receive comes from four short Google Forms: one check-in at the end of each week
            and one feedback form on Launch Day. Each form asks for a first name and last initial so the founder knows
            who finished what. The forms do not ask for an email address, a last name, a school, or an age.
          </p>
        </section>

        <section aria-labelledby="why">
          <H2 id="why">Why this is worth three weeks</H2>
          <p className="mt-3">
            Finishing something small and putting it in front of real people is a skill most people never practice.
            Your teen leaves with a public link to something they made, and with a repeatable way to do it again. Some
            families find it also gives their teen something concrete to talk about in a college application, but that
            is a side benefit, not the point.
          </p>
        </section>

        <section aria-labelledby="contact">
          <H2 id="contact">Contact</H2>
          <p className="mt-3">
            Questions go to the founder at{" "}
            {isPlaceholder(program.contactEmail) ? (
              <span className="text-ink-soft">(contact email not set yet)</span>
            ) : (
              <a href={`mailto:${program.contactEmail}`} className="font-medium text-pine-700 underline">
                {program.contactEmail}
              </a>
            )}
            . A parent reads that inbox as well.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
