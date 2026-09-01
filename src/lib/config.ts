// Central, configurable product entitlements — never hard-code these
// numbers into individual screens (per Instruction 2, section 18).

export const DEFAULT_FREE_RUNS_ALLOWED = 3;
export const MEMBERSHIP_PRICE_LABEL = "$9.99/month";
export const MEMBERSHIP_CADENCE = "Cancel anytime.";

export const PRIMARY_NAV = [
  { href: "/app", label: "Today" },
  { href: "/app/my-worries", label: "My Worries" },
  { href: "/app/my-goals", label: "My Goals" },
  { href: "/app/my-stuff", label: "My Stuff" },
  { href: "/app/school", label: "CredABLE School" },
  { href: "/app/ask", label: "Ask CredABLE" },
] as const;

export const STUFF_CATEGORY_LABELS: Record<string, string> = {
  cash_banking: "Cash + Banking",
  income: "Income",
  credit_debt: "Credit + Debt",
  real_estate: "Real Estate",
  retirement_investments: "Retirement + Investments",
  business: "Business",
  insurance: "Insurance",
  monthly_life: "Monthly Life",
  documents: "Documents",
  other_assets: "Other Assets",
  other_obligations: "Other Obligations",
};

export interface StuffCategoryMeta {
  label: string;
  helper: string;
  subtypeExamples: string[];
  hasValue: boolean;
  valueLabel: string;
  hasMonthly: boolean;
  hasRate: boolean;
}

export const STUFF_CATEGORY_META: Record<string, StuffCategoryMeta> = {
  cash_banking: {
    label: "Cash + Banking",
    helper: "Checking, savings, money market, CDs, cash.",
    subtypeExamples: ["Checking", "Savings", "Money market", "CD", "Cash"],
    hasValue: true,
    valueLabel: "Balance",
    hasMonthly: false,
    hasRate: false,
  },
  income: {
    label: "Income",
    helper: "Wages, self-employment, commissions, rental, support, pension.",
    subtypeExamples: ["W-2 wages", "Self-employment", "Bonus/commission", "Rental income", "Support income", "Pension / Social Security"],
    hasValue: false,
    valueLabel: "",
    hasMonthly: true,
    hasRate: false,
  },
  credit_debt: {
    label: "Credit + Debt",
    helper: "Credit cards, loans, mortgages, HELOCs, other balances owed.",
    subtypeExamples: ["Credit card", "Personal loan", "Mortgage", "HELOC", "Auto loan", "Student loan", "Business debt", "Other"],
    hasValue: true,
    valueLabel: "Balance",
    hasMonthly: true,
    hasRate: true,
  },
  real_estate: {
    label: "Real Estate",
    helper: "Primary residence, rentals, land — with estimated value and any mortgage.",
    subtypeExamples: ["Primary residence", "Rental property", "Land", "Vacation property"],
    hasValue: true,
    valueLabel: "Estimated value",
    hasMonthly: true,
    hasRate: false,
  },
  retirement_investments: {
    label: "Retirement + Investments",
    helper: "401(k), IRA, brokerage, stocks, bonds, private investments.",
    subtypeExamples: ["401(k)", "Roth IRA", "Traditional IRA", "Brokerage account", "Pension", "Private investment"],
    hasValue: true,
    valueLabel: "Current value",
    hasMonthly: false,
    hasRate: false,
  },
  business: {
    label: "Business",
    helper: "Ownership interests, revenue, business debt, cash and assets.",
    subtypeExamples: ["Ownership interest", "Business cash", "Business debt", "Equipment/assets"],
    hasValue: true,
    valueLabel: "Estimated value",
    hasMonthly: false,
    hasRate: false,
  },
  insurance: {
    label: "Insurance",
    helper: "Life, disability, property, health, long-term care.",
    subtypeExamples: ["Life insurance", "Disability insurance", "Homeowners/renters", "Health", "Long-term care"],
    hasValue: false,
    valueLabel: "",
    hasMonthly: true,
    hasRate: false,
  },
  monthly_life: {
    label: "Monthly Life",
    helper: "Housing, utilities, transportation, food, childcare, subscriptions.",
    subtypeExamples: ["Housing", "Utilities", "Transportation", "Food", "Childcare", "Subscriptions", "Discretionary"],
    hasValue: false,
    valueLabel: "",
    hasMonthly: true,
    hasRate: false,
  },
  documents: {
    label: "Documents",
    helper: "Tax returns, paystubs, statements, property or divorce records.",
    subtypeExamples: ["Tax return", "Paystub", "Bank statement", "Loan statement", "Property record", "Divorce record"],
    hasValue: false,
    valueLabel: "",
    hasMonthly: false,
    hasRate: false,
  },
  other_assets: {
    label: "Other Assets",
    helper: "Vehicles, valuable property, trusts, intellectual property.",
    subtypeExamples: ["Vehicle", "Valuable property", "Trust interest", "Intellectual property"],
    hasValue: true,
    valueLabel: "Estimated value",
    hasMonthly: false,
    hasRate: false,
  },
  other_obligations: {
    label: "Other Obligations",
    helper: "Anything you owe or are responsible for that doesn't fit elsewhere.",
    subtypeExamples: ["Family loan", "Tax obligation", "Legal obligation", "Other"],
    hasValue: true,
    valueLabel: "Amount owed",
    hasMonthly: true,
    hasRate: false,
  },
};

// Categories where "Connect it" (the Plaid-style import stub) is offered.
export const CONNECTABLE_CATEGORIES: string[] = ["cash_banking", "credit_debt", "retirement_investments", "real_estate"];

export const SOURCE_LABELS: Record<string, string> = {
  connected: "Connected",
  manual: "Entered by you",
  document: "From document",
  approximate: "Approximate",
  needs_update: "Needs update",
  known_unknown_details: "Known to exist — details unknown",
  unknown: "Unknown",
};
