import { home } from "@/content/home";
import { Button } from "../Button";
import { Mono } from "../Mono";
import { HomeworkDemo } from "./HomeworkDemo";

export function Hero() {
  const { hero } = home;
  return (
    <section className="relative border-b border-white/[0.06]">
      <div className="pl-shell relative pb-14 pt-12 lg:pb-20 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16">
          <div className="pl-rise">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-pine-hi" aria-hidden="true" />
              <Mono className="text-txt2">{hero.kicker}</Mono>
            </span>
            <h1 className="mt-7 font-display text-[52px] font-extrabold leading-[0.98] tracking-[-0.04em] text-txt sm:text-[68px] lg:text-[84px]">
              {hero.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-7 max-w-[46ch] font-body text-[16px] leading-[1.7] text-txt2">{hero.lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button to="/start">Start the idea picker</Button>
              <Button to="/parents" variant="outline">
                For parents
              </Button>
            </div>
            <dl className="mt-11 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-white/[0.08] bg-white/[0.07] sm:grid-cols-4">
              {hero.facts.map((f) => (
                <div key={f.label} className="bg-ink px-4 py-3.5">
                  <Mono as="dt" className="text-muted">
                    {f.label}
                  </Mono>
                  <dd className="mt-1.5 font-body text-[12.5px] leading-snug text-txt">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className="m-0 lg:max-w-[460px] lg:justify-self-end">
            <HomeworkDemo />
            <figcaption className="mt-3 font-body text-[12.5px] leading-[1.6] text-muted">{hero.demo.caption}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
