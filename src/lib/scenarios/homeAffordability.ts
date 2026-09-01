import { ScenarioDef } from "./types";
import { amortizedPayment, fmt, fmtSigned, num, pct } from "./math";

export const homeAffordabilityScenario: ScenarioDef = {
  type: "home_affordability",
  label: "Home Affordability + Current Cost Comparison",
  question: "Can I afford this house?",
  fields: [
    { key: "price", label: "Purchase price you're considering", type: "number", defaultValue: 0 },
    { key: "downPaymentPct", label: "Down payment", type: "percent", defaultValue: 10 },
    { key: "rate", label: "Interest rate", type: "percent", defaultValue: 6.75, isAssumption: true },
    { key: "termYears", label: "Loan term (years)", type: "number", defaultValue: 30, isAssumption: true },
    { key: "taxInsuranceRate", label: "Taxes + insurance (annual, % of price)", type: "percent", defaultValue: 1.6, isAssumption: true },
    { key: "hoa", label: "HOA (monthly, if any)", type: "number", defaultValue: 0 },
    { key: "currentHousingCost", label: "What you pay for housing now", type: "number", defaultValue: 0 },
    { key: "monthlyIncome", label: "Gross monthly income", type: "number", defaultValue: 0, help: "Used only to sanity-check, not a lender qualification." },
    { key: "otherMonthlyDebt", label: "Other monthly debt payments", type: "number", defaultValue: 0 },
  ],
  compute: (inputs) => {
    const price = num(inputs.price);
    const downPct = num(inputs.downPaymentPct, 10);
    const rate = num(inputs.rate, 6.75);
    const termYears = num(inputs.termYears, 30);
    const taxInsRate = num(inputs.taxInsuranceRate, 1.6);
    const hoa = num(inputs.hoa);
    const currentCost = num(inputs.currentHousingCost);
    const income = num(inputs.monthlyIncome);
    const otherDebt = num(inputs.otherMonthlyDebt);

    const downPayment = price * (downPct / 100);
    const loanAmount = Math.max(price - downPayment, 0);
    const principalInterest = amortizedPayment(loanAmount, rate, termYears * 12);
    const taxesInsurance = (price * (taxInsRate / 100)) / 12;
    const allIn = principalInterest + taxesInsurance + hoa;

    const delta = allIn - currentCost;
    const dti = income > 0 ? ((allIn + otherDebt) / income) * 100 : null;

    const groups = [
      {
        title: "Monthly housing cost",
        lines: [
          { label: "Principal + interest", value: fmt(Math.round(principalInterest)) },
          { label: "Taxes + insurance (est.)", value: fmt(Math.round(taxesInsurance)) },
          ...(hoa > 0 ? [{ label: "HOA", value: fmt(hoa) }] : []),
          { label: "All-in estimate", value: fmt(Math.round(allIn)), emphasis: true },
        ],
      },
      {
        title: "Compared to today",
        lines: [
          { label: "You pay now", value: fmt(currentCost) },
          { label: "Change", value: fmtSigned(Math.round(delta)) },
        ],
      },
    ];

    if (dti !== null) {
      groups.push({
        title: "Rough debt-to-income (not a lender qualification)",
        lines: [
          { label: "Housing + other debt vs. gross income", value: pct(dti) },
          {
            label: "Context",
            value: dti < 36 ? "Typically comfortable range" : dti < 45 ? "Getting tight for many lenders" : "Likely above what most lenders allow",
          },
        ],
      });
    }

    return {
      headline: `Estimated all-in payment: ${fmt(Math.round(allIn))}/month`,
      interpretation:
        delta > 0
          ? `That's roughly ${fmt(Math.round(delta))}/month more than you pay now. The real question isn't just whether you can make that payment — it's what it replaces or crowds out elsewhere.`
          : `That's at or below what you're paying now — worth double-checking your assumptions (rate, taxes, insurance) before treating this as solid.`,
      groups,
    };
  },
};
