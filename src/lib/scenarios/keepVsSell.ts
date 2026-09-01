import { ScenarioDef } from "./types";
import { fmt, num, pct } from "./math";

export const keepVsSellScenario: ScenarioDef = {
  type: "keep_vs_sell",
  label: "Keep vs Sell Home",
  question: "Should I keep or sell this house?",
  fields: [
    { key: "value", label: "Current estimated value", type: "number", defaultValue: 0 },
    { key: "mortgageBalance", label: "Remaining mortgage balance", type: "number", defaultValue: 0 },
    { key: "sellingCostPct", label: "Selling costs (% of sale price)", type: "percent", defaultValue: 7, isAssumption: true },
    { key: "monthlyCarry", label: "Current monthly carrying cost", type: "number", defaultValue: 0, help: "Mortgage + taxes + insurance + typical maintenance" },
    { key: "appreciationPct", label: "Assumed annual appreciation", type: "percent", defaultValue: 3, isAssumption: true },
    { key: "years", label: "Years you'd realistically keep it", type: "number", defaultValue: 5 },
  ],
  compute: (inputs) => {
    const value = num(inputs.value);
    const mortgage = num(inputs.mortgageBalance);
    const sellCostPct = num(inputs.sellingCostPct, 7);
    const carry = num(inputs.monthlyCarry);
    const appreciation = num(inputs.appreciationPct, 3);
    const years = Math.max(num(inputs.years, 5), 1);

    const netIfSellNow = value * (1 - sellCostPct / 100) - mortgage;

    const futureValue = value * Math.pow(1 + appreciation / 100, years);
    // very rough: assume mortgage balance declines roughly linearly for illustration
    const roughFutureMortgage = Math.max(mortgage * 0.85, 0);
    const netIfSellLater = futureValue * (1 - sellCostPct / 100) - roughFutureMortgage;
    const totalCarryOverPeriod = carry * 12 * years;

    return {
      headline: `Selling now nets roughly ${fmt(Math.round(netIfSellNow))}`,
      interpretation: `Keeping it for ${years} year${years === 1 ? "" : "s"} at ${pct(appreciation)}/year appreciation could net roughly ${fmt(
        Math.round(netIfSellLater)
      )} if sold then — but that gain assumes appreciation actually happens, and doesn't account for what else that equity could have done elsewhere. You'd also carry about ${fmt(
        Math.round(totalCarryOverPeriod)
      )} in housing costs over that period.`,
      groups: [
        {
          title: "Sell now",
          lines: [
            { label: "Estimated net proceeds", value: fmt(Math.round(netIfSellNow)), emphasis: true },
          ],
        },
        {
          title: `Keep ${years} year${years === 1 ? "" : "s"}, then sell`,
          lines: [
            { label: "Projected value", value: fmt(Math.round(futureValue)), note: `Assumes ${pct(appreciation)}/year — not guaranteed` },
            { label: "Estimated net proceeds then", value: fmt(Math.round(netIfSellLater)), emphasis: true },
            { label: "Housing costs carried in the meantime", value: fmt(Math.round(totalCarryOverPeriod)) },
          ],
        },
        {
          title: "What this depends on most",
          lines: [
            { label: "Appreciation actually happening", value: "Assumption — test 0% too" },
            { label: "You'd otherwise pay similar housing cost renting", value: "Not modeled here" },
          ],
        },
      ],
    };
  },
};
