# Before a public launch

Things deliberately NOT built for the closed beta. Each must be done, or consciously dropped, before PineLaunch is opened to the public or sold. From Part 18.2 of the spec, plus items found while building.

## From the spec

- Code expiry dates and fuller tools for switching codes off.
- A configurable monthly spending system in our own code. The beta relies on the provider's hard spending limit.
- Automatic detection of emails and phone numbers in what students type. The beta only shows a reminder.
- Heavier test suites: race conditions, path traversal, oversized input.
- Safari and wider browser coverage. The beta supports current Chrome, Edge and Firefox on a computer.
- A secure paid-entitlement system for selling Build Passes.
- A full legal, privacy and safety review for a public product used by minors.

## Found while building

- More than one project per browser, and a safe "start over". The beta opens one project.
- A way to open or export a saved project that could not be read. Today it is left untouched in the browser and a new project opens beside it.
- The old public pages (week guides, prompts, points dashboard, subscription page, waitlist form) still exist on `main`. Decide what the public site says before launch.
- A limit on how often a wrong access code can be tried from one address. Codes are too long to guess and a wrong code costs nothing, so the beta has none.
- A record of which code went to which family is kept outside PineLaunch, by the adult who hands them out. A public product needs a real way to issue and replace codes.
- A changed `ACCESS_CODE_SECRET` makes every existing code stop working. There is no way to rotate it gently.
- Seven moderate advisories in development-only packages (the ESLint toolchain), reported by `npm audit` on 2026-11-23. None ship to the browser: `npm audit --omit=dev` reports 0. Review before launch.
