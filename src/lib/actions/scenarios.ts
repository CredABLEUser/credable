"use server";

import { revalidatePath } from "next/cache";
import { mutateDB } from "../db";
import { newId } from "../ids";
import { getCurrentUser } from "../session";
import { Scenario, ScenarioType } from "../types";

export async function saveScenario(
  type: ScenarioType,
  name: string,
  inputs: Record<string, number | string>,
  results: Record<string, unknown>
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");

  const scenario: Scenario = {
    id: newId("scn"),
    userId: user.id,
    type,
    name: name || `${type} scenario`,
    inputs,
    results,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    relatedGoalIds: [],
    relatedWorryIds: [],
  };

  await mutateDB((db) => {
    db.scenarios.push(scenario);
  });

  revalidatePath(`/app/tools/${type}`);
  return scenario.id;
}

export async function deleteScenario(scenarioId: string, type: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  await mutateDB((db) => {
    db.scenarios = db.scenarios.filter((s) => !(s.id === scenarioId && s.userId === user.id));
  });
  revalidatePath(`/app/tools/${type}`);
}
