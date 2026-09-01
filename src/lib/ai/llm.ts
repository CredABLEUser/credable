import { CREDABLE_SYSTEM_PROMPT } from "./prompts";

export interface LlmMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Optional real-LLM hook. If ANTHROPIC_API_KEY is set in the environment,
 * this calls the Claude API using the CredABLE system prompt plus whatever
 * financial context string the caller supplies. If no key is set, it
 * returns null and the caller (see ../ai/engine.ts) falls back to the
 * built-in rule-based reasoning engine, so the app works out of the box
 * with no external dependency.
 *
 * To go live: set ANTHROPIC_API_KEY in your environment (e.g. .env.local)
 * and nothing else needs to change — the app will start using real model
 * responses automatically.
 */
export async function callLlm(
  contextBlock: string,
  history: LlmMessage[]
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
        max_tokens: 700,
        system: `${CREDABLE_SYSTEM_PROMPT}\n\nCURRENT USER CONTEXT:\n${contextBlock}`,
        messages: history,
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const text = json?.content?.[0]?.text;
    return typeof text === "string" ? text : null;
  } catch {
    return null;
  }
}
