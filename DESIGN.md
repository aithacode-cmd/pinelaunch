# PineLaunch design system: Workbench

Adopted 2026-11-25. Replaces the dark Base44 system (2026-11-15) at the founder's request. The frozen Base44 copy in `design/base44/` is now history, not a reference to match.

## Identity

PineLaunch is a calm, exact place to build your first real thing. The look is a **workbench**: a light working surface, clean rules, one tool colour. It should feel like a well-made engineering notebook, not a game and not a startup ad.

- **Teen beginner:** it should never feel like school or like a pitch. One clear next thing, plain words, real interface pictures.
- **Parent:** it should look serious and honest enough to trust in ten seconds.

### Principles
1. **One next thing.** Every working page puts the single next action first: the dashboard leads with "Next step", and week pages open only the next unfinished step.
2. **Rules, not boxes.** Hairlines and spacing carry structure. A box (card) appears only where something is interactive or is an object the student owns (a step, the Project Card, a prompt).
3. **One accent.** Teal is the pine. It marks primary actions, ticked boxes, current position and progress. Nothing else is coloured, apart from the real tool logos in the tools strip.
4. **Show the real thing.** Figures are built interface mockups (HTML), never renders or illustrations (founder decision 2026-11-18).
5. **Quiet motion.** Motion confirms an action or shows continuity. Nothing loops, nothing fades in on scroll.

## Colour tokens (`app/globals.css`, `@theme`)

| Token | Value | Role |
|---|---|---|
| `ground` | `#F7F9FA` | Page background |
| `band` | `#ECF0F2` | Alternate section band, footer |
| `surface` | `#FFFFFF` | Cards, inputs |
| `surface-2` | `#F1F4F6` | Insets, figure wells, hover fill |
| `surface-3` | `#E7ECEF` | Track background, quiet button |
| `line` | `#E2E8EB` | Default hairline |
| `line-2` | `#D3DCE0` | Stronger hairline, outline button border |
| `line-3` | `#7F9098` | Control borders (checkboxes, inputs); 3.2:1 on white |
| `ink` | `#1F3038` | Primary text; also the slate band background |
| `ink-2` | `#45575F` | Secondary text |
| `ink-3` | `#5B6C74` | Labels, metadata (AA on every surface, 4.6:1 minimum) |
| `accent` | `#0D7480` | Primary button, ticks, progress, accent text |
| `accent-strong` | `#0A5D67` | Hover and pressed accent |
| `accent-soft` | `#DFF0F1` | Earned badge, notices, input focus halo |
| `on-accent` | `#FFFFFF` | Text on accent or ink |
| `on-ink-2` / `on-ink-accent` / `on-ink-line` | `#C9D4D9` / `#9FD3D9` / `#6F848D` | Text, accent and rules on the slate band |
| `danger` / `danger-soft` | `#B3261E` / `#FBECEB` | Errors |
| `warning` | `#8A5A00` | Warnings |

Disabled controls use `opacity: 0.45` and `cursor: not-allowed`. Contrast pairs are listed at the top of `globals.css`.

## Typography

| Role | Face | Setting |
|---|---|---|
| Display (home h1) | Host Grotesk 500 | 56 / 80 / 104px, line-height 0.95, tracking -0.05em |
| Section heading (h2) | Host Grotesk 500 | 34 / 44 / 56px, line-height 1.04, tracking -0.035em, `text-balance`, max 18ch |
| Page title (h1, app pages) | Host Grotesk 500 | 36–64px, tracking -0.04em |
| Card / step title | Host Grotesk 500 | 18–28px, tracking -0.02 to -0.03em |
| Body | Host Grotesk 400 | 16–17px, line-height 1.55–1.65, max 46–62ch |
| Lead | Host Grotesk 400 | 18–19px |
| Label | JetBrains Mono 500 | 11.5px uppercase, tracking 0.06em, via `<Mono>` |
| Data, codes | JetBrains Mono 400 | 13px |

One accent phrase per heading is allowed, set in `accent` in the same face (`<Accent>`). There is no italic serif any more. Both fonts are self-hosted at build time by `next/font`, so visits never call Google.

## Spacing and layout
- Container: `.pl-shell`, max 1400px, side padding 20 / 32 / 56px.
- Home sections: 64 / 80 / 96px vertical padding. Each opens with a full-width `ink` rule and its number (`SectionFrame`).
- Grid: 12 columns on desktop; headings take 7 and copy 5.
- Radius: 8px for controls, 10–12px for cards, full for dots and tracks.
- Shadow: only the hero demo and the current step get a soft shadow. Everything else is flat.

## Components
- **Button** (`components/Button.tsx`): 44px minimum height, 8px radius, 15px medium. Four variants: `primary` (teal), `outline` (white with a `line-2` border), `quiet` (`surface-3` fill), `ghost` (text that underlines on hover). Every button uses `.pl-press` (scales to 0.97 on press). On the slate band, the primary action is white with ink text.
- **Header**: 64px, translucent ground with a hairline. Text links; the active page gets a 2px teal underline that draws from the left. Phones get a full-screen menu with focus moved to Close and Escape to close.
- **Footer**: `band` ground, link lists with 1.5-unit vertical padding (about 37px targets).
- **Launch track**: the shared progress motif (three segments: Idea, Build, Launch). Used on the home weeks section, the dashboard next-step panel and the week header.
- **Step** (`StepItem`): one row with a 22px checkbox, "Step N" label and title. The next step is a white card with a teal left rule and opens by default. Show/Hide is a 44px button with a rotating chevron.
- **Project Card**: slate header holding the name and type tag, white body. It is the one object the student owns, so it gets the strongest treatment.
- **Badges**: a list. Earned badges are a filled teal icon square; locked ones are a dashed outline.
- **Inputs**: white, `line-3` border, 8px radius, 16px text (so iOS does not zoom). Focus shows a teal border plus a `accent-soft` 3px halo, as well as the global focus ring.

## Interaction and motion
- Durations: 150–200ms for colour and transform, 500ms for progress fills. Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-out-quint`).
- Press: scale 0.97. Linked cards (`.pl-lift`) rise 2px with a darker border, and only on hover-capable pointers.
- The hero enters once (`.pl-rise`, 0.6s). Nothing else animates on load or scroll.
- Removed on purpose: the ticker, grid and grain backgrounds, spotlight glows, pulsing dots, scan sweeps and the sticky scroll scene.
- `prefers-reduced-motion`: all transforms, transitions and entrances stop. Content never depends on motion to appear.

## Responsive
- Breakpoints (Tailwind): `sm` 640, `lg` 1024, `xl` 1280.
- Verified at 1440, 768 and 390px with no sideways scroll.
- Below `lg`, navigation becomes the full-screen menu. Grids stack with the text first, buttons go full width in the hero, and the launch track shortens labels to W1/W2/W3.

## Accessibility
- WCAG AA contrast for all text (pairs above); 3:1 for control borders.
- Visible 2px teal focus ring on every interactive element (global rule in `globals.css`).
- Real buttons and links; every input has a visible label. Checkboxes are native inputs behind styled labels.
- Skip link first in the tab order. The menu dialog has `aria-modal`, `inert` while closed, and focus return.
- Tap targets of at least 44px outside running text.
