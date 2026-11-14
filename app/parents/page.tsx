import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { program, isPlaceholder } from "@/config/program";
import { formatLong } from "@/lib/dates";

export const metadata: Metadata = {
  title: "For parents",
  description: "What students do in PineLaunch, the time it takes, the tools used, and how the site handles data.",
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-4 border-t border-line py-10 sm:grid-cols-[14rem_1fr] sm:gap-10">
      <h2 id={id} className="t-heading text-2xl sm:sticky sm:top-24 sm:self-start">
        {title}
      </h2>
      <div className="prose-pl max-w-[62ch] text-[15.5px] leading-relaxed text-text-2">{children}</div>
    </section>
  );
}

export default function ParentsPage() {
  const tools = Object.values(program.tools);
  return (
    <PageShell
      kicker="For parents"
      title="What your teen will do, and what we do with their information."
      lead="A plain description of the program, the time it takes, the tools involved, and how this website handles data."
    >
      <div className="mt-2">
        <Section id="what" title="What students do">
          <p>
            {program.name} is a free three-week online program. Each student picks one small project idea, builds a
            first working version, has three people try it, fixes the biggest problem, and publishes it so anyone can
            open it. The projects are small on purpose: a simple app, a website, a tool, or a one-screen game.
          </p>
          <p>
            The pilot runs from {formatLong(program.cohort.startDate)} to {formatLong(program.cohort.launchDate)} with{" "}
            {program.cohort.sizeNote}. Week 1 is choosing and scoping. Week 2 is building. Week 3 is testing, fixing and
            launching. It is for students aged 13 to 17. No previous coding experience is required.
          </p>
        </Section>

        <Section id="time" title="Time commitment">
          <p>
            About {program.hoursPerWeek} a week, at whatever time suits your teen. There are no live sessions to attend.
            Each week ends with a short check-in form.
          </p>
        </Section>

        <Section id="tools" title="Tools used">
          <p>Students use these outside tools. Each one requires a parent&apos;s permission for users under 18.</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {tools.map((t) => (
              <li key={t.name}>
                <a href={t.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-pine-hi underline underline-offset-4">
                  {t.name}
                </a>
                : {t.oneLiner} Students use one of the two to build their project.
              </li>
            ))}
            <li>
              <a href={program.aiHelper.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-pine-hi underline underline-offset-4">
                {program.aiHelper.name}
              </a>
              : used as a study helper. The site gives students copy-and-paste prompts written to ask for hints and
              small steps rather than finished answers. The site itself has no AI built in.
            </li>
          </ul>
          <p>
            Your teen will need you to sit with them for a few minutes when they create these accounts. We recommend
            reviewing each tool&apos;s terms yourself before agreeing.
          </p>
        </Section>

        <Section id="chat" title="The group chat">
          <p>
            The group talks in a private Discord server run by the founder. It is invite-only. A parent of the founder
            is a member and can see everything posted. Students are asked to keep all conversation in the shared
            channels and not to send private direct messages to each other. Discord is a separate service with its own
            rules; it requires users to be 13 or older.
          </p>
        </Section>

        <Section id="data" title="Information and privacy">
          <p>
            This website collects no personal information. There are no accounts, no logins, no cookies for tracking,
            and no analytics. Your teen&apos;s progress, including their project card and checked steps, is stored only
            in their own browser on their own device. It is never sent to us.
          </p>
          <p>
            The only information we receive comes from four short Google Forms: one check-in at the end of each week
            and one feedback form on Launch Day. Each form asks for a first name and last initial so the founder knows
            who finished what. The forms do not ask for an email address, a last name, a school, or an age. The forms
            and the Discord server are outside services. Their privacy practices are their own, not this website&apos;s.
          </p>
        </Section>

        <Section id="why" title="Why three weeks">
          <p>
            Finishing something small and putting it in front of real people is a skill most people never practice.
            Your teen leaves with a public link to something they made, and with a repeatable way to do it again. Some
            families find it also gives their teen something concrete to talk about in a college application, but that
            is a side benefit, not the point.
          </p>
        </Section>

        <Section id="contact" title="Contact">
          <p>
            Questions go to the founder at{" "}
            {isPlaceholder(program.contactEmail) ? (
              <span className="text-text-3">(contact email not set yet)</span>
            ) : (
              <a href={`mailto:${program.contactEmail}`} className="font-semibold text-pine-hi underline underline-offset-4">
                {program.contactEmail}
              </a>
            )}
            . A parent reads that inbox as well.
          </p>
        </Section>
      </div>
    </PageShell>
  );
}
