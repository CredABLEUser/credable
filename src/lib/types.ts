// CredABLE core data model
// One shared data model — every entity references userId and links to
// related entities by id so the same fact never needs to be re-entered.

export type AccountStatus = "visitor" | "free" | "member";

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  accountStatus: AccountStatus;
  freeRunsAllowed: number; // configurable entitlement, not hard-coded 3
  freeRunsCompleted: number;
  activeRunId: string | null;
  membershipStatus: "none" | "active" | "canceled";
  membershipStartedAt?: string;
  // lightweight known-context so the app never re-asks what it already knows
  knownContext: Record<string, string | number | boolean>;
  pathwayFlags: string[]; // e.g. ["self_employed", "divorce", "homebuying"]
}

export type RunStatus = "active" | "resolved";

export interface Run {
  id: string;
  userId: string;
  title: string; // short human label, derived from first message
  status: RunStatus;
  isFreeRun: boolean;
  startedAt: string;
  resolvedAt?: string;
  depth: "act" | "explore" | "deep_dive";
  pathwayTags: string[];
}

export type MessageRole = "user" | "assistant";

export interface StructuredBlock {
  kind: "options" | "comparison" | "checklist" | "resource" | "action" | "handoff_preview";
  data: unknown;
}

export interface Message {
  id: string;
  runId: string;
  userId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  blocks?: StructuredBlock[];
  suggestions?: string[]; // quick reply chips e.g. "Explore this", "Tell me why"
}

export type WorryStatus = "new" | "working" | "waiting" | "resolved";

export interface Worry {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: WorryStatus;
  createdAt: string;
  updatedAt: string;
  relatedGoalIds: string[];
  relatedStuffIds: string[];
  relatedRunIds: string[];
}

export type GoalStatus = "not_started" | "in_progress" | "on_track" | "at_risk" | "done";

export interface Goal {
  id: string;
  userId: string;
  title: string;
  timing: string; // e.g. "Next 3-6 months"
  status: GoalStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  relatedWorryIds: string[];
  relatedStuffIds: string[];
  relatedRunIds: string[];
}

export type StuffCategory =
  | "cash_banking"
  | "income"
  | "credit_debt"
  | "real_estate"
  | "retirement_investments"
  | "business"
  | "insurance"
  | "monthly_life"
  | "documents"
  | "other_assets"
  | "other_obligations";

export type SourceState =
  | "connected"
  | "manual"
  | "document"
  | "approximate"
  | "needs_update"
  | "known_unknown_details"
  | "unknown";

export interface FinancialItem {
  id: string;
  userId: string;
  category: StuffCategory;
  subtype: string; // e.g. "Checking", "Visa ending 4821", "123 Main Street"
  name: string;
  value?: number | null; // primary balance/value if applicable
  monthlyAmount?: number | null; // for income/expense items
  rate?: number | null; // interest rate if applicable
  owner?: string; // self, spouse, joint, business
  source: SourceState;
  notes?: string;
  meta?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type ScenarioType =
  | "debt_consolidation"
  | "home_affordability"
  | "rent_vs_buy"
  | "credit_paydown"
  | "keep_vs_sell";

export interface Scenario {
  id: string;
  userId: string;
  type: ScenarioType;
  name: string;
  inputs: Record<string, number | string>;
  results?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  relatedGoalIds: string[];
  relatedWorryIds: string[];
}

export interface SchoolProgress {
  id: string;
  userId: string;
  pathwayId: string;
  lessonId: string;
  status: "not_started" | "in_progress" | "completed";
  updatedAt: string;
}

export interface Resource {
  id: string;
  name: string;
  category: string;
  resourceType: "informational" | "software" | "financial_product" | "professional" | "affiliated_professional";
  description: string;
  helpsWith: string[];
  doesNotHelpWith: string[];
  bestFor: string;
  pricing: string;
  riskLevel?: string;
  affiliateStatus: boolean;
  affiliateDisclosure?: string;
  url: string;
  lastReviewed: string;
  activeStatus: boolean;
}

export interface ProfessionalHandoff {
  id: string;
  userId: string;
  professionalType: string;
  question: string;
  packagedContext: Record<string, unknown>;
  status: "draft" | "approved" | "sent";
  createdAt: string;
}

export interface DB {
  users: User[];
  runs: Run[];
  messages: Message[];
  worries: Worry[];
  goals: Goal[];
  financialItems: FinancialItem[];
  scenarios: Scenario[];
  schoolProgress: SchoolProgress[];
  resources: Resource[];
  handoffs: ProfessionalHandoff[];
}
