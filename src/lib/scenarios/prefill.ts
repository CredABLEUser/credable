import { FinancialItem } from "../types";
import { ScenarioDef } from "./types";

function sum(items: FinancialItem[], filter: (i: FinancialItem) => boolean, field: "value" | "monthlyAmount") {
  return items.filter(filter).reduce((acc, i) => acc + (i[field] ?? 0), 0);
}

export function prefillInputs(def: ScenarioDef, items: FinancialItem[]): Record<string, number | string> {
  const base: Record<string, number | string> = {};
  for (const f of def.fields) {
    base[f.key] = f.defaultValue ?? 0;
  }

  const debtItems = items.filter((i) => i.category === "credit_debt");
  const incomeTotal = sum(items, (i) => i.category === "income", "monthlyAmount");
  const housingItem = items.find((i) => i.category === "monthly_life" && /housing|rent|mortgage/i.test(i.subtype || i.name));
  const realEstateItem = items.find((i) => i.category === "real_estate");
  const mortgageItem = debtItems.find((i) => /mortgage/i.test(i.subtype || i.name));

  switch (def.type) {
    case "debt_consolidation": {
      const nonMortgage = debtItems.filter((i) => !/mortgage/i.test(i.subtype || i.name));
      const balance = nonMortgage.reduce((a, i) => a + (i.value ?? 0), 0);
      const payment = nonMortgage.reduce((a, i) => a + (i.monthlyAmount ?? 0), 0);
      if (balance) base.currentBalance = balance;
      if (payment) base.currentPayment = payment;
      break;
    }
    case "home_affordability": {
      if (housingItem?.monthlyAmount) base.currentHousingCost = housingItem.monthlyAmount;
      if (incomeTotal) base.monthlyIncome = incomeTotal;
      const otherDebt = debtItems.filter((i) => !/mortgage/i.test(i.subtype || i.name)).reduce((a, i) => a + (i.monthlyAmount ?? 0), 0);
      if (otherDebt) base.otherMonthlyDebt = otherDebt;
      break;
    }
    case "credit_paydown": {
      const cards = debtItems.filter((i) => /credit card|card/i.test(i.subtype || i.name));
      const balance = cards.reduce((a, i) => a + (i.value ?? 0), 0);
      if (balance) base.totalBalance = balance;
      break;
    }
    case "keep_vs_sell": {
      if (realEstateItem?.value) base.value = realEstateItem.value;
      if (mortgageItem?.value) base.mortgageBalance = mortgageItem.value;
      if (mortgageItem?.monthlyAmount) base.monthlyCarry = mortgageItem.monthlyAmount;
      break;
    }
  }

  return base;
}
