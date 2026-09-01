"use server";

import { redirect } from "next/navigation";
import { mutateDB, readDB } from "../db";
import { newId } from "../ids";
import { getCurrentUser } from "../session";
import { Goal, GoalStatus } from "../types";
import { startRun } from "./runs";

export async function addGoal(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const goal: Goal = {
    id: newId("goal"),
    userId: user.id,
    title,
    timing: String(formData.get("timing") ?? "No target date yet"),
    status: "not_started",
    notes: String(formData.get("notes") ?? ""),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    relatedWorryIds: [],
    relatedStuffIds: [],
    relatedRunIds: [],
  };

  await mutateDB((db) => {
    db.goals.push(goal);
  });

  redirect(`/app/my-goals/${goal.id}`);
}

export async function setGoalStatus(goalId: string, status: GoalStatus) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  await mutateDB((db) => {
    const g = db.goals.find((x) => x.id === goalId && x.userId === user.id);
    if (g) {
      g.status = status;
      g.updatedAt = new Date().toISOString();
    }
  });
}

export async function askAboutGoal(goalId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  const db = readDB();
  const goal = db.goals.find((g) => g.id === goalId && g.userId === user.id);
  if (!goal) throw new Error("Goal not found");

  const message = `Help me figure out how to make progress on this goal: ${goal.title} (${goal.timing}).`;
  const result = await startRun(message);

  if (result.ok) {
    await mutateDB((db2) => {
      const r = db2.runs.find((x) => x.id === result.runId);
      const g = db2.goals.find((x) => x.id === goalId);
      if (r && g) {
        if (!g.relatedRunIds.includes(r.id)) g.relatedRunIds.push(r.id);
        if (g.status === "not_started") g.status = "in_progress";
      }
    });
    redirect(`/app/ask/${result.runId}`);
  }
  redirect("/app/membership");
}
