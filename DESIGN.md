# PineLaunch design system: Night to launch

Adopted 2026-11-25 (v2). Replaces the "Workbench" system from earlier the same day, and the dark Base44 system of 2026-11-15. `design/base44/` is a frozen record of the old design, not a reference to match. Direction notes and references: owner review of Spark, Stay22, Alister, MusicWave, MarkAge360 and apple.com, 2026-11-25.

## Identity
An idea starts at night; launch day is sunrise. Public pages scroll from a night sky (the idea), through dawn (the build), to a cream morning and a sunrise close (the launch). Working pages (dashboard, weeks, start, prompts, launch) sit on calm cream, so students can focus.

- **Teen beginner:** playful and warm, never childish; one clear next thing.
- **Parent:** honest, calm and free of hype; the facts are easy to find.

### Principles
1. **The program's story is the colour story.** Night to sunrise is the three weeks. Don't recolour sections at random.
2. **One next thing.** The dashboard leads with "Next step"; week pages open only the next unfinished step.
3. **Bold type, plain words.** Headlines are big and heavy (Bricolage Grotesque 800); text stays plain and short.
4. **Pills for actions.** Every button and the nav are pills. Bright coral is the main action, ink is the second, outline is the third.
5. **Art is scenery, never decoration behind text.** Illustrations sit in their own frames or below the copy.
6. **Motion marks progress.** Ticks burst, badges pop and tracks fill like a sunrise. Nothing distracting loops on working pages.

## Colour tokens (`app/globals.css`, `@theme`)
| Token | Value | Role |
|---|---|---|
| `ground` | `#FFF7EF` | Cream page background (working pages, light sections) |
| `band` | `#F6EADF` | Alternate band, footer |
| `surface` / `surface-2` / `surface-3` | `#FFFFFF` / `#FBEFE4` / `#F1E2D5` | Cards, insets, tracks |
| `line` / `line-2` | `#EFDFD2` / `#E3CFC0` | Hairlines |
| `line-3` | `#8A7799` | Control borders (3.8:1 on cream) |
| `ink` / `ink-2` / `ink-3` | `#1C1238` / `#4B3F66` / `#6A5B80` | Text (plum) |
| `coral` / `coral-hi` | `#FF7A59` / `#FF9472` | **Filled actions only** (buttons, Start pill, logo) |
| `on-coral` | `#2A0D05` | Text on coral (7.1:1) |
| `accent` / `accent-strong` | `#B8361A` / `#962C14` | Coral for **text**, ticks, focus ring (4.6:1 on surface-3) |
| `accent-soft` | `#FFE3D6` | Tints |
| `night` / `night-2` / `violet` | `#120B2E` / `#1D1347` / `#3B2683` | Night sky |
| `magenta` / `dawn` / `peach` | `#B4458C` / `#F08A7A` / `#FBD2B4` | Dawn gradient |
| `pine` | `#0F3B35` | Pine silhouettes |
| `on-night` / `on-night-2` | `#EFE9FF` / `#C9BFEE` | Text on night (`on-night-2` is 6.8:1 on violet) |
| `danger` / `warning` (+ `-soft`) | `#B3261E` / `#8A5A00` | States |

Never put bright `coral` text on cream (2.4:1); use `accent` instead. Colour-block project cards use fixed tints (lilac `#E9E1FF`, coral `#FFE3D6`, amber `#FDE7C8`, pine `#D9EFE9`) with ink text.

## Typography
| Role | Face | Setting |
|---|---|---|
| Hero h1 | Bricolage Grotesque 800 | `clamp(60px, 11vw, 152px)`, line-height 0.9, tracking -0.045em; last word coral |
| Section h2 | Bricolage Grotesque 800 | 38 / 48 / 64px, line-height 1, tracking -0.04em |
| Card titles | Bricolage Grotesque 700 | 20–28px |
| Text | Figtree 400/500/600 | 16–20px, line-height 1.5–1.65 |
| Labels, data | JetBrains Mono 500 | 11.5–13px uppercase via `<Mono>` |

All fonts are self-hosted by `next/font`.

## Shape and spacing
- Radius: pills (`rounded-full`) for buttons and nav; 22px app cards; 28px home cards; 36px feature panels; 6px checkboxes.
- Container: `.pl-shell` (max 1400px; 20 / 32 / 56px side padding).
- Home sections: 64–96px vertical padding; headings 7 columns, copy 5.

## Art
- **Drawn in code** (`components/home/NightHero.tsx`, `HubSection.tsx`): sparkle stars, pine ridges, the beacon, the animated hub. Use these for anything that sits near text or animates.
- **Generated with ElevenLabs** (Recraft v4.1 Pro Vector, delivered as SVG) in `public/art/`:
  - `week1-night.svg`, `week2-dawn.svg`, `week3-sunrise.svg` (the week cards)
  - `parents-evening.svg` (the parents strip)

  Prompts follow one recipe: "flat vector illustration, square, … bold clean geometric shapes, smooth flat tonal bands, pure scenery, palette indigo / violet / magenta / coral / cream / dark pine green, friendly modern editorial illustration style". The files carry a C2PA provenance tag that marks them as AI-generated.
- The owner lifted the 2026-11-18 "no AI illustrations" rule for these ElevenLabs scenes on 2026-11-25. It still applies to 3D renders and to anything that could pass as a real student or real result.
- Scenes are decorative (`alt=""`); the text next to them carries the meaning.

## Components
- **Header:** a floating cream pill (logo plus links; the active link is an ink pill) and a separate coral pill that reads "Start" (`/start`) for new visitors and "Continue" (`/dashboard`) once a Project Card exists. Phones get a full-screen night menu.
- **Buttons** (`Button.tsx`): pills with a 44px minimum height. `primary` (coral), `outline`, `quiet`, `ghost`. All use `.pl-press`.
- **Hero CTA:** a coral pill with an arrow circle inside.
- **Hub** (`HubSection`): the project in the middle, tools on the left, launch steps on the right; it stacks vertically below `lg`.
- **Week cards:** framed scene, launch track, title, line, "Open week" link.
- **Project Card:** ink header with a coral type tag, white body.
- **Steps:** the next step is a white card with a coral rule; the others are one line with a 44px Show/Hide.
- **Badges:** earned ones are a coral square that pops in once; locked ones are dashed.

## Motion
| Moment | Where | Spec |
|---|---|---|
| Hero entrance | NightHero | `.pl-rise` 0.6s, once |
| Twinkling stars | NightHero | `.pl-twinkle` 3.6s loop, decorative |
| Beacon glow | NightHero | `.pl-beam` 4s opacity loop |
| Hub pulses and ring | HubSection | `.pl-pulse` 2.8s along each line; `.pl-ring` around the core |
| Tick burst | StepItem, HomeworkDemo | `<Burst>`: 6 sparkles, 520ms, once per tick |
| Badge pop | Dashboard | `.pl-pop` 420ms on earned badges |
| Sunrise fill | Launch tracks | width transition 500ms, magenta to coral to amber |
| Press | every button | scale 0.97, 160ms |

Loops live only on the public night and dawn sections; working pages get one-shot moments. **`prefers-reduced-motion` stops every animation and transition listed above.**

## Responsive
Tailwind breakpoints: `sm` 640, `lg` 1024. Verified at 1440, 768 and 390px with no sideways scroll. Below `lg`: the menu becomes a full-screen night sheet, the hub stacks, and grids collapse with text first.

## Accessibility
- WCAG AA contrast for all text (pairs above, also listed at the top of `globals.css`).
- Visible 2px focus ring in `accent`.
- 44px tap targets outside running text.
- Real buttons and links; labelled inputs.
- Skip link first in the tab order.
- The menu dialog uses `aria-modal` and `inert` while closed.
- Scenes are hidden from screen readers.
