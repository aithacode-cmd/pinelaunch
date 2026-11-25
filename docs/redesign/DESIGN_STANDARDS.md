# Design standards (across all projects)

These are the quality bar every project must meet. They are **not** a shared look: each product keeps its own identity, documented in its own `DESIGN.md`.

1. **Every product's own rules come first.** A project's CLAUDE.md, brand decisions and frozen design decisions override this file. A redesign that breaks the owner's recorded decisions isn't an improvement.
2. **Function before form.** No change to auth, billing, data, API contracts, permissions, storage keys or step ids without approval.
3. **Hierarchy:** one primary action per screen. Don't repeat the same metric in several places.
4. **Type:** at most one display face, one text face and one mono face per product. Body text 16px or larger, with a line length of about 45–75 characters.
5. **Colour:** semantic tokens only (bg, surface, text, text-2, border, accent, success, warning, error, disabled). WCAG AA contrast, checked by tooling where it exists.
6. **Motion:** only to show cause and effect, continuity or state. UI motion takes 120–250ms with ease-out; there is no motion on keyboard-driven actions, and `prefers-reduced-motion` turns everything off.
7. **Touch:** controls are at least 44px tall on mobile; inline text links are exempt.
8. **Responsive:** verified at 1440, 768 and 390px, with no sideways scroll, no clipped controls and navigation that works on phones.
9. **Evidence:** every "done" claim comes with screenshots, a passing build and lint, a passing test suite where one exists, and a browser walkthrough of the main journeys.
