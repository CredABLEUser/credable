"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINES = [
  "Want access to all the tools?",
  "Want us to be with you as you grow your money muscles?",
];

/**
 * Persistent CLUB sign-up prompt. `compact` renders a single rotating
 * line (for tight spaces like the in-app top banner); the default
 * renders both lines stacked (for the landing page).
 */
export function ClubBanner({ compact = false }: { compact?: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!compact) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % LINES.length), 3400);
    return () => clearInterval(id);
  }, [compact]);

  if (compact) {
    return (
      <span key={index} className="animate-fade-hero">
        {LINES[index]}{" "}
        <Link href="/app/membership" className="font-semibold text-brand-strong underline underline-offset-2">
          Sign up for the CLUB today!
        </Link>
      </span>
    );
  }

  return (
    <div className="rounded-2xl border border-accent/30 bg-accent-soft/50 px-4 py-3 text-center text-sm text-ink-soft">
      {LINES.map((line) => (
        <p key={line}>
          {line}{" "}
          <Link href="/app/membership" className="font-semibold text-brand-strong underline underline-offset-2">
            Sign up for the CLUB today!
          </Link>
        </p>
      ))}
    </div>
  );
}
