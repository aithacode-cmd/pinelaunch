import type { Metadata } from "next";
import Link from "next/link";
import { Mono } from "@/components/Mono";
import { program, isPlaceholder } from "@/config/program";
import { formatLong } from "@/lib/dates";

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
  const days = program.privacy.deleteWithinDays;

  const sections: { title: string; body: React.ReactNode[] }[] = [
    {
      title: "Who runs this and who to contact",
      body: [
        <>
          PineLaunch is a free program run by a high school student with his parents&apos; support. Because the founder is
          a minor, a parent of the founder is the responsible adult for the program. That parent reads the contact inbox
          and is in the group chat for the whole pilot.
        </>,
        <>
          Contact for any question, including a request to delete information:{" "}
          {hasEmail ? (
            <a href={`mailto:${email}`} className="font-mono text-[12px] uppercase tracking-[0.08em] text-txt underline decoration-line3 underline-offset-4">
              {email}
            </a>
          ) : (
            <span className="text-muted">email added before the pilot starts</span>
          )}
          .
        </>,
      ],
    },
    {
      title: "Who the program is for",
      body: [
        <>
          Students aged 13 to 17, with a parent or guardian&apos;s permission. Anyone younger cannot take part. If we learn
          that a student is under 13, we remove their form answers and their place in the chat.
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
      title: "What the forms collect",
      body: [
        <>
          Students fill in four short Google Forms: one at the end of each week and one on Launch Day. Each asks for a
          first name and last initial, what was finished, and where they got stuck. No email, last name, school, age or
          address is asked for, and no Google sign-in is required. The answers are stored by Google Forms in the
          founder&apos;s Google account and are read by the founder and the responsible parent.
        </>,
        <>
          Parents fill in one permission form, which asks for the parent&apos;s and the student&apos;s first name and last
          initial, a yes to the program, the tools and the group chat, and an optional way to reach the parent during the
          pilot. It is kept by the responsible parent.
        </>,
      ],
    },
    {
      title: "The group chat and the outside tools",
      body: [
        <>
          The cohort talks in a private Discord server. Messages there are held by Discord under Discord&apos;s terms. A
          parent of the founder is in the server for the whole pilot. Students are asked not to send private messages to
          each other and not to share personal details in the chat.
        </>,
        <>
          Replit, Base44, ChatGPT, Discord and Google Forms are separate services with their own accounts, terms and privacy
          policies. Each one collects what its own policy describes. A parent should agree before a student creates any of
          those accounts, and we recommend keeping payment cards off them.
        </>,
      ],
    },
    {
      title: "Public projects",
      body: [
        <>
          At the end of the program each student publishes a public link to their project and posts it in the group chat.
          Students are asked to leave their full name, school, city, age, photos and other students&apos; names out of the
          project, and not to collect visitors&apos; personal details in it. Projects belong to the students. We do not list
          student projects on this site without a parent&apos;s permission.
        </>,
      ],
    },
    {
      title: "How long we keep it",
      body: [
        <>
          Form answers and the cohort&apos;s Discord channels are deleted within {days} days after Launch Day (
          {formatLong(program.cohort.launchDate)}). Parent permission answers are deleted at the same time. Nothing is
          kept for later cohorts except notes about the program itself, with no student names.
        </>,
        <>
          To have anything deleted sooner, email the contact above. We delete it within a week and confirm by reply.
        </>,
      ],
    },
    {
      title: "Changes",
      body: [
        <>
          If this note changes, the date at the top changes with it. For the full picture for parents, see{" "}
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
          Short version: this website stores nothing about you. The weekly forms hold a first name and last initial, the
          group chat is on Discord, and everything is deleted after the pilot.
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
