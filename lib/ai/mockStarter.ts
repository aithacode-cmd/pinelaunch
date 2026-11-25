/**
 * The practice starter: three hand-written layouts, picked by simple word
 * matching, with the student's own title and milestone names filled in.
 *
 * NOT a real reading of the student's project. A real starter is written for
 * one project by the AI. This exists so the Starter stage, its checks and the
 * workspace that follows can be built and tested before the real key exists.
 * The interface labels it as a practice starter.
 *
 * Every piece of student text is reduced to plain letters, numbers and mild
 * punctuation before it is placed in a file, so it can never become markup
 * or code.
 */

import type { ScopePlan } from "../studio/plan";
import type { ProjectFiles } from "../studio/project";
import { starterProblem } from "../studio/starter";

export type StarterShape = "list" | "board" | "play";

/** The milestones as the starter request carries them. */
export interface MilestoneNote {
  week: number;
  title: string;
  tasks: readonly string[];
}

export function pickShape(scope: Pick<ScopePlan, "productType" | "originalIdea" | "coreFeature">): StarterShape {
  const text = `${scope.productType} ${scope.originalIdea} ${scope.coreFeature}`.toLowerCase();
  if (/\b(games?|quiz(zes)?|trivia|puzzles?|flash ?cards?|guess(ing|es)?|play(er|ers|ing)?)\b/.test(text)) return "play";
  if (/\b(dashboards?|stats?|statistics|scores?|progress|charts?|budgets?|habits?|track(s|er|ers|ing)?)\b/.test(text)) return "board";
  return "list";
}

/** Letters, numbers, spaces and mild punctuation only. Safe inside HTML text and inside any comment. */
function plain(text: string, max: number): string {
  const clean = text
    .replace(/https?:\S*/gi, " ")
    .replace(/[^\p{L}\p{N} .,!?:;'-]/gu, " ")
    .replace(/([A-Za-z])\.([A-Za-z])/g, "$1 $2")
    .replace(/-{2,}/g, "-")
    .replace(/\s+/g, " ")
    .trim();
  return clean.length <= max ? clean : clean.slice(0, max - 1).trimEnd() + "…";
}

interface Note {
  n: number;
  title: string;
  first: string;
}

const todo = (note: Note) => `TODO (Milestone ${note.n}): ${note.title}`;

const FALLBACK_NOTES: readonly MilestoneNote[] = [
  { week: 1, title: "Lay out the page", tasks: ["Sketch the page on paper"] },
  { week: 2, title: "Build the main feature", tasks: ["Write down the steps in plain words"] },
  { week: 3, title: "Test it like a stranger", tasks: ["Ask one person to try it"] },
  { week: 4, title: "Finish and tidy", tasks: ["Check every item on your finish list"] },
];

/* ---------- index.html ---------- */

const BODIES: Record<StarterShape, string> = {
  list: `    <section class="panel" aria-labelledby="add-heading">
      <h2 id="add-heading">Add something</h2>
      <form id="add-form">
        <label for="add-input">What do you want to add?</label>
        <div class="row">
          <input id="add-input" type="text" autocomplete="off">
          <button type="submit">Add</button>
        </div>
      </form>
    </section>

    <section class="panel" aria-labelledby="list-heading">
      <h2 id="list-heading">Your list</h2>
      <p id="empty-note" class="quiet">Nothing here yet.</p>
      <ul id="item-list" class="items"></ul>
    </section>`,
  board: `    <section class="cards" aria-label="Summary">
      <article class="card">
        <h2>First number</h2>
        <p class="big" id="card-one">0</p>
      </article>
      <article class="card">
        <h2>Second number</h2>
        <p class="big" id="card-two">0</p>
      </article>
      <article class="card">
        <h2>Third number</h2>
        <p class="big" id="card-three">0</p>
      </article>
    </section>

    <section class="panel" aria-labelledby="detail-heading">
      <h2 id="detail-heading">Details</h2>
      <table class="details">
        <thead>
          <tr><th scope="col">Name</th><th scope="col">Value</th></tr>
        </thead>
        <tbody id="detail-rows"></tbody>
      </table>
      <p id="empty-note" class="quiet">No entries yet.</p>
      <button id="add-entry" type="button">Add an entry</button>
    </section>`,
  play: `    <section class="scorebar" aria-label="Score">
      <p>Score <span class="big" id="score">0</span></p>
      <p>Round <span class="big" id="round">0</span></p>
    </section>

    <section class="stage" id="play-area" aria-live="polite">
      <p id="prompt">Press Start to begin.</p>
    </section>

    <div class="row">
      <button id="start-button" type="button">Start</button>
      <button id="next-button" type="button" disabled>Next</button>
    </div>`,
};

function html(shape: StarterShape, title: string, lede: string, first: Note): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="top">
    <h1>${title}</h1>
    <p class="lede">${lede}</p>
  </header>

  <!-- ${todo(first)} -->
  <!-- Start with: ${first.first} -->
  <main>
${BODIES[shape]}
  </main>

  <footer class="foot">
    <p id="status" role="status">This is your starter. The page opens, but the main feature is yours to build.</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>
`;
}

/* ---------- styles.css ---------- */

const ACCENTS: Record<StarterShape, string> = { list: "#2f6f4f", board: "#2c5d8a", play: "#8a4b2c" };

const SHAPE_CSS: Record<StarterShape, string> = {
  list: `/* The list of things that were added. */
.items {
  list-style: none;
  margin: 0;
  padding: 0;
}

.items li {
  padding: var(--gap) 0;
  border-bottom: 1px solid var(--line);
}`,
  board: `/* The row of summary cards. */
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap);
  margin-bottom: var(--gap);
}

.card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: var(--gap);
}

.card h2 {
  font-size: 0.9rem;
  color: var(--muted);
}

/* The table under the cards. */
.details {
  width: 100%;
  border-collapse: collapse;
}

.details th,
.details td {
  text-align: left;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--line);
}`,
  play: `/* The score at the top. */
.scorebar {
  display: flex;
  gap: calc(var(--gap) * 2);
  margin-bottom: var(--gap);
}

/* The area where the game happens. */
.stage {
  min-height: 12rem;
  display: grid;
  place-items: center;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  margin-bottom: var(--gap);
  font-size: 1.25rem;
}`,
};

function css(shape: StarterShape, title: string, second: Note): string {
  return `/* ${title}: styles.css */

/* Colors and sizes used everywhere. Change one here and it changes on the whole page. */
:root {
  --bg: #f6f5f1;
  --panel: #ffffff;
  --ink: #1d1f1e;
  --muted: #5f6562;
  --line: #d9d8d2;
  --accent: ${ACCENTS[shape]};
  --radius: 10px;
  --gap: 1rem;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: calc(var(--gap) * 2);
  background: var(--bg);
  color: var(--ink);
  font-family: system-ui, sans-serif;
  line-height: 1.5;
}

.top,
main,
.foot {
  max-width: 44rem;
  margin: 0 auto;
}

h1 {
  margin: 0;
  font-size: 2rem;
  line-height: 1.15;
}

h2 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.lede {
  margin: 0.5rem 0 calc(var(--gap) * 2);
  color: var(--muted);
}

.quiet {
  color: var(--muted);
}

.big {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: var(--gap);
  margin-bottom: var(--gap);
}

.row {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

input,
button {
  font: inherit;
  padding: 0.6rem 0.8rem;
  border-radius: var(--radius);
  border: 1px solid var(--line);
}

input {
  flex: 1;
}

button {
  background: var(--accent);
  border-color: var(--accent);
  color: #ffffff;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: default;
}

input:focus-visible,
button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.foot {
  margin-top: calc(var(--gap) * 2);
  color: var(--muted);
  font-size: 0.9rem;
}

/* ${todo(second)} */
/* Start with: ${second.first} */

${SHAPE_CSS[shape]}
`;
}

/* ---------- script.js ---------- */

function later(rest: readonly Note[]): string {
  if (rest.length === 0) return "";
  const lines = rest.map((note) => `// ${todo(note)}\n//   Start with: ${note.first}`);
  return `\n// What comes after that, in the order of your plan:\n${lines.join("\n")}\n`;
}

function script(shape: StarterShape, title: string, core: string, main: Note, rest: readonly Note[]): string {
  const head = `// ${title}: script.js
// This file is where the page starts doing things.
// Right now it only finds the parts of the page and listens for a press.
`;
  const mainNote = `// ${todo(main)}
//   Start with: ${main.first}
// The main job of this project: ${core}`;

  if (shape === "board") {
    return `${head}
// The parts of the page this script works with.
const cardOne = document.querySelector("#card-one");
const cardTwo = document.querySelector("#card-two");
const cardThree = document.querySelector("#card-three");
const detailRows = document.querySelector("#detail-rows");
const emptyNote = document.querySelector("#empty-note");
const addEntryButton = document.querySelector("#add-entry");
const statusLine = document.querySelector("#status");

// Everything the page is keeping track of lives in this list.
const entries = [];

// Runs when the button is pressed.
addEntryButton.addEventListener("click", function () {
  addEntry();
});

${mainNote}
function addEntry() {
  // This runs, but it does not add anything yet. That part is yours.
  statusLine.textContent = "You pressed Add an entry. Nothing is added yet: build that next.";
}

// Works out the three numbers at the top from the entries list.
function showSummary() {
  // Nothing here yet. Decide what each of the three numbers should mean first.
}

// Shows every entry as a row in the table.
function showDetails() {
  // Nothing here yet.
}
${later(rest)}`;
  }

  if (shape === "play") {
    return `${head}
// The parts of the page this script works with.
const startButton = document.querySelector("#start-button");
const nextButton = document.querySelector("#next-button");
const promptLine = document.querySelector("#prompt");
const scoreValue = document.querySelector("#score");
const roundValue = document.querySelector("#round");
const statusLine = document.querySelector("#status");

// What the game is keeping track of.
let score = 0;
let round = 0;

// Runs when a button is pressed.
startButton.addEventListener("click", function () {
  startGame();
});
nextButton.addEventListener("click", function () {
  nextRound();
});

// Puts the score and the round number on the page.
function showScore() {
  scoreValue.textContent = String(score);
  roundValue.textContent = String(round);
}

${mainNote}
function startGame() {
  score = 0;
  round = 0;
  showScore();
  // This runs, but there is nothing to play yet. That part is yours.
  promptLine.textContent = "The game has started, but there is nothing to play yet.";
  statusLine.textContent = "You pressed Start. Build the first round next.";
}

// Moves on to the next round.
function nextRound() {
  // Nothing here yet.
}

// Decides whether an answer or a move was right.
function checkAnswer(answer) {
  // Nothing here yet.
}
${later(rest)}`;
  }

  return `${head}
// The parts of the page this script works with.
const addForm = document.querySelector("#add-form");
const addInput = document.querySelector("#add-input");
const itemList = document.querySelector("#item-list");
const emptyNote = document.querySelector("#empty-note");
const statusLine = document.querySelector("#status");

// Everything the page is keeping track of lives in this list.
const items = [];

// Runs when the form is sent.
addForm.addEventListener("submit", function (event) {
  event.preventDefault();
  addItem(addInput.value);
});

${mainNote}
function addItem(text) {
  // This runs, but it does not add anything yet. That part is yours.
  statusLine.textContent = "You pressed Add. Nothing is added yet: build that next.";
}

// Shows everything in the items list on the page.
function showItems() {
  // Nothing here yet. Decide what one item should look like on the page first.
}
${later(rest)}`;
}

/* ---------- putting it together ---------- */

/**
 * The practice starter. A milestone title the student typed could, in rare
 * cases, name something the checks refuse (such as a network feature). Then
 * the same layout is made with plain titles instead, so practice mode never
 * fails on the student's own wording.
 */
export function cannedStarter(scope: ScopePlan, milestones: readonly MilestoneNote[]): { files: ProjectFiles } {
  const source = milestones.length >= 3 ? milestones : FALLBACK_NOTES;
  const first = buildStarter(scope, source);
  if (!starterProblem(first.files, source.length)) return first;
  const plainNotes = source.map((m, i) => ({ week: m.week, title: `Milestone ${i + 1}`, tasks: ["Read this milestone in your plan"] }));
  return buildStarter(
    { ...scope, projectTitle: "My project", projectGoal: "A first version that does one thing well.", coreFeature: "its one main job" },
    plainNotes,
  );
}

function buildStarter(scope: ScopePlan, source: readonly MilestoneNote[]): { files: ProjectFiles } {
  const notes: Note[] = source.map((m, i) => ({
    n: i + 1,
    title: plain(m.title, 70) || "Next step",
    first: plain(m.tasks[0] ?? "", 90) || "Decide the smallest first step",
  }));

  const first = notes[0];
  const second = notes[1];
  // The main-feature note goes on the main function: the first week 2 milestone that is not already placed.
  const mainIndex = source.findIndex((m, i) => i >= 2 && m.week === 2);
  const main = notes[mainIndex >= 2 ? mainIndex : 2];
  const rest = notes.filter((note) => note !== first && note !== second && note !== main);

  const shape = pickShape(scope);
  const title = plain(scope.projectTitle, 60) || "My project";
  const lede = plain(scope.projectGoal, 200) || "A first version that does one thing well.";
  const core = plain(scope.coreFeature, 150) || "its one main job";

  return {
    files: {
      "index.html": html(shape, title, lede, first),
      "styles.css": css(shape, title, second),
      "script.js": script(shape, title, core, main, rest),
    },
  };
}
