import Link from "next/link";
import { program, isPlaceholder } from "@/config/program";
import { PineMark, Wordmark } from "./Brand";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-24 border-t border-line bg-bg-deep">
      <div className="container-pl grid gap-8 py-12 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <span className="inline-flex items-center gap-2.5 text-pine">
            <PineMark size={22} />
            <Wordmark />
          </span>
          <p className="mt-4 max-w-xs text-sm text-text-2">Run by a high school student with parent support.</p>
          <p className="mt-1 text-sm text-text-2">This site does not collect personal data.</p>
        </div>
        <nav aria-label="Footer" className="grid gap-2 text-sm">
          <span className="t-mono mb-1">Pages</span>
          <Link href="/parents" className="text-text-2 hover:text-text">For parents</Link>
          <Link href="/dashboard" className="text-text-2 hover:text-text">Dashboard</Link>
          <Link href="/prompts" className="text-text-2 hover:text-text">Prompts</Link>
          <Link href="/launch" className="text-text-2 hover:text-text">Launch Day</Link>
        </nav>
        <div className="grid gap-2 text-sm">
          <span className="t-mono mb-1">Contact</span>
          {isPlaceholder(program.contactEmail) ? (
            <span className="text-text-3">Email not set yet</span>
          ) : (
            <a href={`mailto:${program.contactEmail}`} className="text-text-2 hover:text-text">
              {program.contactEmail}
            </a>
          )}
          <span className="text-text-3">
            {program.cohort.label}: Dec 1 to Dec 20, 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
