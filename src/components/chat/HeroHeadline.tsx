"use client";

import { useEffect, useState } from "react";

const PROMPTS = [
  "Just starting your financial journey?",
  "Getting divorced and worried how it will impact your credit and finances?",
  "Drowning in debt and not sure what to do about it?",
  "Just moved to the U.S. and need help establishing credit and banking?",
  "Need a quick credit fix?",
  "Feeling stuck and need help leveling up your finances?",
  "Self employed and need a loan?",
];

export function HeroHeadline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PROMPTS.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <h1
      key={index}
      className="mb-2.5 min-h-[2.6em] max-w-2xl animate-fade-hero text-balance text-center text-3xl font-semibold tracking-tight text-ink sm:min-h-[2.3em] sm:text-5xl"
    >
      {PROMPTS[index]}
    </h1>
  );
}
