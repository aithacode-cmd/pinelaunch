/**
 * The starter project: the three files a student begins with, and the checks
 * every starter must pass before it can be saved.
 *
 * Shared by the server (to check what the AI returned) and the browser (to
 * check again before saving). Nothing here is secret.
 *
 * A starter is a beginning, not a finished app. It may not load anything
 * from outside the three files, may not talk to the network, and may not hold
 * anything that looks like a key. A starter that fails a check is rejected
 * whole. It is never trimmed or repaired into something misleading.
 */

import { z } from "zod";
import { MilestoneSchema } from "./plan";
import { FILE_NAMES, type FileName, type ProjectFiles } from "./project";

/** Each file must be big enough to be real and small enough to still be a starting point. */
export const STARTER_LIMITS: Record<FileName, { min: number; max: number }> = {
  "index.html": { min: 200, max: 12_000 },
  "styles.css": { min: 150, max: 12_000 },
  "script.js": { min: 150, max: 12_000 },
};
export const STARTER_MAX_TOTAL = 30_000;
/** A starter must point at the student's milestones in at least this many places. */
export const STARTER_MIN_TODOS = 3;

/** The milestones a starter request carries: the student's map, which they may have edited. Same limits as a map. */
export const StarterMilestonesSchema = z.array(MilestoneSchema).min(4).max(12);

const TODO_MARK = /TODO \(Milestone (\d+)\)/g;

export interface TodoNote {
  file: FileName;
  /** 1-based, matching the order of the milestone map. */
  milestone: number;
  text: string;
}

/** Every "TODO (Milestone N): ..." note in the files, in reading order. */
export function findTodos(files: ProjectFiles): TodoNote[] {
  const notes: TodoNote[] = [];
  for (const file of FILE_NAMES) {
    for (const line of files[file].split("\n")) {
      const match = line.match(/TODO \(Milestone (\d+)\):?\s*(.*)$/);
      if (!match) continue;
      const text = match[2].replace(/\s*(-->|\*\/)\s*$/, "").trim();
      notes.push({ file, milestone: Number(match[1]), text });
    }
  }
  return notes;
}

/* ---------- the checks ---------- */

/** Things that look like a key, token or password. A starter must hold none. */
const CREDENTIAL_PATTERNS: readonly RegExp[] = [
  /\bsk-[A-Za-z0-9_-]{16,}/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bAIza[0-9A-Za-z_-]{20,}/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bBearer\s+[A-Za-z0-9._-]{20,}/,
  // Long enough that a game's secret word does not trip it.
  /\b(api[_-]?key|secret|token|password|passwd)\b\s*[:=]\s*["'`][^"'`\s]{16,}["'`]/i,
];

/** Ways a script could reach outside the three files or run text as code. */
const SCRIPT_BANS: readonly { pattern: RegExp; what: string }[] = [
  { pattern: /^\s*import\s/m, what: "import statements" },
  { pattern: /\bimport\s*\(/, what: "import()" },
  { pattern: /\brequire\s*\(/, what: "require()" },
  { pattern: /\bimportScripts\b/, what: "importScripts" },
  { pattern: /\bfetch\s*\(/, what: "fetch()" },
  { pattern: /\bXMLHttpRequest\b/, what: "XMLHttpRequest" },
  { pattern: /\bWebSocket\b/, what: "WebSocket" },
  { pattern: /\bEventSource\b/, what: "EventSource" },
  { pattern: /\bsendBeacon\b/, what: "sendBeacon" },
  { pattern: /\beval\s*\(/, what: "eval()" },
  { pattern: /\bnew\s+Function\b/, what: "new Function" },
  { pattern: /\bdocument\s*\.\s*write/, what: "document.write" },
  { pattern: /\bwindow\s*\.\s*open\s*\(/, what: "window.open" },
  { pattern: /\blocation\s*\.\s*(href|assign|replace)\b|\blocation\s*=[^=]/, what: "changing the page address" },
  // Saving is added by the student in a later milestone, through the workspace's own saving. A starter that
  // used the browser's storage directly would break inside the sandboxed preview. A note that only names
  // it is fine; using it is not.
  { pattern: /\b(localStorage|sessionStorage)\s*[.[]|\bindexedDB\s*\.|\bdocument\s*\.\s*cookie\b/, what: "browser storage" },
  { pattern: /<\s*script/i, what: "script tags written from JavaScript" },
];

function count(text: string, pattern: RegExp): number {
  return (text.match(pattern) ?? []).length;
}

function htmlProblem(html: string): string {
  if (!/^\s*<!doctype html>/i.test(html)) return "index.html must begin with <!DOCTYPE html>.";
  for (const piece of ["<html", "<head", "</head>", "<body", "</body>", "</html>", "<h1"]) {
    if (!html.toLowerCase().includes(piece)) return `index.html is missing ${piece}${piece.startsWith("</") ? "" : ">"}.`;
  }
  if (!/<html\b[^>]*\blang\s*=/i.test(html)) return "The <html> tag needs a lang attribute.";
  if (!/<meta\b[^>]*\bcharset\s*=/i.test(html)) return "index.html needs a <meta charset> tag.";
  if (!/<title>\s*\S[\s\S]*?<\/title>/i.test(html)) return "index.html needs a <title> with text in it.";

  const links = html.match(/<link\b[^>]*>/gi) ?? [];
  if (links.length !== 1 || !/\brel\s*=\s*["']?stylesheet["']?/i.test(links[0]) || !/\bhref\s*=\s*["']styles\.css["']/i.test(links[0])) {
    return 'index.html must have exactly one <link>, and it must be <link rel="stylesheet" href="styles.css">.';
  }

  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
  if (count(html, /<script\b/gi) !== 1 || scripts.length !== 1) return "index.html must have exactly one <script> tag.";
  const [, attributes, inside] = scripts[0];
  if (!/^\s*src\s*=\s*["']script\.js["'](\s+defer(\s*=\s*["']?defer["']?)?)?\s*$/i.test(attributes) || inside.trim() !== "") {
    return 'The one <script> tag must be <script src="script.js"></script>, with no code inside it.';
  }

  if (/<\s*(style|iframe|frame|object|embed|base|applet|portal)\b/i.test(html)) {
    return "index.html may not use <style>, <iframe>, <object>, <embed> or <base>. Styles belong in styles.css.";
  }
  if (/<meta\b[^>]*http-equiv/i.test(html)) return "index.html may not use <meta http-equiv>.";
  if (/<[^>]*\son[a-z]+\s*=/i.test(html)) return "index.html may not use inline event attributes such as onclick. Events belong in script.js.";

  // Every address in the page must point at one of the three files or at a place on the same page.
  for (const match of html.matchAll(/\b(href|src|action|formaction|srcset|poster|background|ping|data)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
    const value = (match[3] ?? match[4] ?? match[5] ?? "").trim();
    if (value === "styles.css" || value === "script.js" || value.startsWith("#")) continue;
    return "index.html may only point at styles.css, script.js, or a place on the same page.";
  }
  return "";
}

function cssProblem(css: string): string {
  if (/@import\b/i.test(css)) return "styles.css may not use @import.";
  if (/\burl\s*\(/i.test(css)) return "styles.css may not use url(). The starter has no image or font files.";
  if (/\bexpression\s*\(|\bbehavior\s*:|-moz-binding/i.test(css)) return "styles.css uses something that can run code.";
  if (/<\s*\/?\s*(script|style)/i.test(css)) return "styles.css may not contain HTML tags.";
  if (!/:root\s*\{[^}]*--[a-z][\w-]*\s*:/i.test(css)) return "styles.css must set CSS variables inside a :root rule.";
  if (!/var\(\s*--[a-z]/i.test(css)) return "styles.css must use its CSS variables with var().";
  return "";
}

function scriptProblem(js: string): string {
  for (const ban of SCRIPT_BANS) {
    if (ban.pattern.test(js)) return `script.js may not use ${ban.what}.`;
  }
  return "";
}

/**
 * Returns "" when the three files are an acceptable starter, or one short
 * sentence naming the first problem. The sentence never quotes the files, so
 * it is safe to log and to send back to the AI as a correction.
 */
export function starterProblem(files: ProjectFiles, milestoneCount: number): string {
  let total = 0;
  for (const name of FILE_NAMES) {
    const length = files[name].length;
    total += length;
    const { min, max } = STARTER_LIMITS[name];
    if (files[name].trim().length < min) return `${name} is too short to be a real starting point.`;
    if (length > max) return `${name} is too long. A starter is a beginning, not a finished project.`;
  }
  if (total > STARTER_MAX_TOTAL) return "The three files together are too long for a starter.";

  for (const name of FILE_NAMES) {
    const text = files[name];
    if (/\bhttps?:/i.test(text) || /\bdata:[a-z]+\//i.test(text)) {
      return `${name} may not contain web addresses. A starter uses nothing from outside its three files.`;
    }
    if (CREDENTIAL_PATTERNS.some((p) => p.test(text))) return `${name} contains something that looks like a key or a password.`;
  }

  const html = htmlProblem(files["index.html"]);
  if (html) return html;
  const css = cssProblem(files["styles.css"]);
  if (css) return css;
  const js = scriptProblem(files["script.js"]);
  if (js) return js;

  const all = FILE_NAMES.map((n) => files[n]).join("\n");
  const numbers = [...all.matchAll(TODO_MARK)].map((m) => Number(m[1]));
  if (numbers.length < STARTER_MIN_TODOS) {
    return `The starter needs at least ${STARTER_MIN_TODOS} notes written as "TODO (Milestone N): ..." that point at the student's milestones.`;
  }
  if (numbers.some((n) => n < 1 || n > milestoneCount)) return `A TODO note points at a milestone that does not exist. Use numbers 1 to ${milestoneCount}.`;
  if (count(files["script.js"], TODO_MARK) < 1) return "script.js needs at least one TODO (Milestone N) note.";
  return "";
}

const fileText = z.string().max(STARTER_LIMITS["index.html"].max * 2);

/**
 * The shape of a starter answer, for a plan with this many milestones. The
 * file names are fixed: an answer with a missing, extra or renamed file fails.
 */
export function starterSchema(milestoneCount: number) {
  return z
    .strictObject({
      files: z.strictObject({ "index.html": fileText, "styles.css": fileText, "script.js": fileText }),
    })
    .superRefine((value, ctx) => {
      const problem = starterProblem(value.files, milestoneCount);
      if (problem) ctx.addIssue({ code: "custom", message: problem, path: ["files"] });
    });
}
export type Starter = { files: ProjectFiles };
