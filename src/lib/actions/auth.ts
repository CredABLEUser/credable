"use server";

import { redirect } from "next/navigation";
import { getOrCreateUserByEmail } from "../repo";
import { clearSessionCookie, setSessionCookie } from "../session";
import { startRun } from "./runs";

/**
 * Signup preserves whatever question the visitor typed on the front page
 * (Instruction 2, section 3) — email creates/loads the account, then we
 * immediately spend it on that exact question so the experience feels
 * continuous rather than restarting.
 */
export async function signupAndStart(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const question = String(formData.get("question") ?? "").trim();
  if (!email) return;

  const user = await getOrCreateUserByEmail(email);
  await setSessionCookie(user.id);

  if (question) {
    const result = await startRun(question);
    if (result.ok) {
      redirect(`/app/ask/${result.runId}`);
    }
  }
  redirect("/app");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/");
}
