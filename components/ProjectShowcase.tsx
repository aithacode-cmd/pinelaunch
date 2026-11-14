import { home } from "@/content/home";

/** Small original interface mockups. Pure CSS, no images, clearly marked as examples. */
function Mock({ kind }: { kind: string }) {
  if (kind === "App") {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="h-2 w-16 rounded bg-text-3/50" />
          <span className="h-5 w-5 rounded-full bg-pine-deep" />
        </div>
        {[true, false, false].map((d, i) => (
          <div key={i} className="flex items-center gap-2 rounded-[8px] bg-bg-deep px-2 py-2">
            <span className={"h-3.5 w-3.5 rounded-[4px] border " + (d ? "border-pine bg-pine" : "border-line-3")} />
            <span className={"h-2 rounded bg-text-3/50 " + (i === 1 ? "w-24" : "w-16")} />
          </div>
        ))}
      </div>
    );
  }
  if (kind === "Website") {
    return (
      <div className="space-y-2">
        <div className="flex gap-1.5">
          <span className="h-2 w-10 rounded bg-pine/70" />
          <span className="h-2 w-6 rounded bg-text-3/40" />
          <span className="h-2 w-6 rounded bg-text-3/40" />
        </div>
        <div className="h-14 rounded-[8px] bg-surface-3" />
        <div className="grid grid-cols-3 gap-1.5">
          <span className="h-8 rounded-[6px] bg-bg-deep" />
          <span className="h-8 rounded-[6px] bg-bg-deep" />
          <span className="h-8 rounded-[6px] bg-bg-deep" />
        </div>
      </div>
    );
  }
  if (kind === "Tool") {
    return (
      <div className="space-y-2">
        <div className="rounded-[8px] bg-bg-deep px-2 py-2 text-[12px] text-text-3" style={{ fontFamily: "var(--font-mono)" }}>
          input
        </div>
        <div className="flex justify-center text-pine">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v12M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
        </div>
        <div className="rounded-[8px] bg-pine-deep/40 px-2 py-2 text-[12px] text-text" style={{ fontFamily: "var(--font-mono)" }}>
          output
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-5 gap-1">
      {Array.from({ length: 15 }).map((_, i) => (
        <span
          key={i}
          className={
            "aspect-square rounded-[4px] " + (i === 7 ? "bg-pine" : i === 13 ? "bg-pine-hi/70" : [2, 4, 10].includes(i) ? "bg-surface-3" : "bg-bg-deep")
          }
        />
      ))}
    </div>
  );
}

export function ProjectShowcase() {
  return (
    <div>
      <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {home.showcase.items.map((item, i) => (
          <li key={item.kind} className="panel-glow w-[78%] shrink-0 snap-start rounded-[20px] border border-line p-5 sm:w-auto">
            <div className="flex items-center justify-between">
              <span className="t-mono text-pine">{String(i + 1).padStart(2, "0")}</span>
              <span className="t-mono">example</span>
            </div>
            <div className="my-5 rounded-[12px] border border-line bg-surface-2 p-3">
              <Mock kind={item.kind} />
            </div>
            <h3 className="t-heading text-xl">{item.kind}</h3>
            <p className="mt-1 text-[15px] text-text-2">{item.example}</p>
          </li>
        ))}
      </ul>
      <p className="t-mono mt-4">{home.showcase.disclaimer}</p>
    </div>
  );
}
