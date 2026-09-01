"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { Chip } from "../ui/Primitives";
import { Button } from "../ui/Button";
import { startRun } from "@/lib/actions/runs";

const DEFAULT_EXAMPLES = [
  "My credit dropped and I don't know why",
  "I'm thinking about buying a house",
  "I have too much debt and don't know what to tackle first",
  "I have some cash and want to know what I should do with it",
  "Nothing is urgent — I just want to get smarter about my money",
];

export function AppPrompt({
  hasActiveRun,
  examples = DEFAULT_EXAMPLES,
}: {
  hasActiveRun: boolean;
  examples?: string[];
}) {
  const [question, setQuestion] = useState("");
  const [pending, setPending] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) {
      setShowHelp(true);
      return;
    }
    setPending(true);
    const result = await startRun(question.trim());
    setPending(false);
    if (result.ok) {
      router.push(`/app/ask/${result.runId}`);
    } else if (result.reason === "paywall") {
      router.push("/app/membership");
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={submit} className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          placeholder={hasActiveRun ? "Ask CredABLE something new…" : "What needs attention right now?"}
          className="w-full resize-none rounded-xl border-none bg-transparent text-base text-ink outline-none placeholder:text-ink-soft/60"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowHelp((v) => !v)}
            className="flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
          >
            <Sparkles size={15} />
            I&apos;m not sure — help me figure it out
          </button>
          <Button type="submit" disabled={pending}>
            {pending ? "One moment…" : "Continue"}
            <ArrowRight size={16} />
          </Button>
        </div>
      </form>
      {showHelp && (
        <div className="mt-3 flex flex-wrap gap-2">
          {examples.map((ex) => (
            <Chip key={ex} onClick={() => setQuestion(ex)}>
              {ex}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
