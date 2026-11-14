"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { program } from "@/config/program";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/week/1", label: "Week 1" },
  { href: "/week/2", label: "Week 2" },
  { href: "/week/3", label: "Week 3" },
  { href: "/launch", label: "Launch Day" },
  { href: "/prompts", label: "Prompts" },
  { href: "/parents", label: "Parents" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight text-pine-700">
          {program.name}
        </Link>
        <nav aria-label="Main" className="-mx-1 flex flex-wrap gap-x-1 gap-y-1 text-sm">
          {links.map((l) => {
            const active = pathname === l.href || pathname === `${l.href}/`;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={
                  "rounded-md px-2 py-1 hover:bg-pine-50 " +
                  (active ? "font-medium text-pine-800 bg-pine-50" : "text-ink-soft")
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
