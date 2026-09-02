"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Chip } from "../ui/Primitives";
import { Button } from "../ui/Button";
import { signupAndStart } from "@/lib/actions/auth";

const QUICK_EXAMPLES = [
  "My credit dropped and I don't know why",
  "I'm thinking about buying a house",
  "I have too much debt and don't know what to tackle first",
  "I'm getting divorced and don't know where to start financially",
  "I have some cash and want to know what I should do with it",
  "Nothing is urgent — I just want to get smarter about my money",
];

const STARTER_GROUPS: { label: string; examples: string[] }[] = [
  {
    label: "I'm feeling…",
    examples: ["overwhelmed", "stuck", "behind", "pretty good, but I know I could be doing more", "curious about what's possible"],
  },
  {
    label: "I need help navigating…",
    examples: ["divorce or separation", "damaged credit", "buying a home", "self-employment", "a major life transition"],
  },
  {
    label: "I need help answering…",
    examples: ["Can I afford it?", "Should I do it?", "What happens if I settle this debt?", "How can I improve my credit?"],
  },
  {
    label: "I need help organizing…",
    examples: ["my finances", "my accounts", "documents I need", "everything — it feels scattered"],
  },
  {
    label: "I want to be able to…",
    examples: ["buy a home", "get out of debt", "build wealth", "create more financial freedom", "work less"],
  },
];

export function LandingPrompt() {
  const [question, setQuestion] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [pending, setPending] = useState(false);

  function pickExample(text: string) {
    setQuestion(text);
    setShowHelp(false);
  }

  function continueToSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) {
      setShowHelp(true);
      return;
    }
    setShowEmail(true);
  }

  if (showEmail) {
    return (
      <form
        action={async (formData) => {
          setPending(true);
          await signupAndStart(formData);
        }}
        className="mx-auto w-full max-w-lg"
      >
        <input type="hidden" name="question" value={question} />
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <p className="text-lg font-semibold text-ink">Let&apos;s work through it.</p>
          <p className="mt-1 text-sm text-ink-soft">
            Enter your email to start your free CredABLE account. No credit card required.
          </p>
          <div className="mt-3 rounded-xl bg-brand-soft/60 p-3 text-sm text-brand-strong">“{question}”</div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              required
              type="email"
              name="email"
              placeholder="you@email.com"
              className="flex-1 rounded-full border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
            <Button type="submit" disabled={pending}>
              {pending ? "One moment…" : "Continue"}
              <ArrowRight size={16} />
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setShowEmail(false)}
            className="mt-3 text-xs text-ink-soft underline underline-offset-2"
          >
            ← Edit my question
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        onSubmit={continueToSignup}
        className="rounded-3xl border border-brand/10 bg-white p-4 shadow-xl shadow-brand/10 sm:p-5"
      >
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          placeholder="Tell me what's going on — in your own words."
          className="w-full resize-none rounded-xl border-none bg-transparent text-base text-ink outline-none placeholder:text-ink-soft/60"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowHelp((v) => !v)}
            className="flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
          >
            <Sparkles size={15} />
            <span className="hidden sm:inline">I&apos;m not sure — help me figure it out</span>
            <span className="sm:hidden">Not sure?</span>
          </button>
          <Button type="submit" size="md">
            Continue <ArrowRight size={16} />
          </Button>
        </div>
      </form>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {QUICK_EXAMPLES.slice(0, 4).map((ex) => (
          <Chip key={ex} onClick={() => pickExample(ex)} className="hidden sm:inline-flex">
            {ex}
          </Chip>
        ))}
      </div>

      {showHelp && (
        <div className="mt-6 space-y-5 rounded-2xl border border-border bg-white/70 p-5">
          {STARTER_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-2 text-sm font-semibold text-ink">{group.label}</p>
              <div className="flex flex-wrap gap-2">
                {group.examples.map((ex) => (
                  <Chip key={ex} onClick={() => pickExample(`${group.label.replace("…", "")} ${ex}`)}>
                    {ex}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
