import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { AppPrompt } from "@/components/chat/AppPrompt";

const EXAMPLES = [
  "Can I afford this?",
  "What should I pay off first?",
  "Is this a good financial move?",
  "What should I do with this money?",
  "Can I buy a house?",
  "What am I missing?",
];

export default async function AskIndexPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (user.activeRunId) redirect(`/app/ask/${user.activeRunId}`);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-5 py-10 sm:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Ask CredABLE</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Open-ended help with your actual situation. CredABLE uses what it already knows about you — you shouldn&apos;t
          have to start from scratch.
        </p>
      </div>
      <AppPrompt hasActiveRun={false} examples={EXAMPLES} />
    </div>
  );
}
