"use server";

import { redirect } from "next/navigation";
import { mutateDB, readDB } from "../db";
import { newId } from "../ids";
import { getCurrentUser } from "../session";
import { Worry, WorryStatus } from "../types";
import { startRun } from "./runs";

export async function addWorry(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const worry: Worry = {
    id: newId("worry"),
    userId: user.id,
    title,
    description: String(formData.get("description") ?? ""),
    status: "new",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    relatedGoalIds: [],
    relatedStuffIds: [],
    relatedRunIds: [],
  };

  await mutateDB((db) => {
    db.worries.push(worry);
  });

  redirect(`/app/my-worries/${worry.id}`);
}

export async function setWorryStatus(worryId: string, status: WorryStatus) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  await mutateDB((db) => {
    const w = db.worries.find((x) => x.id === worryId && x.userId === user.id);
    if (w) {
      w.status = status;
      w.updatedAt = new Date().toISOString();
    }
  });
}

export async function askAboutWorry(worryId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  const db = readDB();
  const worry = db.worries.find((w) => w.id === worryId && w.userId === user.id);
  if (!worry) throw new Error("Worry not found");

  const message = worry.description ? `${worry.title}. ${worry.description}` : `I'm worried about: ${worry.title}`;
  const result = await startRun(message);

  if (result.ok) {
    await mutateDB((db2) => {
      const r = db2.runs.find((x) => x.id === result.runId);
      const w = db2.worries.find((x) => x.id === worryId);
      if (r && w) {
        if (!w.relatedRunIds.includes(r.id)) w.relatedRunIds.push(r.id);
        if (w.status === "new") w.status = "working";
      }
    });
    redirect(`/app/ask/${result.runId}`);
  }
  redirect("/app/membership");
}
