import { redirect } from "next/navigation";
import { Compass, CheckCircle2, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { LandingPrompt } from "@/components/chat/LandingPrompt";
import { HeroHeadline } from "@/components/chat/HeroHeadline";
import { Wordmark } from "@/components/ui/Wordmark";
import { ClubBanner } from "@/components/ui/ClubBanner";

const EXPECT_STEPS = [
  { icon: Compass, label: "See where you really stand" },
  { icon: CheckCircle2, label: "Build real credibility (that's the CRED)" },
  { icon: ArrowRight, label: "Know exactly what to do with it (that's the ABLE)" },
];

export default async function LandingPage() {
  const user = await getCurrentUser();
  if (user) redirect("/app");

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Decorative background depth */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-brand/15 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-pale-blue/50 blur-3xl" />
      </div>

      <header className="relative flex flex-col items-start gap-3 border-b border-border/80 bg-surface/70 px-6 py-6 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-4 sm:px-10 sm:py-7">
        <Wordmark className="text-4xl sm:text-5xl" />
        <div className="hidden h-10 w-px bg-border sm:block" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-strong">Build credit. Master leverage.</p>
          <p className="mt-1 max-w-xs text-[11px] leading-snug text-ink-soft/70">
            <span className="font-semibold text-accent">CRED</span> is your credit &amp; street cred — the access
            you build.
            <br />
            <span className="font-semibold text-brand-strong">ABLE</span> is knowing exactly what to do with it.
          </p>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col items-center px-6 py-10 sm:px-10 sm:py-14">
        <HeroHeadline />

        <span className="mb-8 inline-flex items-center rounded-full bg-accent-soft px-4 py-1.5 text-center text-xs font-semibold text-accent">
          We level the playing field so you can level up.
        </span>

        <p className="mb-6 max-w-xl text-balance text-center text-lg font-medium leading-relaxed text-brand-strong">
          We aren&apos;t your typical credit repair or financial advice app. At CredABLE, we meet you where you
          are.
        </p>

        <div className="mb-8 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { q: "Need to fix your credit?", a: "We've got you." },
            { q: "Need to build credit from scratch and don't know where to start?", a: "We've got you!" },
            { q: "Getting divorced and worried it will impact your finances and credit?", a: "We've got you." },
            { q: "Overwhelmed and drowning in debt?", a: "We've got you." },
            {
              q: "Feeling stuck on this hamster wheel of earn, spend, repeat and know there's a better way?",
              a: "We've got you too!",
            },
          ].map((item) => (
            <div
              key={item.q}
              className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 text-left shadow-sm"
            >
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent" />
              <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
                {item.q}
                <span className="block font-semibold text-brand-strong">{item.a}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mb-8 h-px w-16 bg-border" />

        <p className="mb-8 max-w-lg text-balance text-center text-base leading-relaxed text-ink-soft">
          CredABLE is the coach in your pocket — guiding you as you need it, while you build or repair credit, learn
          to manage your money so banks and lenders say yes, and begin to take advantage of the financing, tools,
          tech and people available to build the life you want to live.
        </p>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {EXPECT_STEPS.map((step, i) => (
            <span key={step.label} className="flex items-center gap-x-6">
              <span className="flex items-center gap-1.5 text-xs font-medium text-ink-soft">
                <step.icon size={14} className="text-brand" />
                {step.label}
              </span>
              {i < EXPECT_STEPS.length - 1 && <span className="text-border">·</span>}
            </span>
          ))}
        </div>

        <LandingPrompt />

        <p className="mt-6 max-w-md text-center text-[11px] leading-relaxed text-ink-soft/60">
          Free to start — 3 complete conversations, no credit card required. Not a bank, lender, or licensed advisor.
        </p>

        <div className="mt-8">
          <ClubBanner />
        </div>
      </main>
    </div>
  );
}
