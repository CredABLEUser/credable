import { ScenarioDef } from "./types";
import { amortizedPayment, totalInterest, fmt, fmtSigned, num } from "./math";

export const debtConsolidationScenario: ScenarioDef = {
  type: "debt_consolidation",
  label: "Debt Consolidation Comparison",
  question: "Should I consolidate this debt?",
  fields: [
    { key: "currentBalance", label: "Total current balance", type: "number", defaultValue: 0 },
    { key: "currentRate", label: "Current weighted average rate", type: "percent", defaultValue: 22 },
    { key: "currentPayment", label: "Current total monthly payment", type: "number", defaultValue: 0, help: "What you actually pay across these balances each month." },
    { key: "newRate", label: "Proposed consolidation rate", type: "percent", defaultValue: 12, isAssumption: true },
    { key: "newTermMonths", label: "Proposed term (months)", type: "number", defaultValue: 48, isAssumption: true },
    { key: "fees", label: "Origination / fees", type: "number", defaultValue: 0, isAssumption: true },
  ],
  compute: (inputs) => {
    const balance = num(inputs.currentBalance);
    const currentRate = num(inputs.currentRate);
    const currentPayment = num(inputs.currentPayment);
    const newRate = num(inputs.newRate);
    const termMonths = num(inputs.newTermMonths, 48);
    const fees = num(inputs.fees);

    const financedAmount = balance + fees;
    const newPayment = amortizedPayment(financedAmount, newRate, termMonths);
    const newTotalInterest = totalInterest(newPayment, termMonths, financedAmount);

    // Rough estimate of remaining payoff time / interest at current terms if
    // held at the current payment (illustrative, not a real amortization
    // schedule since card minimums vary).
    const monthlyRate = currentRate / 100 / 12;
    let estMonthsAtCurrent = termMonths;
    if (currentPayment > monthlyRate * balance && monthlyRate > 0) {
      estMonthsAtCurrent = Math.log(currentPayment / (currentPayment - monthlyRate * balance)) / Math.log(1 + monthlyRate);
    }
    const currentTotalInterest = Math.max(currentPayment * estMonthsAtCurrent - balance, 0);

    const monthlyDelta = newPayment - currentPayment;
    const interestDelta = newTotalInterest - currentTotalInterest;

    return {
      headline:
        monthlyDelta < 0
          ? `About ${fmt(Math.abs(monthlyDelta))}/month of breathing room`
          : `About ${fmt(Math.abs(monthlyDelta))}/month more than you pay now`,
      interpretation:
        interestDelta > 0
          ? "Lower monthly payment, but likely more total interest if carried the full term — that's the tradeoff to weigh."
          : "This looks favorable on both monthly payment and total interest, based on what you entered.",
      groups: [
        {
          title: "Monthly payment",
          lines: [
            { label: "Current", value: fmt(currentPayment) },
            { label: "Consolidated", value: fmt(Math.round(newPayment)), emphasis: true },
            { label: "Change", value: fmtSigned(Math.round(monthlyDelta)) },
          ],
        },
        {
          title: "Total interest (estimated)",
          lines: [
            { label: "Current path", value: fmt(Math.round(currentTotalInterest)), note: "Rough estimate at your current payment" },
            { label: "Consolidated", value: fmt(Math.round(newTotalInterest)) },
            { label: "Change", value: fmtSigned(Math.round(interestDelta)) },
          ],
        },
        {
          title: "What you're relying on",
          lines: [
            { label: "You don't reuse the paid-off cards", value: "Assumption" },
            { label: "You keep the new payment for the full term", value: "Assumption" },
          ],
        },
      ],
    };
  },
};
