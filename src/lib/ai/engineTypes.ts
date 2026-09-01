import { StructuredBlock } from "../types";

export type Depth = "act" | "explore" | "deep_dive";

export interface EngineResult {
  content: string;
  suggestions: string[];
  blocks?: StructuredBlock[];
  pathwayTags: string[];
  resolved: boolean;
}
