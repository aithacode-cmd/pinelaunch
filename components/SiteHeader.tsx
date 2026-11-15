"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "./Brand";
import { buttonClass } from "./Button";
import { Mono } from "./Mono";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/week/1", label: "Week 1" },
  { href: "/week/2", label: "Week 2" },
  { href: "/week/3", label: "Week 3" },
  { href: "/launch", label: "Launch Day" },
  { href: "/prompts", label: "Prompts" },
  { href: "/parents", label: "Parents" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname === `${href}/`;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);

  // Close on navigation (derived during render, not in an effect).
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
  }

  // While open: lock scroll, move focus to the close button, close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    const opener = openRef.current;
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-deep/70 backdrop-blur-xl">
        <div className="pl-shell flex h-[74px] items-center justify-between gap-6">
          <Link href="/" aria-label="PineLaunch home" className="flex shrink-0 items-center gap-3">
            <Logo markClassName="h-[22px] w-[22px]" />
            <span className="hidden h-5 w-px bg-white/10 sm:block" aria-hidden="true" />
            <Mono className="hidden text-muted sm:block">Pilot 2026</Mono>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5 rounded-full border border-white/[0.08] bg-white/[0.03] p-1">
              {links.map((l) => {
                const active = isActive(pathname, l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={
                        "block rounded-full px-3.5 py-1.5 font-body text-[12.5px] leading-none tracking-[-0.01em] transition-colors hover:text-txt " +
                        (active ? "bg-white/[0.09] text-txt" : "text-txt2")
                      }
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <span className="hidden items-center gap-2 xl:flex">
              <span className="pl-pulse-dot h-1 w-1 rounded-full bg-pine-hi" aria-hidden="true" />
              <Mono className="text-muted">Local only</Mono>
            </span>
            <Link href="/start" className={buttonClass("primary", "group hidden h-9 gap-1.5 px-4 text-[13px] sm:inline-flex")}>
              Start
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <button
              ref={openRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/[0.1] text-txt2 transition-colors hover:border-white/20 hover:text-txt lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/*
        Mobile menu. Always rendered, outside the header (its backdrop blur would
        trap a fixed child). Hidden with opacity plus `inert`, so it is never
        focusable or readable while closed.
      */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
        className={
          "fixed inset-0 z-50 flex flex-col bg-deep transition-opacity duration-200 motion-reduce:transition-none lg:hidden " +
          (open ? "opacity-100" : "pointer-events-none opacity-0")
        }
      >
        <div className="pl-grid-fine pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="pl-shell relative flex h-[74px] items-center justify-between border-b border-white/[0.07]">
          <Logo />
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/[0.1] text-txt2"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile" className="pl-shell relative flex-1 overflow-y-auto">
          <ul className="flex flex-col divide-y divide-white/[0.07] border-b border-white/[0.07]">
            {links.map((l, i) => (
              <li key={l.href}>
                <Link href={l.href} className="flex items-center justify-between gap-4 py-5">
                  <span className="flex items-baseline gap-4">
                    <Mono className="text-muted">{String(i + 1).padStart(2, "0")}</Mono>
                    <span className="font-heading text-[26px] font-medium tracking-[-0.035em] text-txt">{l.label}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-body text-[13px] leading-[1.6] text-muted">
            Free pilot cohort, Dec 1 to 20, 2026. No accounts. Progress stays in this browser.
          </p>
        </nav>
        <div className="pl-shell relative pb-8">
          <Link href="/start" className={buttonClass("primary", "h-12 w-full text-[15px]")}>
            Start the idea picker
          </Link>
        </div>
      </div>
    </>
  );
}
