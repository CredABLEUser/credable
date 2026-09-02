"use client";

import { useEffect, useRef, useState } from "react";

const PROMPTS = [
  "Just starting your financial journey?",
  "Getting divorced and worried how it will impact your credit and finances?",
  "Drowning in debt and not sure what to do about it?",
  "Just moved to the U.S. and need help establishing credit and banking?",
  "Need a quick credit fix?",
  "Feeling stuck and need help leveling up your finances?",
  "Self employed and need a loan?",
];

const HOLD_MS = 2000;
const ROLL_MS = 400;

type Phase = "in" | "out" | "below";

export function HeroHeadline() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("in");
  const swapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const raf1 = useRef<number | null>(null);
  const raf2 = useRef<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Roll the current line up and out.
      setPhase("out");
      swapTimeout.current = setTimeout(() => {
        // Swap the text, drop it below (no transition), then roll it up into place.
        setIndex((i) => (i + 1) % PROMPTS.length);
        setPhase("below");
        raf1.current = requestAnimationFrame(() => {
          raf2.current = requestAnimationFrame(() => setPhase("in"));
        });
      }, ROLL_MS);
    }, HOLD_MS);

    return () => {
      clearInterval(interval);
      if (swapTimeout.current) clearTimeout(swapTimeout.current);
      if (raf1.current) cancelAnimationFrame(raf1.current);
      if (raf2.current) cancelAnimationFrame(raf2.current);
    };
  }, []);

  const rolling =
    phase === "in"
      ? "translate-y-0 opacity-100 transition-all ease-out"
      : phase === "out"
        ? "-translate-y-2.5 opacity-0 transition-all ease-in"
        : "translate-y-2.5 opacity-0"; // positioned below, no transition — about to roll up

  return (
    <div className="mb-2 min-h-[2.4em] max-w-2xl overflow-hidden sm:min-h-[2.1em]">
      <h1
        className={`text-balance text-center text-2xl font-semibold tracking-tight text-ink sm:text-4xl ${rolling}`}
        style={{ transitionDuration: `${ROLL_MS}ms` }}
      >
        {PROMPTS[index]}
      </h1>
    </div>
  );
}
