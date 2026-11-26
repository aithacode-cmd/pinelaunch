import { home } from "@/content/home";
import { Button } from "../Button";
import { Mono } from "../Mono";
import { HomeworkDemo } from "./HomeworkDemo";

export function Hero() {
  const { hero } = home;
  const last = hero.headline.length - 1;
  return (
    <section className="relative border-b border-line bg-ground">
      <div className="pl-shell relative pt-12 sm:pt-16 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="pl-rise lg:col-span-7">
            <p className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-[2px] bg-accent" aria-hidden="true" />
              <Mono className="text-ink-2">{hero.kicker}</Mono>
            </p>
            <h1 className="mt-6 font-display text-[56px] font-medium leading-[0.95] tracking-[-0.05em] text-ink sm:text-[80px] lg:text-[104px]">
              {hero.headline.map((line, i) => (
                <span key={line} className={"block " + (i === last ? "text-accent" : "")}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-8 max-w-[40ch] font-body text-[18px] leading-[1.55] text-ink-2 sm:text-[19px]">{hero.lead}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button to="/start" className="min-h-12 px-6 text-[16px]">
                Start the idea picker
              </Button>
              <Button to="/parents" variant="outline" className="min-h-12 px-6 text-[16px]">
                For parents
              </Button>
            </div>
          </div>

          <figure className="pl-rise m-0 [animation-delay:120ms] lg:col-span-5">
            <HomeworkDemo />
            <figcaption className="mt-3 font-body text-[16px] leading-[1.6] text-ink-3">{hero.demo.caption}</figcaption>
          </figure>
        </div>

        <dl className="mt-14 grid grid-cols-2 border-t border-line sm:grid-cols-4 lg:mt-20">
          {hero.facts.map((f, i) => (
            <div
              key={f.label}
              className={
                "py-5 pr-4 " +
                (i % 2 === 1 ? "border-l border-line pl-4 sm:pl-6 " : "sm:pl-6 ") +
                (i === 0 ? "sm:pl-0 " : "") +
                (i >= 2 ? "border-t border-line sm:border-t-0 " : "") +
                (i === 2 ? "sm:border-l" : "")
              }
            >
              <Mono as="dt" className="text-ink-3">
                {f.label}
              </Mono>
              <dd className="mt-1.5 font-body text-[16px] font-medium leading-snug text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
