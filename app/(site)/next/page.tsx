import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Mono } from "@/components/Mono";
import { LevelLadder } from "@/components/home/LadderSection";
import { program, isPlaceholder } from "@/config/program";
import { next } from "@/content/next";

export const metadata: Metadata = {
  title: "What comes after Launch Day",
  description:
    "For parents: the planned PineLaunch subscription. The Level Ladder, a monthly Parent Report and monthly Challenge Drops. Nothing can be bought yet.",
};

/**
 * Parent-facing: the plan for the full version, with one button to the
 * parent waitlist. Describes plans only. No price, no payment, no account.
 * College is mentioned here only inside the full college note.
 */
export default function NextPage() {
  const { page } = next;
  const waitlist = program.forms.parentWaitlist;
  const ready = !isPlaceholder(waitlist);
  const passes = next.features.filter((f) => f.name === "Build Pass" || f.name === "Season Pass");

  return (
    <div className="pl-shell py-12 lg:py-20">
      <div className="max-w-[760px]">
        <Mono className="text-pine-hi">For parents · {next.label}</Mono>
        <h1 className="mt-3 font-display text-[36px] font-extrabold leading-[1.02] tracking-[-0.035em] text-txt sm:text-[46px] lg:text-[56px]">
          {page.title}
        </h1>
        <p className="mt-5 max-w-[58ch] font-body text-[15.5px] leading-[1.7] text-txt2">{page.lead}</p>
      </div>

      <section aria-labelledby="ladder-heading" className="mt-14">
        <h2 id="ladder-heading" className="font-heading text-[22px] font-medium tracking-[-0.02em] text-txt">
          Four levels, one a month
        </h2>
        <LevelLadder className="mt-6" />
      </section>

      <section aria-labelledby="parts-heading" className="mt-14">
        <h2 id="parts-heading" className="font-heading text-[22px] font-medium tracking-[-0.02em] text-txt">
          What the subscription includes
        </h2>
        <ul className="mt-6 grid gap-3 lg:grid-cols-3">
          {page.parts.map((p) => (
            <li key={p.name} className="rounded-[16px] border border-white/[0.08] bg-panel p-5 sm:p-6">
              <p className="font-body text-[15px] font-semibold text-txt">{p.name}</p>
              <p className="mt-2 font-body text-[13.5px] leading-[1.65] text-txt2">{p.line}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="pay-heading" className="mt-14 max-w-[68ch]">
        <h2 id="pay-heading" className="font-heading text-[22px] font-medium tracking-[-0.02em] text-txt">
          How paying will work
        </h2>
        <dl className="mt-5 divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {passes.map((f) => (
            <div key={f.name} className="grid gap-1 py-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6">
              <dt className="font-body text-[14px] font-semibold text-txt">{f.name}</dt>
              <dd className="font-body text-[13.5px] leading-[1.65] text-txt2">{f.line}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 font-body text-[13.5px] leading-[1.7] text-txt2">{next.payerNote}</p>
        <p className="mt-2 font-body text-[13.5px] leading-[1.7] text-txt2">
          Nothing is charged today. This site takes no payments and has no accounts. The three-week program stays free.
        </p>
      </section>

      <section
        id="reserve"
        aria-labelledby="reserve-heading"
        className="mt-14 scroll-mt-32 rounded-[20px] border border-line2 bg-panel p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-[52ch]">
            <Mono className="text-muted">Parent waitlist</Mono>
            <h2 id="reserve-heading" className="mt-3 font-heading text-[24px] font-medium leading-snug tracking-[-0.02em] text-txt">
              Want to hear when it opens?
            </h2>
            <p className="mt-3 font-body text-[14px] leading-[1.65] text-txt2">{page.reserveNote}</p>
          </div>
          {ready ? (
            <Button href={waitlist} className="shrink-0">
              {page.reserveButton}
            </Button>
          ) : (
            <Mono className="text-muted">{next.waitlist.notYet}</Mono>
          )}
        </div>
        <p className="mt-4 font-body text-[12.5px] leading-[1.6] text-muted">
          {next.waitlist.underButton} The form opens in a new tab and is hosted by Google Forms, outside this site.
        </p>
      </section>

      <section aria-labelledby="college-heading" className="mt-14 max-w-[68ch] border-t border-white/[0.08] pt-8">
        <h2 id="college-heading" className="font-heading text-[22px] font-medium tracking-[-0.02em] text-txt">
          A note about college
        </h2>
        <p className="mt-3 font-body text-[14.5px] leading-[1.75] text-txt2">{next.collegeNote}</p>
      </section>

      <p className="mt-10 font-body text-[13.5px] leading-[1.7] text-txt2">
        More for parents:{" "}
        <Link href="/parents" className="text-txt underline decoration-line3 underline-offset-4 hover:decoration-pine-hi">
          how the program works
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-txt underline decoration-line3 underline-offset-4 hover:decoration-pine-hi">
          the privacy note
        </Link>
        .
      </p>
    </div>
  );
}
