import { FinancialItem, Goal, User, Worry } from "../types";
import { STUFF_CATEGORY_LABELS } from "../config";

export interface UserContext {
  user: User;
  items: FinancialItem[];
  worries: Worry[];
  goals: Goal[];
}

function money(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "unknown";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function sumByCategory(items: FinancialItem[], category: string): number {
  return items
    .filter((i) => i.category === category && typeof i.value === "number")
    .reduce((acc, i) => acc + (i.value ?? 0), 0);
}

export function monthlyIncome(items: FinancialItem[]): number {
  return items
    .filter((i) => i.category === "income" && typeof i.monthlyAmount === "number")
    .reduce((acc, i) => acc + (i.monthlyAmount ?? 0), 0);
}

export function monthlyObligations(items: FinancialItem[]): number {
  return items
    .filter((i) => i.category === "monthly_life" && typeof i.monthlyAmount === "number")
    .reduce((acc, i) => acc + (i.monthlyAmount ?? 0), 0);
}

/** Human-readable snapshot used both by the rule engine and as the LLM context block. */
export function buildContextSummary(ctx: UserContext): string {
  const lines: string[] = [];
  lines.push(`Account status: ${ctx.user.accountStatus}.`);
  if (ctx.user.pathwayFlags.length) {
    lines.push(`Known life context: ${ctx.user.pathwayFlags.join(", ")}.`);
  }

  const byCategory = new Map<string, FinancialItem[]>();
  for (const item of ctx.items) {
    const list = byCategory.get(item.category) ?? [];
    list.push(item);
    byCategory.set(item.category, list);
  }

  if (ctx.items.length === 0) {
    lines.push("My Stuff is currently empty — nothing has been entered yet.");
  } else {
    for (const [cat, list] of byCategory) {
      const label = STUFF_CATEGORY_LABELS[cat] ?? cat;
      const desc = list
        .map((i) => {
          const val = i.value != null ? money(i.value) : i.monthlyAmount != null ? `${money(i.monthlyAmount)}/mo` : "amount unknown";
          return `${i.name} (${val}, ${i.source})`;
        })
        .join("; ");
      lines.push(`${label}: ${desc}`);
    }
    const income = monthlyIncome(ctx.items);
    if (income > 0) lines.push(`Total known monthly income: ${money(income)}.`);
    const debt = sumByCategory(ctx.items, "credit_debt");
    if (debt > 0) lines.push(`Total known credit/debt balances: ${money(debt)}.`);
  }

  if (ctx.worries.length) {
    lines.push(
      `Active Worries: ${ctx.worries
        .filter((w) => w.status !== "resolved")
        .map((w) => w.title)
        .join("; ") || "none currently open"}.`
    );
  }
  if (ctx.goals.length) {
    lines.push(
      `Active Goals: ${ctx.goals.map((g) => `${g.title} (${g.timing})`).join("; ")}.`
    );
  }

  return lines.join("\n");
}

export { money };
