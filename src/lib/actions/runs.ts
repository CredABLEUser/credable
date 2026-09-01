"use server";

import { mutateDB, readDB } from "../db";
import { newId } from "../ids";
import { getCurrentUser } from "../session";
import { generateResponse } from "../ai/engine";
import { getUserContext } from "../repo";
import { Message, Run } from "../types";
import { redirect } from "next/navigation";

function titleFromMessage(text: string): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  return trimmed.length > 60 ? `${trimmed.slice(0, 57)}…` : trimmed || "New question";
}

export type StartRunResult = { ok: true; runId: string } | { ok: false; reason: "paywall" | "not_signed_in" };

/**
 * Starts a brand-new inquiry-to-solution run. Free users are gated here —
 * NOT per message (Instruction 2, section 6): the check only happens when a
 * new distinct run is being opened, never mid-conversation.
 */
export async function startRun(firstMessage: string): Promise<StartRunResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, reason: "not_signed_in" };

  if (user.accountStatus === "free" && user.freeRunsCompleted >= user.freeRunsAllowed && !user.activeRunId) {
    return { ok: false, reason: "paywall" };
  }

  const run: Run = {
    id: newId("run"),
    userId: user.id,
    title: titleFromMessage(firstMessage),
    status: "active",
    isFreeRun: user.accountStatus === "free",
    startedAt: new Date().toISOString(),
    depth: "explore",
    pathwayTags: [],
  };

  const userMsg: Message = {
    id: newId("msg"),
    runId: run.id,
    userId: user.id,
    role: "user",
    content: firstMessage,
    createdAt: new Date().toISOString(),
  };

  const ctx = getUserContext(user.id);
  const engineResult = await generateResponse({
    message: firstMessage,
    history: [],
    ctx: ctx!,
    depth: run.depth,
    turn: 0,
  });

  const assistantMsg: Message = {
    id: newId("msg"),
    runId: run.id,
    userId: user.id,
    role: "assistant",
    content: engineResult.content,
    createdAt: new Date().toISOString(),
    blocks: engineResult.blocks,
    suggestions: engineResult.suggestions,
  };

  run.pathwayTags = engineResult.pathwayTags;

  await mutateDB((db) => {
    const u = db.users.find((x) => x.id === user.id)!;

    // Starting something new implicitly finishes whatever was active, so a
    // free run can never be left open indefinitely to dodge the entitlement
    // check above.
    if (u.activeRunId) {
      const prior = db.runs.find((r) => r.id === u.activeRunId);
      if (prior && prior.status === "active") {
        prior.status = "resolved";
        prior.resolvedAt = new Date().toISOString();
        if (prior.isFreeRun) u.freeRunsCompleted += 1;
      }
    }

    db.runs.push(run);
    db.messages.push(userMsg, assistantMsg);
    u.activeRunId = run.id;
    for (const tag of engineResult.pathwayTags) {
      if (!u.pathwayFlags.includes(tag)) u.pathwayFlags.push(tag);
    }
  });

  return { ok: true, runId: run.id };
}

export async function sendMessage(runId: string, content: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");

  const db = readDB();
  const run = db.runs.find((r) => r.id === runId && r.userId === user.id);
  if (!run) throw new Error("Run not found");

  const history = db.messages
    .filter((m) => m.runId === runId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const userMsg: Message = {
    id: newId("msg"),
    runId,
    userId: user.id,
    role: "user",
    content,
    createdAt: new Date().toISOString(),
  };

  const ctx = getUserContext(user.id);
  const engineResult = await generateResponse({
    message: content,
    history: history.map((m) => ({ role: m.role, content: m.content })),
    ctx: ctx!,
    depth: run.depth,
    turn: history.length,
  });

  const assistantMsg: Message = {
    id: newId("msg"),
    runId,
    userId: user.id,
    role: "assistant",
    content: engineResult.content,
    createdAt: new Date().toISOString(),
    blocks: engineResult.blocks,
    suggestions: engineResult.suggestions,
  };

  await mutateDB((db2) => {
    db2.messages.push(userMsg, assistantMsg);
    const r = db2.runs.find((x) => x.id === runId)!;
    for (const tag of engineResult.pathwayTags) {
      if (!r.pathwayTags.includes(tag)) r.pathwayTags.push(tag);
    }
    const u = db2.users.find((x) => x.id === user.id)!;
    for (const tag of engineResult.pathwayTags) {
      if (!u.pathwayFlags.includes(tag)) u.pathwayFlags.push(tag);
    }
  });

  return assistantMsg;
}

export async function setRunDepth(runId: string, depth: Run["depth"]) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  await mutateDB((db) => {
    const run = db.runs.find((r) => r.id === runId && r.userId === user.id);
    if (run) run.depth = depth;
  });
}

/**
 * Explicitly closes out the active run — called when the user chooses to
 * start a genuinely new question, not on every message. This is where a
 * free run gets "spent" (Instruction 2, sections 4 & 19).
 */
export async function finishActiveRun() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");
  await mutateDB((db) => {
    const u = db.users.find((x) => x.id === user.id)!;
    if (u.activeRunId) {
      const run = db.runs.find((r) => r.id === u.activeRunId);
      if (run && run.status === "active") {
        run.status = "resolved";
        run.resolvedAt = new Date().toISOString();
        if (run.isFreeRun) u.freeRunsCompleted += 1;
      }
      u.activeRunId = null;
    }
  });
}

export async function startNewQuestionFlow() {
  await finishActiveRun();
  redirect("/app/ask");
}
