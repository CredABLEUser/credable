"use server";

import { mutateDB } from "../db";
import { newId } from "../ids";
import { getCurrentUser } from "../session";
import { SchoolProgress } from "../types";

export async function markProgress(pathwayId: string, lessonId: string, status: SchoolProgress["status"]) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");

  await mutateDB((db) => {
    let record = db.schoolProgress.find(
      (p) => p.userId === user.id && p.pathwayId === pathwayId && p.lessonId === lessonId
    );
    if (!record) {
      record = {
        id: newId("prog"),
        userId: user.id,
        pathwayId,
        lessonId,
        status,
        updatedAt: new Date().toISOString(),
      };
      db.schoolProgress.push(record);
    } else {
      record.status = status;
      record.updatedAt = new Date().toISOString();
    }
  });
}
