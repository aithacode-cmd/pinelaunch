"use client";

import { useCallback, useEffect, useState } from "react";
import { checkCode, type AiFailure, type Source, type Usage } from "./aiClient";
import { loadAccessCode, saveAccessCode } from "./db";

export interface UseAccess {
  /** False until the saved code, if any, has been read from this browser. */
  ready: boolean;
  /** The access code in use, or null when none has been entered. */
  code: string | null;
  /** The latest count from the server. The server is the only source of truth. */
  usage: Usage | null;
  /** Who answers AI requests right now: the practice mock or the real AI. */
  source: Source | null;
  aiEnabled: boolean;
  /** True when a code that used to work on this device was turned down by the server. */
  lapsed: boolean;
  /** Checks a typed code with the server and remembers it if it is good. */
  enter: (typed: string) => Promise<AiFailure | null>;
  /** Forgets the code on this device. */
  forget: () => void;
  /** Forgets a code the server no longer accepts, and remembers why the form is back. */
  expire: () => void;
  /** Records the count that came back with an AI answer. */
  noteUsage: (usage: Usage | undefined) => void;
}

/** The student's access code and AI allowance. The code is not an account. */
export function useAccess(): UseAccess {
  const [ready, setReady] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [source, setSource] = useState<Source | null>(null);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [lapsed, setLapsed] = useState(false);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const saved = await loadAccessCode();
      if (!alive) return;
      if (saved) {
        const result = await checkCode(saved);
        if (!alive) return;
        if (result.ok) {
          setCode(saved);
          setUsage(result.usage);
          setSource(result.source);
          setAiEnabled(result.aiEnabled);
        } else if (result.code === "code_invalid" || result.code === "code_inactive") {
          // The saved code no longer works. Ask for a new one.
          void saveAccessCode(null);
          setLapsed(true);
        } else {
          // Offline or a server problem: keep the code and let the student try again.
          setCode(saved);
        }
      }
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const enter = useCallback(async (typed: string): Promise<AiFailure | null> => {
    const cleaned = typed.trim();
    const result = await checkCode(cleaned);
    if (!result.ok) return result;
    await saveAccessCode(cleaned);
    setCode(cleaned);
    setLapsed(false);
    setUsage(result.usage);
    setSource(result.source);
    setAiEnabled(result.aiEnabled);
    return null;
  }, []);

  const forget = useCallback(() => {
    void saveAccessCode(null);
    setCode(null);
    setUsage(null);
    setSource(null);
    setLapsed(false);
  }, []);

  const expire = useCallback(() => {
    void saveAccessCode(null);
    setCode(null);
    setUsage(null);
    setSource(null);
    setLapsed(true);
  }, []);

  const noteUsage = useCallback((next: Usage | undefined) => {
    if (next) setUsage(next);
  }, []);

  return { ready, code, usage, source, aiEnabled, lapsed, enter, forget, expire, noteUsage };
}
