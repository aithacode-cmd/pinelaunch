import Link from "next/link";
import { program } from "@/config/program";
import { weeks } from "@/content";
import { formatLong, formatRange } from "@/lib/dates";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      <section className="py-16 sm:py-24">
        <p className="text-sm font-medium text-pine-700">
          {program.cohort.label}. Starts {formatLong(program.cohort.startDate)}. Free.
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Build and launch one real project in three weeks.
        </h1>
        <p className="mt-5 max-w-prose text-lg text-ink-soft">
          {program.name} is a free online program for high school students, ages 13 to 17. You pick a small idea,
          build a first version, get three people to try it, and put it online. No coding experience needed.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/start" className="btn-primary px-6 py-3 text-base">
            Start
          </Link>
          <Link href="/parents" className="btn-secondary px-6 py-3 text-base">
            For parents
          </Link>
        </div>
      </section>

      <section className="border-t border-line py-14" aria-labelledby="who-title">
        <h2 id="who-title" className="text-2xl font-semibold tracking-tight">
          Who it is for
        </h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-3">
          <div>
            <h3 className="font-medium">Students 13 to 17</h3>
            <p className="mt-1 text-ink-soft">Most have never written code. That is fine. The guides assume you are starting from zero.</p>
          </div>
          <div>
            <h3 className="font-medium">People with an idea</h3>
            <p className="mt-1 text-ink-soft">An app, a website, a tool, or a simple game. Something one real person you know would use.</p>
          </div>
          <div>
            <h3 className="font-medium">People who want to finish</h3>
            <p className="mt-1 text-ink-soft">The program is built around finishing something small, not starting something big.</p>
          </div>
        </div>
      </section>

      <section className="border-t border-line py-14" aria-labelledby="weeks-title">
        <h2 id="weeks-title" className="text-2xl font-semibold tracking-tight">
          Three weeks
        </h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-3">
          {weeks.map((w) => (
            <li key={w.number} className="card">
              <p className="text-sm text-ink-soft">
                Week {w.number}. {formatRange(program.weeks[w.number].start, program.weeks[w.number].end)}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{w.shortTitle}</h3>
              <p className="mt-2 text-sm text-ink">{w.goal}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-ink-soft">
          Launch Day is {formatLong(program.cohort.launchDate)}. About {program.hoursPerWeek} a week.
        </p>
      </section>

      <section className="border-t border-line py-14" aria-labelledby="leave-title">
        <h2 id="leave-title" className="text-2xl font-semibold tracking-tight">
          What you leave with
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          <li className="card">
            <h3 className="font-medium">A live project</h3>
            <p className="mt-1 text-sm text-ink">A public link anyone can open. Built by you, used by real people.</p>
          </li>
          <li className="card">
            <h3 className="font-medium">A way of working</h3>
            <p className="mt-1 text-sm text-ink">
              Scope small, build the ugly version, test with real people, fix one thing, ship. It works for the next
              project too.
            </p>
          </li>
          <li className="card">
            <h3 className="font-medium">Tool skills</h3>
            <p className="mt-1 text-sm text-ink">
              You will know your way around {program.tools.replit.name} or {program.tools.base44.name}, and how to get
              useful help from an AI without letting it do the work for you.
            </p>
          </li>
          <li className="card">
            <h3 className="font-medium">A small group</h3>
            <p className="mt-1 text-sm text-ink">
              {program.cohort.sizeNote} building at the same time, in a private group chat, each testing the others&apos;
              work.
            </p>
          </li>
        </ul>
      </section>

      <section className="border-t border-line py-14" aria-labelledby="runs-title">
        <h2 id="runs-title" className="text-2xl font-semibold tracking-tight">
          Who runs this
        </h2>
        <p className="mt-4 max-w-prose text-ink">
          {program.name} is built and run by a high school student, with his parents&apos; support. A parent is in
          the group chat. The program is free during the pilot.
        </p>
        <p className="mt-3 max-w-prose text-ink-soft">
          This site keeps no accounts and collects no personal information. Your progress is saved in your own
          browser.{" "}
          <Link href="/parents" className="text-pine-700 underline">
            Details for parents
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
