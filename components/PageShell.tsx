import type { ReactNode } from "react";

interface Props {
  title: string;
  lead?: string;
  children: ReactNode;
  /** Set when the view renders its own h1. */
  hideTitle?: boolean;
}

/** Shared page frame: max width, side gutters, a title and an optional lead paragraph. */
export function PageShell({ title, lead, children, hideTitle = false }: Props) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      {!hideTitle && (
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          {lead && <p className="mt-3 max-w-prose text-lg text-ink-soft">{lead}</p>}
        </header>
      )}
      {children}
    </div>
  );
}
