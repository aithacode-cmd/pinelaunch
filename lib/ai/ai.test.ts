import { describe, expect, it } from "vitest";
import { mockProvider } from "./mock";
import { getProvider, providerNameFromEnv } from "./provider";
import { AI_TASKS, AiConfigError, AiTaskNotSupportedError, parseMentorHint, type AiRequest } from "./types";

function ask(question: string, task: AiRequest["task"] = "mentor"): AiRequest {
  return { task, system: "You are a coding mentor.", messages: [{ role: "user", content: question }], maxOutputTokens: 600 };
}

describe("the provider switch", () => {
  it("uses the mock while developing when nothing is set", () => {
    expect(providerNameFromEnv({})).toBe("mock");
    expect(providerNameFromEnv({ NODE_ENV: "development" })).toBe("mock");
    expect(getProvider({}).name).toBe("mock");
  });

  it("uses the mock when asked, in any letter case", () => {
    expect(providerNameFromEnv({ AI_PROVIDER: "mock" })).toBe("mock");
    expect(providerNameFromEnv({ AI_PROVIDER: " Mock " })).toBe("mock");
  });

  it("switches to the real provider with that one setting", () => {
    expect(providerNameFromEnv({ AI_PROVIDER: "anthropic" })).toBe("anthropic");
    expect(providerNameFromEnv({ AI_PROVIDER: "anthropic", NODE_ENV: "production" })).toBe("anthropic");
  });

  it("refuses a setting it does not know", () => {
    expect(() => providerNameFromEnv({ AI_PROVIDER: "gemini" })).toThrow(AiConfigError);
  });

  it("refuses practice answers on the live site, set or unset", () => {
    expect(() => providerNameFromEnv({ NODE_ENV: "production" })).toThrow(AiConfigError);
    expect(() => providerNameFromEnv({ NODE_ENV: "production", AI_PROVIDER: "mock" })).toThrow(/development only/);
  });

  it("says plainly that the real provider needs a key, and is not built yet", () => {
    expect(() => getProvider({ AI_PROVIDER: "anthropic" })).toThrow(/ANTHROPIC_API_KEY is not set/);
    expect(() => getProvider({ AI_PROVIDER: "anthropic", ANTHROPIC_API_KEY: "placeholder" })).toThrow(/not built yet/);
  });

  it("never puts the key in an error message", () => {
    const secret = "sk-ant-THIS-MUST-NOT-APPEAR";
    try {
      getProvider({ AI_PROVIDER: "anthropic", ANTHROPIC_API_KEY: secret });
      expect.unreachable();
    } catch (e) {
      expect(String((e as Error).message)).not.toContain(secret);
    }
  });
});

describe("the mock provider", () => {
  it("answers a mentor question with all four parts of a hint", async () => {
    const result = await mockProvider.generate(ask("My button does nothing when I click it"));
    expect(result.provider).toBe("mock");
    expect(result.model).toBe("canned");
    expect(result.usage).toEqual({ inputTokens: 0, outputTokens: 0 });
    const hint = parseMentorHint(result.text);
    expect(hint).not.toBeNull();
    expect(hint!.explanation).toMatch(/button/i);
    for (const part of [hint!.explanation, hint!.hint, hint!.experiment, hint!.check]) {
      expect(part.length).toBeGreaterThan(20);
    }
  });

  it("picks a hint that fits the question", async () => {
    const cases: [string, RegExp][] = [
      ["It says Uncaught ReferenceError: total is not defined", /error message/i],
      ["my chores are gone when I refresh the page", /forgets everything/i],
      ["how do I center the title with css", /CSS rule/i],
      ["I want to show every item in my list", /list/i],
      ["I am stuck and do not know what to do next", /smallest piece/i],
    ];
    for (const [question, expected] of cases) {
      const hint = parseMentorHint((await mockProvider.generate(ask(question))).text)!;
      expect(hint.explanation, question).toMatch(expected);
    }
  });

  it("gives the same answer to the same question every time", async () => {
    const a = await mockProvider.generate(ask("why does my loop skip items"));
    const b = await mockProvider.generate(ask("why does my loop skip items"));
    expect(a.text).toBe(b.text);
  });

  it("answers the last thing the student said", async () => {
    const result = await mockProvider.generate({
      ...ask(""),
      messages: [
        { role: "user", content: "how do I center the title" },
        { role: "assistant", content: "Check the selector." },
        { role: "user", content: "now nothing is saved after a reload" },
      ],
    });
    expect(parseMentorHint(result.text)!.explanation).toMatch(/forgets everything/i);
  });

  it("gives a different, slower hint on a follow-up", async () => {
    const hint = parseMentorHint((await mockProvider.generate(ask("still not working", "mentor-followup"))).text)!;
    expect(hint.explanation).toMatch(/one step at a time/i);
  });

  it("never hands over finished code", async () => {
    const questions = ["button click", "save data", "css color", "error undefined", "loop list", "anything else", "still stuck"];
    for (const q of questions) {
      for (const task of ["mentor", "mentor-followup"] as const) {
        const { text } = await mockProvider.generate(ask(q, task));
        expect(text).not.toMatch(/```|<script|function\s*\(|=>|;\s*\\n/);
      }
    }
  });

  it("answers a starter request (details in lib/studio/starter.test.ts), and says clearly when it cannot answer", async () => {
    expect(AI_TASKS).toContain("starter");
    const starter = JSON.parse((await mockProvider.generate(ask("x", "starter"))).text);
    expect(Object.keys(starter.files).sort()).toEqual(["index.html", "script.js", "styles.css"]);
    await expect(mockProvider.generate(ask("x", "made-up" as AiRequest["task"]))).rejects.toBeInstanceOf(AiTaskNotSupportedError);
  });
});

describe("parseMentorHint", () => {
  const good = { explanation: "Because.", hint: "Look here.", experiment: "Try this.", check: "See that." };

  it("accepts a complete hint", () => {
    expect(parseMentorHint(JSON.stringify(good))).toEqual(good);
  });

  it("rejects anything that is not a complete hint, without throwing", () => {
    const bad = [
      "",
      "not json",
      "[]",
      "null",
      JSON.stringify({ ...good, check: "" }),
      JSON.stringify({ ...good, hint: 5 }),
      JSON.stringify({ explanation: "only one field" }),
      JSON.stringify({ ...good, experiment: "x".repeat(5000) }),
    ];
    for (const text of bad) expect(parseMentorHint(text), text.slice(0, 30)).toBeNull();
  });
});
