import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { readDB } from "@/lib/db";
import { ChatThread } from "@/components/chat/ChatThread";

export default async function AskRunPage(props: PageProps<"/app/ask/[runId]">) {
  const { runId } = await props.params;
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const db = readDB();
  const run = db.runs.find((r) => r.id === runId && r.userId === user.id);
  if (!run) notFound();

  const messages = db.messages
    .filter((m) => m.runId === runId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return <ChatThread run={run} initialMessages={messages} />;
}
