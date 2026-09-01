import { ScenarioDef } from "./types";
import { debtConsolidationScenario } from "./debtConsolidation";
import { homeAffordabilityScenario } from "./homeAffordability";
import { creditPaydownScenario } from "./creditPaydown";
import { keepVsSellScenario } from "./keepVsSell";

export const SCENARIOS: Record<string, ScenarioDef> = {
  debt_consolidation: debtConsolidationScenario,
  home_affordability: homeAffordabilityScenario,
  credit_paydown: creditPaydownScenario,
  keep_vs_sell: keepVsSellScenario,
};

export const SCENARIO_LIST = Object.values(SCENARIOS);

export * from "./types";
