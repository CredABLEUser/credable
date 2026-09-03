import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { Card, Badge } from "@/components/ui/Primitives";

export const metadata = {
  title: "About",
  description:
    "CredABLE was built by Liana Pomeroy, a 25-year mortgage lender and real estate investor, from real experience on both sides of the desk.",
};

const SPECIALTIES = [
  "Credit repair & low-FICO lending",
  "Self-employed borrowers",
  "First-time homebuyers",
  "Investment property financing",
  "Divorce & life-transition finance",
];

const COMMUNITY = [
  { org: "The Collective of Real Estate Women", role: "Founder — a real estate investment group built for and by women." },
  { org: "Rocky Mountain MicroFinance", role: "Taught and mentored low-income entrepreneurs." },
  { org: "Family Self-Sufficiency of Boulder County", role: "Board member." },
  { org: "The Denver Voice", role: "Board member." },
  { org: "Boulder YWCA", role: "Board member." },
  { org: "High schoolers & young adults", role: "Taught credit and financial fundamentals." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <Link href="/" className="text-sm font-medium text-brand-strong hover:underline">
        ← Back to CredABLE
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <Wordmark className="text-2xl" />
      </div>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink">About CredABLE</h1>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft">
        Real financial guidance, built from decades on the inside of the lending industry — and from having lived
        through the hard parts myself.
      </p>

      <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-sm">
        <iframe
          src="https://player.vimeo.com/video/1218727750"
          className="h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="An introduction to CredABLE, from founder Liana Pomeroy"
        />
      </div>

      <Card className="mt-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-brand-soft text-lg font-bold text-brand-strong">
            LP
          </div>
          <div>
            <p className="text-base font-semibold text-ink">Liana Pomeroy</p>
            <p className="text-sm text-ink-soft">Founder, CredABLE · Senior Mortgage Loan Advisor</p>
            <p className="mt-1 text-xs text-ink-soft/70">
              NMLS #295506 · Licensed in Colorado, Florida, California, Tennessee, and Texas
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {SPECIALTIES.map((s) => (
            <Badge key={s} tone="brand">
              {s}
            </Badge>
          ))}
        </div>
      </Card>

      <div className="mt-8 space-y-4 text-sm leading-relaxed text-ink-soft">
        <h2 className="text-base font-semibold text-ink">Who&apos;s behind this</h2>
        <p>
          I&apos;ve spent 25 years as a residential mortgage lender, working directly with thousands of clients
          across multiple states to buy and refinance homes — the kind of work that puts you in the room for
          people&apos;s best financial moments and their hardest ones. I&apos;m also a real estate investor myself,
          so the strategies in CredABLE aren&apos;t theoretical; they&apos;re the same ones I use.
        </p>
        <p>
          Along the way, I&apos;ve specialized in the situations that don&apos;t fit a standard file: low-FICO and
          credit-repair borrowers, self-employed and low-documentation borrowers, first-time homebuyers, and
          investment financing of every kind, from fix-and-flip to construction to bridge loans.
        </p>
        <p>
          I&apos;ve also been through a divorce, a natural disaster, and real financial hardship, and I&apos;ve
          rebuilt from each of them. CredABLE exists because I&apos;ve sat across the desk from hundreds of people
          navigating exactly what I&apos;ve been through, and I built the resource I wish more of them had access to
          before things went sideways, not after. At the core of it, I&apos;m passionate about leveling the playing
          field for anyone trying to change their financial situation — and making sure financial literacy is
          accessible to everyone, regardless of where they come from.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-base font-semibold text-ink">Community involvement</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Financial literacy and access have been a constant focus alongside my lending work. This reflects my
          background, not a current role:
        </p>
        <ul className="mt-3 space-y-2">
          {COMMUNITY.map((c) => (
            <li key={c.org} className="text-sm text-ink-soft">
              <span className="font-semibold text-ink">{c.org}</span> — {c.role}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-ink">What CredABLE is</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            CredABLE is a financial literacy and credit-building coach: plain-language guidance and tools built
            around the real situations people actually face — becoming bankable from scratch, rebuilding after
            credit damage, navigating divorce, building credit as a newcomer to the U.S., and running the financial
            side of self-employment. Every answer is written to explain terms in plain language on first use, with
            no assumption that you already know the jargon.
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-ink">What CredABLE is not</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            CredABLE is educational guidance, not individualized legal, tax, or financial advice, and not a
            credit-repair service. Nothing here replaces a conversation with a qualified attorney, tax advisor, or
            financial professional about your specific situation.
          </p>
        </div>
      </div>

      <Card className="mt-8 bg-brand-soft/40">
        <p className="text-sm text-ink-soft">
          Have a correction, a question about something CredABLE told you, or a partnership inquiry? Reach out at{" "}
          <a href="mailto:info@credableclub.com" className="font-semibold text-brand-strong hover:underline">
            info@credableclub.com
          </a>{" "}
          — every message gets read.
        </p>
      </Card>
    </div>
  );
}

