"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo, PineMark, Wordmark } from "./Brand";

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

  const close = () => setOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-md">
        <div className="container-pl flex h-16 items-center justify-between gap-4">
          <Link href="/" className="shrink-0" aria-label="PineLaunch home">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {links.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    "relative rounded-[10px] px-3 py-2 text-[14px] font-medium transition-colors " +
                    (active ? "text-text" : "text-text-2 hover:text-text")
                  }
                >
                  {l.label}
                  {active && (
                    <span aria-hidden="true" className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-pine" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <Link href="/start" className="btn-primary">
              Start
            </Link>
          </div>

          <button
            ref={openRef}
            type="button"
            className="btn-secondary h-11 w-11 px-0 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/*
        Mobile menu. Always rendered, outside the header (its backdrop blur would
        trap a fixed child). Hidden with opacity plus `inert`, so it is never
        focusable or readable while closed, and it cannot get stuck open.
      */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
        className={
          "fixed inset-0 z-50 flex flex-col bg-bg-deep transition-opacity duration-200 motion-reduce:transition-none lg:hidden " +
          (open ? "opacity-100" : "pointer-events-none opacity-0")
        }
      >
        <div className="container-pl flex h-16 items-center justify-between">
          <span className="inline-flex items-center gap-2.5 text-pine">
            <PineMark size={22} />
            <Wordmark />
          </span>
          <button ref={closeRef} type="button" className="btn-secondary h-11 w-11 px-0" aria-label="Close menu" onClick={close}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Main" className="container-pl flex flex-1 flex-col justify-center gap-1 pb-16">
          {links.map((l, i) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={close}
                aria-current={active ? "page" : undefined}
                style={{ transitionDelay: open ? `${40 * i}ms` : "0ms" }}
                className={
                  "t-heading flex items-center justify-between rounded-[14px] px-4 py-3.5 text-[1.75rem] transition-[opacity,transform] duration-300 motion-reduce:transition-none " +
                  (open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0") +
                  " " +
                  (active ? "bg-surface-2 text-text" : "text-text-2 hover:text-text")
                }
              >
                {l.label}
                {active && <span className="t-mono text-pine">Here</span>}
              </Link>
            );
          })}
          <Link href="/start" onClick={close} className="btn-primary mt-6 w-full text-base">
            Start
          </Link>
        </nav>
      </div>
    </>
  );
}
