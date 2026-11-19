# Framer redesign plan: home page (2026-11-18)

Decided with the founder on 2026-11-18, four questions each round.

- Mood: dark, cinematic. Black canvas, pine green as big solid blocks and
  light, motion on dark.
- Core idea in five seconds: one project, three weeks. The hero shows a
  project going from sketch to built to live.
- Motion: scroll-driven story. Fewer, bigger moments. The hero and the
  three-week section change as you scroll.
- Scope: home page first in Framer, review, then inner pages in the same
  style.
- Home page includes one animated section for the post-pilot ladder
  (Launch, Grow, Earn, Level Up) with the parent waitlist button, labelled
  "Coming after the pilot. The pilot is free."
- Hero has a tiny working demo: a three-task homework tracker visitors can
  tick.
- Type: a heavier, tighter display face for huge headlines; Manrope kept
  for reading.
- Destination: Framer is the design tool. The result is rebuilt in the
  Next.js site so it stays free, static and no-data.

## The story the home page tells, top to bottom

0. Loader, under a second: a single pine triangle lifts off a bar (the
   logo drawn as motion), then the page.
1. Hero, full viewport, black. One huge line: "One idea. Three weeks. Live."
   Below it the working demo: a phone-sized homework tracker with three
   tasks. A short note: "Tick one. That is what a first project feels like."
   Two buttons: Start the idea picker, For parents.
2. Pinned scroll scene, the signature. As the visitor scrolls, the same
   object changes state three times, one per week:
   - Week 1, Idea: a paper sketch with "study app?" crossed out and
     "homework tracker" written in. A Project Card slides in beside it.
   - Week 2, Build: the sketch becomes a rough working app, ugly on purpose,
     with one feature ticked, then two, then three.
   - Week 3, Launch: the app sits inside a browser with a real-looking URL,
     a Live dot, and three tester notes landing on it one by one.
   Big numerals 1, 2, 3 change with the scene. Dates and the one-line goal
   for each week sit beside the object. On a phone the scene is three
   stacked frames instead of a pin.
3. "What you could build": four example projects, each a real mini
   interface (app, website, tool, game), on a slow horizontal drift that
   stops when hovered or touched. One plain line: examples, not student
   projects.
4. "Who it is for" in three short lines, large, revealed one at a time:
   13 to 17. Never coded. One small idea.
5. "What you leave with": four lines on a solid pine block, each one
   landing with a tick: a working project, a public link, notes from
   three real testers, a way of working.
6. The ladder: four steps rising left to right, Level 1 lit, the rest dim
   and grey. Label "Coming after the pilot. The pilot is free." One line
   each for Challenge Drops, Parent Report, Build Pass, Season Pass. The
   founding-price line and the waitlist button, with the no-spam line.
7. Who runs this, the privacy sentence, links to the parents page and the
   privacy note. Plain.
8. Closing on pine: "Start with one small idea." and the two buttons.
9. Footer: links, trademark line, privacy link.

## Rules that stay

Only Replit, Base44, ChatGPT, Discord, Google Forms named; no accounts, no
database, no analytics, no iframes; tone plain and short; everything shown
as student work labelled as an example; every motion stops under
prefers-reduced-motion; works at 390 px.

## Status

- 2026-11-18, first pass: home page built in Framer on the "Home" page (desktop and phone).
- 2026-11-18, later: the Framer "Home" page was found replaced by an unrelated studio design ("Intelligence meets imagination", Otherform layout template), not PineLaunch. Nothing was deleted. The visual-heavy version was built on a new page instead:
  - Page: "Home 3D" at `/home-3d` in https://framer.com/projects/C0qYHtHWTYshV2BGGL4M (desktop 1200 and phone 390).
  - Uses the 13 renders from `design/3d/` (uploaded to the project). Renders sit on black; they are blended with `screen` so the black disappears, and the week renders have a soft radial fade.
  - Sections: sticky nav; hero (word-by-word headline, floating Pine Mark, working Homework demo with three Task Row instances); pinned three-week scene (sketch, phone, browser cross-fade by scroll target; stacked on phone); example ticker (four device renders, drag and hover pause); who it is for (three big lines); what you leave with (pine block, chrome checks); after the pilot (ladder render, four levels, four tiles, waitlist button, no-spam line); for parents panel; closing; footer.
  - Links point at https://pinelaunch.vercel.app pages for now.
  - 2026-11-18: Rithwik said yes; the 3D page is now the home page at `/`, and the studio design was moved to `/old-home` (page "Old home (studio design)"). Not done: the 0.8 s opener, a shared layout template, inner pages, publishing.
- 2026-11-18, later: Rithwik found the first 3D pass tacky. Calm-down pass applied through the connector (prompt kept at Second Brain/output/pinelaunch/framer-tweaks-prompt.md): smaller renders, flat panels, no shadows, icon checks, fewer animations, grey numerals, tighter type, even section padding with 1px dividers.
- 2026-11-18, latest: Rithwik rejected the AI renders (tacky, artificial, off-brand). All renders removed from the Framer home page; visuals are now built interface mockups only, matching the brand rule in CLAUDE.md. The 3D set in design/3d/ is unused.
