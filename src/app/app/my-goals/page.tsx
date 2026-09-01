import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { readDB } from "@/lib/db";
import { Card, EmptyState, Badge } from "@/components/ui/Primitives";
import { AddGoalForm } from "@/components/stuff/AddGoalForm";

const STATUS_LABEL: Record<string, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  on_track: "On track",
  at_risk: "Needs attention",
  done: "Done",
};

const STATUS_TONE: Record<string, "neutral" | "brand" | "accent" | "danger"> = {
  not_started: "neutral",
  in_progress: "brand",
  on_track: "brand",
  at_risk: "danger",
  done: "neutral",
};

export default async function MyGoalsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const db = readDB();
  const goals = db.goals.filter((g) => g.userId === user.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">My Goals</h1>
      <p className="mt-1 text-sm text-ink-soft">What you&apos;re trying to accomplish, and when.</p>

      <div className="mt-6 space-y-3">
        {goals.length === 0 ? (
          <EmptyState title="No goals yet" description="Add one whenever you're ready — it doesn't need to be precise." />
        ) : (
          goals.map((g) => (
            <Link key={g.id} href={`/app/my-goals/${g.id}`}>
              <Card className="flex items-center justify-between gap-3 transition-shadow hover:shadow-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{g.title}</p>
                  <p className="text-sm text-ink-soft">{g.timing}</p>
                </div>
                <Badge tone={STATUS_TONE[g.status]}>{STATUS_LABEL[g.status]}</Badge>
              </Card>
            </Link>
          ))
        )}
      </div>

      <div className="mt-6">
        <AddGoalForm />
      </div>
    </div>
  );
}
