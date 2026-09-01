import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { LandingPrompt } from "@/components/chat/LandingPrompt";

export default async function LandingPage() {
  const user = await getCurrentUser();
  if (user) redirect("/app");

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="text-lg font-semibold tracking-tight text-brand-strong">CredABLE</span>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-6 sm:px-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Level the playing field</p>
        <h1 className="mb-3 max-w-xl text-balance text-center text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          What needs attention right now?
        </h1>
        <p className="mb-8 max-w-md text-balance text-center text-ink-soft">
          Tell CredABLE what&apos;s happening, in your own words. No categories to choose, no forms to fill out first.
        </p>
        <LandingPrompt />

        <p className="mt-10 max-w-md text-center text-xs text-ink-soft/70">
          Free to start — 3 complete conversations, no credit card required. CredABLE is not a bank, lender, or
          licensed advisor; it helps you understand your options and prepares you for the professionals who are.
        </p>
      </main>
    </div>
  );
}
