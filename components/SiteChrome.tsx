import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/**
 * Everything that wraps a public site page: the skip link, the header and the
 * footer, as in the v2 "Night to launch" design. The studio does not use it:
 * it is a workspace with its own frame (see app/(studio)).
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-on-accent"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="relative flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
