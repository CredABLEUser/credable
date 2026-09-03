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

const HOLD_MS = 3200;
const FADE_MS = 350;

export function HeroHeadline() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const swapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      swapTimeout.current = setTimeout(() => {
        setIndex((i) => (i + 1) % PROMPTS.length);
        setVisible(true);
      }, FADE_MS);
    }, HOLD_MS);

    return () => {
      clearInterval(interval);
      if (swapTimeout.current) clearTimeout(swapTimeout.current);
    };
  }, []);

  return (
    <div className="mb-2 flex h-[6.6rem] max-w-2xl items-center justify-center sm:h-[9.4rem]">
      <h1
        className={`text-balance text-center text-2xl font-semibold leading-snug tracking-tight text-ink transition-opacity ease-in-out sm:text-4xl ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: `${FADE_MS}ms` }}
      >
        {PROMPTS[index]}
      </h1>
    </div>
  );
}
