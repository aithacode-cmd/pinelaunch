# Visual direction (for approval, 2026-11-14)

> Outcome (2026-11-15): the founder ran this direction through Base44 and
> chose its output as the final design. The site is now rebuilt from that
> build; see `design/base44/README.md`. This document is kept as the
> record of how the direction was reached. Where the two differ, the
> Base44 screenshots in `design/base44/shots/` win.

## The idea in one line

"One project, three states." Every student makes one thing. The site shows
that one thing moving from a sketch (Idea) to a working screen (Build) to a
live page with a link (Launch). That story is the hero, the timeline, the
dashboard and the week pages. Nothing on the site is decoration.

## What changed from the rejected version

| Rejected | Proposed |
|---|---|
| Rotating rings, node graph, floating fragments | Three real mockups of one student project, numbered 01/02/03 |
| Full-page grid wash plus glows | Six faint column rules in the hero only, flat surfaces elsewhere |
| Same rounded panel everywhere | Alternating layouts: editorial split, hairline list, timeline, figure grid, filled panel, reading column |
| Showcase of bars and lines | Four believable interfaces with readable text, each labeled as a figure and as an example |
| Three stacked chevrons | One triangle over one bar; a one-color wordmark |
| Fade-and-rise on every section | One hero entrance (cards settle in order 01, 02, 03), state changes inside panels, progress fills, page fade |

## Brand (revised 2026-11-14 after review: "simpler, more commercial")

One triangle over one bar. The triangle is the pine, the arrow and the
launch; the bar is the pad it has just left. Two shapes, nothing to lose at
16 px. Wordmark "PineLaunch" in Space Grotesk Medium, -3% tracking, one
color. Files in `design/brand/`; sheet in `design/mockups/brand.html`. The
earlier tiered pine, rocket pine and P monogram are kept on the sheet for
the record and are not recommended.

## System (revised: black and grey, pine as a hint)

The founder reviewed the first pass and asked for less green. Surfaces are
now neutral: page #0B0B0B, hero and header #050505, panels #121212 /
#181818 / #202020, lines #1E1E1E / #2A2A2A / #3A3A3A, text #F4F4F4 /
#B9B9B9 / #8A8A8A. Pine (#7EA889, highlight #A2C5AA, deep #315F43) appears
only on the mark, the primary button, checked boxes, the current timeline
node, live indicators and one key number. Nothing else is tinted. The
brief's green-tinted tokens are superseded by this decision. Type and radii
unchanged: Space Grotesk above 22 px, Manrope for reading, IBM Plex Mono for
labels; radii 6 / 10 / 14 / 20 / 28; max content width 1200; gutters 20 on
phones, 96 at 1440.

## Homepage (desktop 1440, mobile 390)

Header, hero with the three-state figure, tools strip, who it is for,
three-week timeline (each stage shows a small real object: a Project Card, a
feature checklist, a live URL bar), showcase (App, Website, Tool, Game),
what you leave with, who runs this, closing call to action, footer. The
mobile layout stacks the three states vertically and turns the timeline into
a left-rail list. Artboards: `design/mockups/homepage.html`; screenshots in
`design/mockups/shots/`.

## Motion plan (to build after approval)

1. Hero entrance: headline and copy fade up once, then the three cards
   settle in order with 120 ms steps. Runs once per visit.
2. Tools strip: continuous scroll, pause button, stops under reduced motion.
3. Timeline: the track fills from 01 toward the current week when it scrolls
   into view. On the dashboard the fill is the student's own progress.
4. Showcase figures: hover lifts the figure 2 px and brightens the border.
5. Page transitions: 180 ms fade.
6. No infinite rotation anywhere.

## Figma status

File: https://www.figma.com/design/O3yUp00qIEQQT7vXvMCrdo (team "Rithwik
Aitha's team", Starter plan). The brand page is built there (marks at six
sizes, light version, wordmark component, lockups, icon tiles, construction
note) and the three-page structure exists. The Starter plan with a View seat
allows 20 MCP tool calls per month; they were used up on 2026-11-14 while
building the brand page, so the design-system board and the homepage
artboards could not be pushed to Figma yet. They are complete as HTML
artboards and can be imported with `html_to_figma` when calls are available
again (next month, or after an upgrade to a Professional plan with a Full
seat, which allows 200 calls a day).
