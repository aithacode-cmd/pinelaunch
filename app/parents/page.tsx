import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Mono } from "@/components/Mono";
import { WaitlistPanel } from "@/components/WaitlistPanel";
import { Accent } from "@/components/home/Section";
import { program, isPlaceholder } from "@/config/program";

export const metadata: Metadata = {
  title: "For parents",
  description: "What students do in PineLaunch, the time it takes, the tools used, and how the site handles data.",
};

const sections: { id: string; title: string; body: string[] }[] = [
  {
    id: "what-students-do",
    title: "What students do",
    body: [
      "Each student picks one small idea: an app, a website, a tool, or a one-screen game. Over three weeks they build a first version, show it to three people, fix one thing, and publish a public link.",
      "The work is deliberately small. A finished, plain project is the goal, not an ambitious unfinished one.",
    ],
  },
  {
    id: "accountability",
    title: "How it keeps students on track",
    body: [
      "Two things do the work. Small steps: each week has one job, broken into steps a student can finish in one sitting, so there is always a near, clear finish line. The game layer: every step is worth points, five badges mark the milestones, and the dashboard shows the next step. Points and badges live in the student's own browser.",
      "The site is self-paced, with no group and no deadlines set by us. A parent asking what got finished this week helps more than anything on the screen. Nothing is graded.",
    ],
  },
  {
    id: "timing",
    title: "Timing",
    body: [
      "There is no fixed start date. A student can begin any day and work through the three weeks at their own pace. Week 1 is the idea, week 2 is the build, week 3 is testing and launch.",
      "A small group pilot was planned for December 2026. It is not running. The full version of PineLaunch is being built instead, and the guides here stay open and free in the meantime.",
    ],
  },
  {
    id: "time",
    title: "Time commitment",
    body: [
      "Plan for two to three hours a week. Most students work in two sittings of about an hour.",
      "There are no scheduled calls, so the work can fit around school and activities.",
    ],
  },
  {
    id: "age",
    title: "Age range and experience",
    body: [
      "The program is for high school students aged 13 to 17.",
      "No coding experience is required. Every guide assumes the student is starting from zero, and the prompts are written for someone who has never built anything before.",
    ],
  },
  {
    id: "tools",
    title: "Replit and Base44",
    body: [
      "Students build in one of two tools: Replit, where they write and adjust code in the browser, or Base44, where they describe what they want and then adjust the result. They choose one in the idea picker and can change it later.",
      "Both are separate services with their own accounts, terms and privacy policies. This program is not affiliated with either of them.",
    ],
  },
  {
    id: "permission",
    title: "Parent permission",
    body: [
      "A parent or guardian should agree before a student creates an account on Replit, Base44 or ChatGPT. All three allow users 13 and up with a parent's permission.",
      "Keep payment cards off the student's accounts. These services sell paid upgrades, and the program never needs one.",
      "If you would like to see the program before your student starts, open the week pages together. Nothing is hidden and the guides are free.",
    ],
  },
  {
    id: "chatgpt",
    title: "ChatGPT",
    body: [
      "Students use ChatGPT with short copy-paste prompts. The prompts are written to ask for hints and small steps, and each one says: do not write the code for me. The site itself has no AI built in.",
      "ChatGPT is a separate service with its own account, terms and privacy policy. A student can finish the program without it, using the guides alone.",
    ],
  },
  {
    id: "no-chat",
    title: "No group chat",
    body: [
      "There is no chat, no messaging and no group on this site. Students work on their own and show their work to people they already know: a parent, a friend, a teacher.",
      "An earlier plan included a private Discord server for the December pilot. The pilot is not running, so the site no longer links to it.",
    ],
  },
  {
    id: "support",
    title: "How you can help",
    body: [
      "The most useful thing you can do is be one of the testers in week three. Five minutes, no instructions from you, and a note about where you got stuck.",
      "You can also help with the one rule that matters: keep the project small. Students tend to plan something larger than three weeks allows.",
    ],
  },
  {
    id: "after",
    title: "What comes next",
    body: [
      "Launch is level one. The full version of PineLaunch, which is being built now, is a ladder: every month is a new level with its own missions, points and badges. Level 2, Grow, is about getting the project its first 10 real users. Level 3, Earn, is about its first dollar. Level 4 and up add a big feature or start project number two.",
      "Alongside the levels: a themed Challenge Drop each month with a leaderboard that resets each season, and a monthly Parent Report with what your teen shipped, the milestones hit and a link to the live project.",
      "Two ways to pay, once the full version opens: a Build Pass (monthly, cancel any time) or a Season Pass (one payment for a season of about three months). Parents are the payers and payment accounts will be in a parent's name. Nothing is charged today, this site takes no payments, and none of this opens until it has had a legal review. If you want to hear about it first, the parent waitlist below asks for your email and nothing else.",
    ],
  },
  {
    id: "college",
    title: "A note about college",
    body: [
      "A finished, launched project can be a great thing for your teen to talk about in college applications. But it should never be the only thing an application rests on. Admissions decisions depend on many factors, PineLaunch has no connection to any college, and we make no promises about admissions results. Your teen's success is not tied to PineLaunch. The goal is for them to build something real and learn how they did it.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    body: [
      "This site has no accounts, no analytics, and no tracking cookies. It asks students for nothing and sends nothing. No payment of any kind exists.",
      "Everything a student types, including the Project Card, ticked steps and notes, is saved in their own browser under one local key. It never leaves the device. Clearing browser data or using a private window removes it.",
      "There are no forms for students. The only form linked from this site is the parent waitlist, which asks for a parent's email and nothing about the student. Google Forms, Replit, Base44 and ChatGPT each collect what their own policies describe. Those services are outside this site. The web host, Vercel, keeps ordinary access logs, as every host does.",
      "To have a waitlist email removed, email the contact on this page. The full privacy note is linked below.",
    ],
  },
];

export default function ParentsPage() {
  const email = program.contactEmail;
  const hasEmail = !isPlaceholder(email);
  return (
    <div className="pl-shell py-12 lg:py-20">
      <div className="max-w-[760px]">
        <Mono className="text-pine-hi">For parents</Mono>
        <h1 className="mt-3 font-heading text-[34px] font-medium leading-[1.02] tracking-[-0.04em] text-txt lg:text-[52px]">
          A small, free program with a <Accent>real finished project</Accent>.
        </h1>
        <p className="mt-5 font-body text-[15.5px] leading-[1.7] text-txt2">
          PineLaunch is a free three-week program for high school students, built and run by a high school student with his
          parents&apos; support. Students work through it at their own pace. This page covers what your student does, what it
          takes, and what stays private.
        </p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="On this page" className="lg:sticky lg:top-[124px] lg:self-start">
          <Mono className="text-muted">On this page</Mono>
          <ul className="mt-4 space-y-2 border-l border-line pl-4">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="font-body text-[13.5px] leading-relaxed text-txt2 transition-colors hover:text-txt">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-line pt-4">
            <Mono className="text-muted">Contact</Mono>
            {hasEmail ? (
              <a
                href={`mailto:${email}`}
                className="mt-2 inline-block break-all font-mono text-[11px] uppercase tracking-[0.08em] text-txt underline decoration-line3 underline-offset-4 hover:decoration-txt2"
              >
                {email}
              </a>
            ) : (
              <Mono className="mt-2 block text-muted">Email added soon</Mono>
            )}
            <p className="mt-2 font-body text-[12.5px] leading-[1.6] text-muted">A parent reads that inbox as well.</p>
          </div>
        </nav>

        <div className="max-w-[68ch]">
          {sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-32 border-t border-white/[0.08] pt-8 first:border-t-0 first:pt-0 [&+section]:mt-8"
            >
              <h2 className="font-heading text-[22px] font-medium leading-snug tracking-[-0.02em] text-txt">{s.title}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-3 font-body text-[14.5px] leading-[1.75] text-txt2">
                  {p}
                </p>
              ))}
            </section>
          ))}
          <div id="waitlist" className="mt-10 scroll-mt-32">
            <WaitlistPanel />
          </div>
          <div className="mt-6 flex items-start gap-4 rounded-[14px] border border-line2 p-5">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-txt2" aria-hidden="true" />
            <p className="font-body text-[13.5px] leading-[1.7] text-txt2">
              This site stores nothing on its own servers and keeps no accounts. Replit, Base44, ChatGPT and Google Forms are
              separate services, each with their own rules and privacy policies. Full details:{" "}
              <Link href="/privacy" className="text-txt underline decoration-line3 underline-offset-4 hover:decoration-pine-hi">
                the privacy note
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
