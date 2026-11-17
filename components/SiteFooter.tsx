import Link from "next/link";
import { program, isPlaceholder } from "@/config/program";
import { Logo } from "./Brand";
import { Mono } from "./Mono";
import { TopButton } from "./TopButton";

const pages = [
  { label: "Home", href: "/" },
  { label: "Start the idea picker", href: "/start" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Week 1", href: "/week/1" },
  { label: "Week 2", href: "/week/2" },
  { label: "Week 3", href: "/week/3" },
];
const programLinks = [
  { label: "Launch Day", href: "/launch" },
  { label: "Prompts", href: "/prompts" },
  { label: "For parents", href: "/parents" },
  { label: "Privacy note", href: "/privacy" },
];
const facts = ["Static site", "No accounts", "No tracking", "Browser storage only"];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/[0.08] bg-deep/60">
      <div className="pl-shell py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-[36ch] font-body text-[14px] leading-[1.7] text-txt2">
              A free three-week program where high school students build and launch one real project. Pilot cohort,
              December 2026.
            </p>
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {facts.map((f) => (
                <li
                  key={f}
                  className="rounded-full border border-white/[0.09] px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <nav aria-label="Footer pages" className="lg:col-span-3">
            <Mono className="text-txt2">Pages</Mono>
            <ul className="mt-4 space-y-2.5">
              {pages.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-body text-[14px] text-txt2 transition-colors hover:text-txt">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Footer program" className="lg:col-span-2">
            <Mono className="text-txt2">Program</Mono>
            <ul className="mt-4 space-y-2.5">
              {programLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-body text-[14px] text-txt2 transition-colors hover:text-txt">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="lg:col-span-3">
            <Mono className="text-txt2">Contact</Mono>
            <p className="mt-4 font-body text-[14px] leading-[1.7] text-txt2">
              Questions about the program, permission, or privacy:
            </p>
            {isPlaceholder(program.contactEmail) ? (
              <Mono className="mt-2 block text-muted">Email added before the pilot starts</Mono>
            ) : (
              <a
                href={`mailto:${program.contactEmail}`}
                className="mt-2 inline-block break-all font-mono text-[11.5px] uppercase tracking-[0.1em] text-txt underline decoration-line3 underline-offset-4 transition-colors hover:decoration-pine-hi"
              >
                {program.contactEmail}
              </a>
            )}
            <p className="mt-5 font-body text-[12.5px] leading-[1.65] text-muted">
              Progress is saved in your own browser. Nothing is uploaded, and there is no account to create.{" "}
              <Link href="/privacy" className="text-txt2 underline decoration-line3 underline-offset-4 hover:text-txt">
                Privacy note
              </Link>
              .
            </p>
            <p className="mt-3 font-body text-[11.5px] leading-[1.6] text-muted">
              Tool names and logos are trademarks of their owners. No affiliation or endorsement.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/[0.07]">
        <div className="pl-shell flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <Mono className="text-muted">PineLaunch · Pilot cohort 2026</Mono>
          <Mono className="text-muted">Progress key · pinelaunch.progress.v1</Mono>
          <TopButton />
        </div>
      </div>
    </footer>
  );
}
