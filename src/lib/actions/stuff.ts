"use server";

import { redirect } from "next/navigation";
import { mutateDB } from "../db";
import { newId } from "../ids";
import { getCurrentUser } from "../session";
import { FinancialItem, SourceState, StuffCategory } from "../types";
import { readDB } from "../db";
import { startRun } from "./runs";

function numOrNull(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const s = String(v).replace(/[$,]/g, "").trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

export async function addItem(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");

  const category = String(formData.get("category")) as StuffCategory;
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const item: FinancialItem = {
    id: newId("item"),
    userId: user.id,
    category,
    subtype: String(formData.get("subtype") ?? ""),
    name,
    value: numOrNull(formData.get("value")),
    monthlyAmount: numOrNull(formData.get("monthlyAmount")),
    rate: numOrNull(formData.get("rate")),
    owner: String(formData.get("owner") ?? "self"),
    source: (String(formData.get("source") ?? "manual") as SourceState),
    notes: String(formData.get("notes") ?? ""),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await mutateDB((db) => {
    db.financialItems.push(item);
  });

  redirect(`/app/my-stuff/${category}`);
}

export async function updateItem(itemId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");

  let category = "";
  await mutateDB((db) => {
    const item = db.financialItems.find((i) => i.id === itemId && i.userId === user.id);
    if (!item) return;
    item.name = String(formData.get("name") ?? item.name);
    item.subtype = String(formData.get("subtype") ?? item.subtype);
    item.value = numOrNull(formData.get("value"));
    item.monthlyAmount = numOrNull(formData.get("monthlyAmount"));
    item.rate = numOrNull(formData.get("rate"));
    item.owner = String(formData.get("owner") ?? item.owner);
    item.source = (String(formData.get("source") ?? item.source) as SourceState);
    item.notes = String(formData.get("notes") ?? "");
    item.updatedAt = new Date().toISOString();
    category = item.category;
  });

  redirect(`/app/my-stuff/${category}/${itemId}`);
}

// Mock data used to simulate a Plaid-style "Connect it" import. This is the
// integration point where a real Plaid Link flow would replace the fake
// items below with accounts pulled from the user's actual bank — see
// README.md "Connecting Plaid" for what that swap looks like.
const CONNECT_SIMULATION: Partial<Record<StuffCategory, Omit<FinancialItem, "id" | "userId" | "createdAt" | "updatedAt">[]>> = {
  cash_banking: [
    { category: "cash_banking", subtype: "Checking", name: "Checking ••4821", value: 2340, monthlyAmount: null, rate: null, owner: "self", source: "connected", notes: "Imported automatically." },
    { category: "cash_banking", subtype: "Savings", name: "Savings ••1190", value: 6120, monthlyAmount: null, rate: null, owner: "self", source: "connected", notes: "Imported automatically." },
  ],
  credit_debt: [
    { category: "credit_debt", subtype: "Credit card", name: "Visa ••7734", value: 3180, monthlyAmount: 95, rate: 24.99, owner: "self", source: "connected", notes: "Imported automatically." },
  ],
  retirement_investments: [
    { category: "retirement_investments", subtype: "401(k)", name: "401(k) — Employer plan", value: 18400, monthlyAmount: null, rate: null, owner: "self", source: "connected", notes: "Imported automatically." },
  ],
  real_estate: [
    { category: "real_estate", subtype: "Primary residence", name: "Primary residence", value: 315000, monthlyAmount: 1850, rate: null, owner: "joint", source: "connected", notes: "Estimated value from public records; mortgage payment imported." },
  ],
};

// Stands in for a real Plaid Link session: in production this action would
// receive a public_token from Plaid Link, exchange it server-side, and pull
// real balances instead of the fixtures above.
export async function simulateConnect(category: StuffCategory) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");

  const fixtures = CONNECT_SIMULATION[category] ?? [];
  await mutateDB((db) => {
    for (const f of fixtures) {
      db.financialItems.push({
        ...f,
        id: newId("item"),
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  });

  redirect(`/app/my-stuff/${category}?connected=1`);
}

export async function helpMeFindIt(category: StuffCategory, label: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");

  const message = `I'm not sure what to include under ${label}. Can you help me figure out what I have and where to find it?`;
  const result = await startRun(message);
  if (result.ok) redirect(`/app/ask/${result.runId}`);
  redirect("/app/membership");
}

export async function askAboutItem(itemId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  const db = readDB();
  const item = db.financialItems.find((i) => i.id === itemId && i.userId === user.id);
  if (!item) throw new Error("Item not found");

  const message = `Tell me what I should know about my ${item.name}${item.subtype ? ` (${item.subtype})` : ""} in ${item.category.replace("_", " ")}.`;
  const result = await startRun(message);
  if (result.ok) redirect(`/app/ask/${result.runId}`);
  redirect("/app/membership");
}

export async function deleteItem(itemId: string, category: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  await mutateDB((db) => {
    db.financialItems = db.financialItems.filter((i) => !(i.id === itemId && i.userId === user.id));
  });
  redirect(`/app/my-stuff/${category}`);
}
