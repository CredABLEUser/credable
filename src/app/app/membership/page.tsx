import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { joinTheClub, cancelMembership } from "@/lib/actions/membership";
import { Card } from "@/components/ui/Primitives";
import { MEMBERSHIP_PRICE_LABEL, MEMBERSHIP_CADENCE } from "@/lib/config";
import { CheckCircle2 } from "lucide-react";

const BENEFITS = [
  "Ask CredABLE — unlimited new questions",
  "My Financial World stays connected and up to date",
  "Every tool, scenario, and comparison",
  "CredABLE School, including the full Leverage Masterclass",
  "Saved history, plans, and reports",
  "Resource and professional handoffs when you need them",
];

export default async function MembershipPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  if (user.accountStatus === "member") {
    return (
      <div className="mx-auto max-w-xl px-5 py-14 sm:px-8">
        <Card>
          <p className="text-sm font-medium text-brand-strong">You&apos;re in the Club</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink">Membership is active</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {MEMBERSHIP_PRICE_LABEL} · {MEMBERSHIP_CADENCE} Manage billing any time.
          </p>
          {user.membershipStatus === "active" && (
            <form action={cancelMembership} className="mt-5">
              <button type="submit" className="text-sm text-ink-soft underline underline-offset-2 hover:text-ink">
                Cancel membership
              </button>
            </form>
          )}
        </Card>
      </div>
    );
  }

  const remaining = Math.max(user.freeRunsAllowed - user.freeRunsCompleted, 0);

  return (
    <div className="mx-auto max-w-xl px-5 py-14 sm:px-8">
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Keep going with CredABLE</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Join the Club</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {remaining > 0
            ? `You still have ${remaining} free conversation${remaining === 1 ? "" : "s"}. Joining just means CredABLE never runs out when your financial life keeps changing.`
            : "You've used your 3 free CredABLE conversations. If you'd like to keep asking questions, exploring options, and working through your next decisions, join the Club."}
        </p>

        <div className="my-6 flex items-baseline gap-1">
          <span className="text-3xl font-semibold text-ink">{MEMBERSHIP_PRICE_LABEL}</span>
        </div>
        <p className="mb-5 text-xs text-ink-soft">{MEMBERSHIP_CADENCE} No hidden terms.</p>

        <ul className="mb-6 space-y-2">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-ink">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand" />
              {b}
            </li>
          ))}
        </ul>

        <form action={joinTheClub}>
          <button
            type="submit"
            className="w-full rounded-full bg-brand px-5 py-3 text-sm font-medium text-white hover:bg-brand-strong"
          >
            Join the Club
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-ink-soft/70">
          Billing is handled securely via Stripe. Connect a Stripe account to accept real payments here.
        </p>
      </Card>
    </div>
  );
}
