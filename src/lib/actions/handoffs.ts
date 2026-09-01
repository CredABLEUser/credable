"use server";

import { redirect } from "next/navigation";
import { mutateDB } from "../db";
import { newId } from "../ids";
import { getCurrentUser } from "../session";
import { ProfessionalHandoff } from "../types";

export async function createHandoff(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");

  const professionalType = String(formData.get("professionalType") ?? "professional");
  const question = String(formData.get("question") ?? "").trim();
  const context = String(formData.get("context") ?? "");

  const handoff: ProfessionalHandoff = {
    id: newId("handoff"),
    userId: user.id,
    professionalType,
    question,
    packagedContext: { summary: context },
    status: "sent",
    createdAt: new Date().toISOString(),
  };

  await mutateDB((db) => {
    db.handoffs.push(handoff);
  });

  redirect(`/app/handoffs/${handoff.id}`);
}
