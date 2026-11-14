/**
 * Fills {{placeholders}} in prompts, steps and examples from the Project Card.
 * With no card, each placeholder becomes a plain hint in square brackets so the
 * text still reads well and the student knows what to type.
 */

import { program } from "@/config/program";
import type { ProjectCard, ProjectType } from "./storage";

export const typeLabels: Record<ProjectType, string> = {
  app: "app",
  website: "website",
  tool: "tool",
  game: "game",
};

/** One-sentence pitch built from the card. */
export function cardPitch(card: ProjectCard): string {
  const name = card.name.trim() || "This project";
  const type = typeLabels[card.type];
  const audience = card.audience.trim() || "someone specific";
  const job = card.coreJob.trim().replace(/[.]+$/, "") || "does one useful thing";
  return `${name} is ${withArticle(type)} for ${audience} that ${lowerFirst(job)}.`;
}

function withArticle(word: string): string {
  return (/^[aeiou]/i.test(word) ? "an " : "a ") + word;
}

function lowerFirst(s: string): string {
  return s.length ? s[0].toLowerCase() + s.slice(1) : s;
}

const hints: Record<string, string> = {
  projectName: "[your project name]",
  pitch: "[your one-sentence pitch]",
  audience: "[who it is for]",
  coreJob: "[the one thing it must do]",
  feature1: "[feature 1]",
  feature2: "[feature 2]",
  feature3: "[feature 3]",
  tool: "[your build tool]",
};

export function fillPlaceholders(text: string, card: ProjectCard | null): string {
  const values: Record<string, string> = card
    ? {
        projectName: card.name.trim() || hints.projectName,
        pitch: cardPitch(card),
        audience: card.audience.trim() || hints.audience,
        coreJob: card.coreJob.trim() || hints.coreJob,
        feature1: card.features[0]?.trim() || hints.feature1,
        feature2: card.features[1]?.trim() || hints.feature2,
        feature3: card.features[2]?.trim() || hints.feature3,
        tool: program.tools[card.tool].name,
      }
    : hints;

  return text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => values[key] ?? match);
}

/** Plain-text version of the card for the "Copy card" button. */
export function cardAsText(card: ProjectCard): string {
  return [
    `Project: ${card.name}`,
    `Pitch: ${cardPitch(card)}`,
    `For: ${card.audience}`,
    `Features:`,
    `1. ${card.features[0]}`,
    `2. ${card.features[1]}`,
    `3. ${card.features[2]}`,
    `Tool: ${program.tools[card.tool].name}`,
  ].join("\n");
}
