import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { readDB } from "@/lib/db";
import { AppPrompt } from "@/components/chat/AppPrompt";
import { Card } from "@/components/ui/Primitives";
import { startNewQuestionFlow } from "@/lib/actions/runs";
import { ArrowRight, MessageCircle } from "lucide-react";

export default async function TodayPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const db = readDB();
  const worries = db.worries.filter((w) => w.userId === user.id && w.status !== "resolved").slice(0, 3);
  const goals = db.goals.filter((g) => g.userId === user.id).slice(0, 3);
  const activeRun = user.activeRunId ? db.runs.find((r) => r.id === user.activeRunId) : null;
  const inProgressLessons = db.schoolProgress.filter((s) => s.userId === user.id && s.status === "in_progress").slice(0, 2);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-5 py-10 sm:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">What needs attention right now?</h1>
        <p className="mt-1 text-sm text-ink-soft">Say what&apos;s happening — CredABLE will figure out where to go from there.</p>
      </div>

      {activeRun ? (
        <Card className="flex items-center justify-between gap-4 border-brand/30 bg-brand-soft/40">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-strong/70">Continue where you left off</p>
            <p className="mt-1 truncate font-medium text-ink">{activeRun.title}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/app/ask/${activeRun.id}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-strong"
            >
              Continue <ArrowRight size={15} />
            </Link>
          </div>
        </Card>
      ) : (
        <AppPrompt hasActiveRun={false} />
      )}

      {activeRun && (
        <form action={startNewQuestionFlow}>
          <button type="submit" className="text-sm text-ink-soft underline underline-offset-2 hover:text-ink">
            Ask about something else instead
          </button>
        </form>
      )}

      {(worries.length > 0 || goals.length > 0 || inProgressLessons.length > 0) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {worries.map((w) => (
            <Link key={w.id} href={`/app/my-worries/${w.id}`} className="block">
              <Card className="h-full transition-shadow hover:shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-soft/70">Open worry</p>
                <p className="mt-1 font-medium text-ink">{w.title}</p>
              </Card>
            </Link>
          ))}
          {goals.map((g) => (
            <Link key={g.id} href={`/app/my-goals/${g.id}`} className="block">
              <Card className="h-full transition-shadow hover:shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-soft/70">Goal · {g.timing}</p>
                <p className="mt-1 font-medium text-ink">{g.title}</p>
              </Card>
            </Link>
          ))}
          {inProgressLessons.map((l) => (
            <Link key={l.id} href={`/app/school/${l.pathwayId}/${l.lessonId}`} className="block">
              <Card className="h-full transition-shadow hover:shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-soft/70">Continue learning</p>
                <p className="mt-1 font-medium text-ink">Pick up where you left off in CredABLE School</p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!activeRun && worries.length === 0 && goals.length === 0 && (
        <Card className="flex items-center gap-3 text-sm text-ink-soft">
          <MessageCircle size={18} className="shrink-0 text-brand" />
          Nothing tracked yet — ask CredABLE something above, or explore My Stuff, My Goals, or CredABLE School from
          the navigation any time.
        </Card>
      )}
    </div>
  );
}
