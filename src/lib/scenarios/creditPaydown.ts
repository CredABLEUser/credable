import { ScenarioDef } from "./types";
import { fmt, num, pct } from "./math";

function scoreBand(utilization: number): string {
  if (utilization <= 10) return "generally the strongest utilization band";
  if (utilization <= 30) return "generally a healthy range";
  if (utilization <= 50) return "starting to create real pressure";
  if (utilization <= 75) return "high enough to meaningfully suppress most scores";
  return "very high — likely one of the biggest drags on the score right now";
}

export const creditPaydownScenario: ScenarioDef = {
  type: "credit_paydown",
  label: "Credit Paydown / Utilization Strategy",
  question: "How should I use my cash to improve my credit?",
  fields: [
    { key: "totalBalance", label: "Total revolving balance across cards", type: "number", defaultValue: 0 },
    { key: "totalLimit", label: "Total credit limit across cards", type: "number", defaultValue: 0 },
    { key: "availableCash", label: "Cash available to pay down", type: "number", defaultValue: 0 },
  ],
  compute: (inputs) => {
    const balance = num(inputs.totalBalance);
    const limit = num(inputs.totalLimit);
    const cash = num(inputs.availableCash);

    const currentUtil = limit > 0 ? (balance / limit) * 100 : 0;
    const newBalance = Math.max(balance - cash, 0);
    const newUtil = limit > 0 ? (newBalance / limit) * 100 : 0;

    return {
      headline: `Utilization: ${pct(currentUtil)} → ${pct(newUtil)}`,
      interpretation:
        currentUtil > 30 && newUtil <= 30
          ? "Moving under 30% overall utilization is often where the biggest, fastest score improvement shows up — this looks like a strong use of that cash."
          : currentUtil - newUtil > 15
          ? "That's a meaningful drop in utilization. The exact score impact depends on your full file, but this direction reliably helps."
          : "This helps, but if the goal is maximum near-term score impact, paying down the single highest-utilization card first (rather than spreading it evenly) is often more effective than the blended number alone suggests.",
      groups: [
        {
          title: "Utilization",
          lines: [
            { label: "Before", value: pct(currentUtil), note: scoreBand(currentUtil) },
            { label: "After", value: pct(newUtil), emphasis: true, note: scoreBand(newUtil) },
          ],
        },
        {
          title: "Balances",
          lines: [
            { label: "Current total balance", value: fmt(balance) },
            { label: "Cash applied", value: fmt(cash) },
            { label: "Remaining balance", value: fmt(newBalance) },
          ],
        },
        {
          title: "Good to know",
          lines: [
            { label: "This is a directional estimate", value: "Not a guaranteed score" },
            { label: "Individual card utilization also matters", value: "Not just the blended total" },
          ],
        },
      ],
    };
  },
};
