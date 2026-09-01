import { mutateDB, readDB } from "./db";
import { newId } from "./ids";
import { DEFAULT_FREE_RUNS_ALLOWED } from "./config";
import { User } from "./types";
import { UserContext } from "./ai/context";

export async function getOrCreateUserByEmail(email: string): Promise<User> {
  return mutateDB((db) => {
    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return existing;
    const user: User = {
      id: newId("user"),
      email,
      createdAt: new Date().toISOString(),
      accountStatus: "free",
      freeRunsAllowed: DEFAULT_FREE_RUNS_ALLOWED,
      freeRunsCompleted: 0,
      activeRunId: null,
      membershipStatus: "none",
      knownContext: {},
      pathwayFlags: [],
    };
    db.users.push(user);
    return user;
  });
}

export function getUserContext(userId: string): UserContext | null {
  const db = readDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return null;
  return {
    user,
    items: db.financialItems.filter((i) => i.userId === userId),
    worries: db.worries.filter((w) => w.userId === userId),
    goals: db.goals.filter((g) => g.userId === userId),
  };
}
