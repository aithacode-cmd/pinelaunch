import Link from "next/link";
import { program } from "@/config/program";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-paper-soft">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-ink">{program.name}</span>
          <span>Run by a high school student with parent support.</span>
          <span>This site does not collect personal data.</span>
        </div>
        <nav aria-label="Footer" className="flex gap-4">
          <Link href="/parents" className="text-pine-700 underline-offset-2 hover:underline">
            For parents
          </Link>
          <Link href="/dashboard" className="text-pine-700 underline-offset-2 hover:underline">
            Dashboard
          </Link>
        </nav>
      </div>
    </footer>
  );
}
