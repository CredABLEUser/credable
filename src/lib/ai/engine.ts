import { buildContextSummary, UserContext } from "./context";
import { routeMessage } from "./rules";
import { Depth, EngineResult } from "./engineTypes";
import { callLlm, LlmMessage } from "./llm";

export interface GenerateInput {
  message: string;
  history: LlmMessage[];
  ctx: UserContext;
  depth: Depth;
  turn: number;
}

export async function generateResponse(input: GenerateInput): Promise<EngineResult> {
  const ruleResult = routeMessage(input.message, input.ctx, input.depth, input.turn);

  // If a real LLM is configured, prefer its prose but keep the rule engine's
  // structured suggestions/blocks/pathway tags so the UI stays interactive.
  const contextBlock = buildContextSummary(input.ctx);
  const llmText = await callLlm(contextBlock, [...input.history, { role: "user", content: input.message }]);

  if (llmText) {
    return { ...ruleResult, content: llmText };
  }
  return ruleResult;
}

export { buildContextSummary };
export type { EngineResult, Depth };
