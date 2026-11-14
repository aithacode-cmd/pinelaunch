import type { ReactNode } from "react";

interface Props {
  title: string;
  lead?: string;
  /** Small technical label above the title. */
  kicker?: string;
  children: ReactNode;
  /** Set when the view renders its own header. */
  hideTitle?: boolean;
  /** Narrower reading column for text-heavy pages. */
  narrow?: boolean;
}

/** Shared page frame: content width, gutters, a title and an optional lead paragraph. */
export function PageShell({ title, lead, kicker, children, hideTitle = false, narrow = false }: Props) {
  return (
    <div className={"container-pl py-10 sm:py-14 " + (narrow ? "max-w-[880px]" : "")}>
      {!hideTitle && (
        <header className="mb-10 sm:mb-14">
          {kicker && <p className="t-mono mb-3 text-pine">{kicker}</p>}
          <h1 className="t-display text-[2.5rem] sm:text-[3.5rem]">{title}</h1>
          {lead && <p className="mt-4 max-w-[62ch] text-lg text-text-2">{lead}</p>}
        </header>
      )}
      {children}
    </div>
  );
}
