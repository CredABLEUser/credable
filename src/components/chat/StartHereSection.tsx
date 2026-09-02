"use client";

import { useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { LandingPrompt } from "./LandingPrompt";

const GOT_YOU = [
  { q: "Need to fix your credit?", a: "We've got you." },
  { q: "Need to build credit from scratch and don't know where to start?", a: "We've got you!" },
  { q: "Getting divorced and worried it will impact your finances and credit?", a: "We've got you." },
  { q: "Overwhelmed and drowning in debt?", a: "We've got you." },
  {
    q: "Feeling stuck on this hamster wheel of earn, spend, repeat and know there's a better way?",
    a: "We've got you too!",
  },
  { q: "Self employed and need help looking good to a bank?", a: "We've got you." },
];

export function StartHereSection() {
  const [picked, setPicked] = useState<{ text: string; trigger: number } | null>(null);
  const promptRef = useRef<HTMLDivElement>(null);

  function handlePick(text: string) {
    setPicked({ text, trigger: Date.now() });
    promptRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
      <div ref={promptRef} className="mb-6 w-full">
        <LandingPrompt initialQuestion={picked?.text} trigger={picked?.trigger} />
      </div>

      <div className="mb-5 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GOT_YOU.map((item) => (
          <button
            key={item.q}
            type="button"
            onClick={() => handlePick(item.q)}
            className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
          >
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent" />
            <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
              {item.q}
              <span className="block font-semibold text-brand-strong">{item.a}</span>
            </p>
          </button>
        ))}
      </div>
    </>
  );
}
