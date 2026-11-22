import type { Metadata } from "next";
import Link from "next/link";
import { Mono } from "@/components/Mono";
import { program, isPlaceholder } from "@/config/program";

export const metadata: Metadata = {
  title: "Privacy note",
  description: "What PineLaunch collects, where it goes, how long it is kept, and how to have it deleted.",
};

function effective(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function PrivacyPage() {
  const email = program.contactEmail;
  const hasEmail = !isPlaceholder(email);

  const sections: { title: string; body: React.ReactNode[] }[] = [
    {
      title: "Who runs this and who to contact",
      body: [
        <>
          PineLaunch is a free program built and run by a high school student with his parents&apos; support. Because the
          founder is a minor, a parent of the founder is the responsible adult for the program. That parent reads the
          contact inbox.
        </>,
        <>
          Contact for any question, including a request to delete information:{" "}
          {hasEmail ? (
            <a href={`mailto:${email}`} className="font-mono text-[12px] uppercase tracking-[0.08em] text-txt underline decoration-line3 underline-offset-4">
              {email}
            </a>
          ) : (
            <span className="text-muted">email added soon</span>
          )}
          .
        </>,
      ],
    },
    {
      title: "Who the program is for",
      body: [
        <>
          Students aged 13 to 17, with a parent or guardian&apos;s agreement. The site is not meant for children under 13
          and asks them for nothing.
        </>,
      ],
    },
    {
      title: "What this website itself collects",
      body: [
        <>
          Nothing. The site has no accounts, no login, no database, no analytics, no advertising and no tracking cookies.
          Everything a student types on the site (the Project Card, ticked steps, notes) is saved in their own browser under
          one local key, <span className="font-mono text-[12px]">pinelaunch.progress.v1</span>, and never leaves the device.
          Clearing browser data removes it.
        </>,
        <>
          The site is hosted on Vercel. Like every web host, Vercel records basic access logs when a page is opened,
          including the visitor&apos;s IP address and approximate location, under Vercel&apos;s own privacy notice. We do not
          look at or export those logs.
        </>,
      ],
    },
    {
      title: "The one form",
      body: [
        <>
          There are no forms for students. The only form linked from this site is the parent waitlist for the full
          version of PineLaunch. It asks for a parent&apos;s email, which option interests them, and an optional comment.
          It asks nothing about the student. The answers are stored by Google Forms in the founder&apos;s Google account,
          are read by the founder and the responsible parent, and are used only to tell that parent about PineLaunch
          plans.
        </>,
      ],
    },
    {
      title: "No chat, and the outside tools",
      body: [
        <>
          This site has no chat, no messaging and no group. Students work on their own and show their work to people they
          already know.
        </>,
        <>
          Replit, Base44, ChatGPT and Google Forms are separate services with their own accounts, terms and privacy
          policies. Each one collects what its own policy describes. A parent should agree before a student creates any of
          those accounts, and we recommend keeping payment cards off them.
        </>,
      ],
    },
    {
      title: "Public projects",
      body: [
        <>
          At the end of the program each student publishes a public link to their project and shares it with people they
          choose. Students are asked to leave their full name, school, city, age, photos and other students&apos; names out
          of the project, and not to collect visitors&apos; personal details in it. Projects belong to the students. We do
          not list student projects on this site.
        </>,
      ],
    },
    {
      title: "How long we keep it",
      body: [
        <>
          Waitlist emails are kept until the full version opens and you have been told about it, or until you ask us to
          remove yours, whichever comes first.
        </>,
        <>To have anything deleted, email the contact above. We delete it within a week and confirm by reply.</>,
      ],
    },
    {
      title: "What changed on November 21, 2026",
      body: [
        <>
          An earlier version of this note described weekly student forms, a parent permission form and a private Discord
          group for a small pilot in December 2026. That pilot is not running. Those forms and the group are no longer
          linked from this site. Anything already sent to those forms will be deleted by January 19, 2027, as the earlier
          note promised.
        </>,
        <>
          If this note changes again, the date at the top changes with it. For the full picture for parents, see{" "}
          <Link href="/parents" className="text-txt underline decoration-line3 underline-offset-4 hover:decoration-pine-hi">
            the parents page
          </Link>
          .
        </>,
      ],
    },
  ];

  return (
    <div className="pl-shell py-12 lg:py-20">
      <div className="max-w-[720px]">
        <Mono className="text-pine-hi">Privacy note</Mono>
        <h1 className="mt-3 font-heading text-[34px] font-medium leading-[1.04] tracking-[-0.03em] text-txt lg:text-[46px]">
          What we collect, where it goes, and when it is deleted.
        </h1>
        <Mono className="mt-4 block text-muted">Effective {effective(program.privacy.effectiveDate)}</Mono>
        <p className="mt-5 font-body text-[15px] leading-[1.7] text-txt2">
          Short version: this website stores nothing about students. The only thing we ever receive is a parent&apos;s email
          on the waitlist form, and only if a parent chooses to send it.
        </p>
      </div>
      <div className="mt-12 max-w-[68ch]">
        {sections.map((s) => (
          <section key={s.title} className="border-t border-white/[0.08] pt-8 first:border-t-0 first:pt-0 [&+section]:mt-8">
            <h2 className="font-heading text-[22px] font-medium leading-snug tracking-[-0.02em] text-txt">{s.title}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3 font-body text-[14.5px] leading-[1.75] text-txt2">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
