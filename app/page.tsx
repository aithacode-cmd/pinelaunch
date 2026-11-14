import Link from "next/link";
import { HeroVisual } from "@/components/HeroVisual";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { Reveal } from "@/components/Reveal";
import { ToolsStrip } from "@/components/ToolsStrip";
import { home } from "@/content/home";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="container-pl grid items-center gap-12 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28 lg:pt-24">
        <div>
          <p className="t-mono text-pine">{home.hero.kicker}</p>
          <h1 className="t-display mt-4 text-[2.75rem] sm:text-[3.75rem] lg:text-[4.5rem]">{home.hero.headline}</h1>
          <p className="mt-6 max-w-[56ch] text-lg text-text-2">{home.hero.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/start" className="btn-primary px-6 text-base">
              Start
            </Link>
            <Link href="/parents" className="btn-secondary px-6 text-base">
              For parents
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 sm:grid-cols-4">
            {home.hero.facts.map((f) => (
              <div key={f.label}>
                <dt className="t-mono">{f.label}</dt>
                <dd className="mt-1 text-[15px] font-medium text-text">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <HeroVisual />
      </section>

      <ToolsStrip />

      {/* Who it is for */}
      <Reveal as="section" className="container-pl py-20 lg:py-28">
        <h2 className="t-heading text-3xl sm:text-4xl">{home.who.title}</h2>
        <ul className="mt-10 grid gap-8 sm:grid-cols-3">
          {home.who.items.map((it) => (
            <li key={it.title} className="border-l border-line-2 pl-5">
              <h3 className="text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-[15px] text-text-2">{it.body}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Process */}
      <section className="border-y border-line bg-bg-deep/50">
        <Reveal className="container-pl py-20 lg:py-28">
          <div className="max-w-[60ch]">
            <h2 className="t-heading text-3xl sm:text-4xl">{home.process.title}</h2>
            <p className="mt-3 text-lg text-text-2">{home.process.lead}</p>
          </div>
          <div className="mt-12">
            <ProcessTimeline stages={home.process.stages} />
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/week/1" className="btn-secondary">
              Read Week 1
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Showcase */}
      <Reveal as="section" className="container-pl py-20 lg:py-28">
        <div className="max-w-[60ch]">
          <h2 className="t-heading text-3xl sm:text-4xl">{home.showcase.title}</h2>
          <p className="mt-3 text-lg text-text-2">{home.showcase.lead}</p>
        </div>
        <div className="mt-10">
          <ProjectShowcase />
        </div>
      </Reveal>

      {/* Leave with */}
      <section className="border-y border-line bg-bg-deep/50">
        <Reveal className="container-pl py-20 lg:py-28">
          <h2 className="t-heading text-3xl sm:text-4xl">{home.leave.title}</h2>
          <ol className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {home.leave.items.map((it, i) => (
              <li key={it.title} className="flex gap-5">
                <span className="t-mono mt-1.5 text-pine">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="t-heading text-2xl">{it.title}</h3>
                  <p className="mt-2 text-[15px] text-text-2">{it.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* Who runs this */}
      <Reveal as="section" className="container-pl grid gap-8 py-20 lg:grid-cols-[1fr_1.2fr] lg:py-28">
        <h2 className="t-heading text-3xl sm:text-4xl">{home.runs.title}</h2>
        <div className="prose-pl max-w-[58ch] text-text-2">
          <p>{home.runs.body}</p>
          <p>
            {home.runs.privacy}{" "}
            <Link href="/parents" className="text-pine-hi underline underline-offset-4">
              Details for parents
            </Link>
            .
          </p>
        </div>
      </Reveal>

      {/* Closing */}
      <section className="container-pl pb-10">
        <Reveal className="panel-glow overflow-hidden rounded-[24px] border border-line-2 px-6 py-14 text-center sm:px-12 sm:py-20">
          <h2 className="t-display mx-auto max-w-[18ch] text-[2.25rem] sm:text-[3.25rem]">{home.closing.title}</h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-lg text-text-2">{home.closing.body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/start" className="btn-primary px-6 text-base">
              Start
            </Link>
            <Link href="/parents" className="btn-secondary px-6 text-base">
              For parents
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
