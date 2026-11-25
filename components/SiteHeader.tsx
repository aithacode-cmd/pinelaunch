"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useProgress } from "@/lib/progress";
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
  // A student who already has a Project Card continues; only a new visitor starts.
  const { ready, state } = useProgress();
  const hasCard = ready && !!state.card;
  const cta = hasCard ? { href: "/dashboard", label: "Continue", long: "Continue your project" } : { href: "/start", label: "Start", long: "Start the idea picker" };
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
      <header className="sticky top-0 z-40 border-b border-line bg-ground/90 backdrop-blur-md supports-[backdrop-filter]:bg-ground/75">
        <div className="pl-shell flex h-16 items-center justify-between gap-6">
          <Link href="/" aria-label="PineLaunch home" className="pl-press flex shrink-0 items-center rounded-md">
            <Logo markClassName="h-[22px] w-[22px]" />
          </Link>

          <nav aria-label="Main" className="hidden h-full lg:block">
            <ul className="flex h-full items-stretch gap-7">
              {links.map((l) => {
                const active = isActive(pathname, l.href);
                return (
                  <li key={l.href} className="flex">
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={
                        "relative flex items-center font-body text-[16px] leading-none transition-colors duration-150 hover:text-ink " +
                        "after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:origin-left after:rounded-full after:bg-accent after:transition-transform after:duration-200 after:ease-out motion-reduce:after:transition-none " +
                        (active ? "font-medium text-ink after:scale-x-100" : "text-ink-2 after:scale-x-0")
                      }
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link href={cta.href} className={buttonClass("primary", "group hidden min-h-10 gap-1.5 px-4 text-[14px] sm:inline-flex")}>
              {cta.label}
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
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
              className="pl-press inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-line-2 bg-surface text-ink transition-colors hover:border-line-3 lg:hidden"
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
          "fixed inset-0 z-50 flex flex-col bg-ground transition-[opacity,transform] ease-out motion-reduce:translate-y-0 motion-reduce:transition-opacity lg:hidden " +
          (open ? "translate-y-0 opacity-100 duration-200" : "pointer-events-none -translate-y-2 opacity-0 duration-150")
        }
      >
        <div className="pl-shell relative flex h-16 items-center justify-between border-b border-line">
          <Logo />
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="pl-press inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-line-2 bg-surface text-ink"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile" className="pl-shell relative flex-1 overflow-y-auto">
          <ul className="flex flex-col divide-y divide-line border-b border-line">
            {links.map((l, i) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={isActive(pathname, l.href) ? "page" : undefined} className="flex items-center justify-between gap-4 py-4 aria-[current=page]:text-accent">
                  <span className="flex items-baseline gap-4">
                    <Mono className="text-ink-3">{String(i + 1).padStart(2, "0")}</Mono>
                    <span className="font-heading text-[24px] font-medium tracking-[-0.03em] text-ink">{l.label}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-ink-3" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-body text-[16px] leading-[1.6] text-ink-3">
            Free and self-paced. No accounts. Progress stays in this browser.
          </p>
        </nav>
        <div className="pl-shell relative pb-8">
          <Link href={cta.href} className={buttonClass("primary", "h-12 w-full text-[15px]")}>
            {cta.long}
          </Link>
        </div>
      </div>
    </>
  );
}
