"use server";

import { mutateDB } from "../db";
import { getCurrentUser } from "../session";

/**
 * Stub for Stripe Checkout. Swap the body of this function for a real
 * Stripe Checkout Session (or webhook-driven update) when API keys are
 * available — everything else in the app reads `membershipStatus` /
 * `accountStatus` off the user record, so nothing else needs to change.
 */
export async function joinTheClub() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  await mutateDB((db) => {
    const u = db.users.find((x) => x.id === user.id)!;
    u.accountStatus = "member";
    u.membershipStatus = "active";
    u.membershipStartedAt = new Date().toISOString();
  });
}

export async function cancelMembership() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  await mutateDB((db) => {
    const u = db.users.find((x) => x.id === user.id)!;
    u.membershipStatus = "canceled";
  });
}
