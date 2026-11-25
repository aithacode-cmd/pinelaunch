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
      {/* A floating pill nav that sits on the night hero and on cream pages alike. */}
      <header className="pointer-events-none sticky top-0 z-40 pt-3">
        <div className="pl-shell flex items-center justify-between gap-3 lg:justify-center">
          <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-ground/95 py-1.5 pl-4 pr-1.5 shadow-[0_12px_30px_-14px_rgba(18,11,46,0.55)] ring-1 ring-ink/5 backdrop-blur-md lg:pr-2">
            <Link href="/" aria-label="PineLaunch home" className="pl-press mr-1 flex shrink-0 items-center rounded-full py-1.5 lg:mr-3">
              <Logo markClassName="h-[22px] w-[22px]" />
            </Link>
            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center">
                {links.map((l) => {
                  const active = isActive(pathname, l.href);
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        aria-current={active ? "page" : undefined}
                        className={
                          "block rounded-full px-3.5 py-2.5 font-body text-[15px] leading-none transition-colors duration-150 " +
                          (active ? "bg-ink font-semibold text-on-night" : "text-ink-2 hover:bg-ink/[0.06] hover:text-ink")
                        }
                      >
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <button
              ref={openRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="pl-press ml-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.06] lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <Link
            href={cta.href}
            className={buttonClass("primary", "group pointer-events-auto min-h-[52px] gap-1.5 px-5 text-[15px] lg:ml-2")}
          >
            {cta.label}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </Link>
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
          "fixed inset-0 z-50 flex flex-col bg-night text-on-night transition-[opacity,transform] ease-out motion-reduce:translate-y-0 motion-reduce:transition-opacity lg:hidden " +
          (open ? "translate-y-0 opacity-100 duration-200" : "pointer-events-none -translate-y-2 opacity-0 duration-150")
        }
      >
        <div className="pl-shell relative flex h-16 items-center justify-between border-b border-on-night/10">
          <Logo tone="night" />
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="pl-press inline-flex h-11 w-11 items-center justify-center rounded-full bg-on-night/10 text-on-night"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile" className="pl-shell relative flex-1 overflow-y-auto">
          <ul className="flex flex-col divide-y divide-on-night/10 border-b border-on-night/10">
            {links.map((l, i) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={isActive(pathname, l.href) ? "page" : undefined} className="flex items-center justify-between gap-4 py-4 aria-[current=page]:text-coral">
                  <span className="flex items-baseline gap-4">
                    <Mono className="text-on-night-2">{String(i + 1).padStart(2, "0")}</Mono>
                    <span className="font-heading text-[28px] font-bold tracking-[-0.03em] text-on-night">{l.label}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-on-night-2" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-body text-[16px] leading-[1.6] text-ink-3">
            Free and self-paced. No accounts. Progress stays in this browser.
          </p>
        </nav>
        <div className="pl-shell relative pb-8">
          <Link href={cta.href} className={buttonClass("primary", "h-14 w-full text-[16px]")}>
            {cta.long}
          </Link>
        </div>
      </div>
    </>
  );
}
