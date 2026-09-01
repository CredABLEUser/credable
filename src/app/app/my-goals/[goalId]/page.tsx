import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { readDB } from "@/lib/db";
import { Breadcrumb, Card, Badge } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { askAboutGoal, setGoalStatus } from "@/lib/actions/goals";
import { GoalStatus } from "@/lib/types";

const STATUSES: GoalStatus[] = ["not_started", "in_progress", "on_track", "at_risk", "done"];
const LABEL: Record<GoalStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  on_track: "On track",
  at_risk: "Needs attention",
  done: "Done",
};

export default async function GoalDetailPage(props: PageProps<"/app/my-goals/[goalId]">) {
  const { goalId } = await props.params;
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const db = readDB();
  const goal = db.goals.find((g) => g.id === goalId && g.userId === user.id);
  if (!goal) notFound();

  const runs = db.runs.filter((r) => goal.relatedRunIds.includes(r.id));
  const askWithId = askAboutGoal.bind(null, goalId);

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <Breadcrumb items={[{ label: "My Goals", href: "/app/my-goals" }, { label: goal.title }]} />
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{goal.title}</h1>
      <p className="mt-1 text-sm text-ink-soft">{goal.timing}</p>
      {goal.notes && <p className="mt-2 text-sm text-ink-soft">{goal.notes}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const update = setGoalStatus.bind(null, goalId, s);
          return (
            <form action={update} key={s}>
              <button
                type="submit"
                className={
                  goal.status === s
                    ? "rounded-full bg-brand px-3.5 py-1.5 text-xs font-medium text-white"
                    : "rounded-full border border-border px-3.5 py-1.5 text-xs text-ink-soft hover:text-ink"
                }
              >
                {LABEL[s]}
              </button>
            </form>
          );
        })}
      </div>

      <div className="mt-6">
        <form action={askWithId}>
          <Button type="submit">Help me figure this out</Button>
        </form>
      </div>

      {runs.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-sm font-medium text-ink-soft">Related conversations</p>
          <div className="space-y-2">
            {runs.map((r) => (
              <Link key={r.id} href={`/app/ask/${r.id}`}>
                <Card className="transition-shadow hover:shadow-sm">
                  <p className="text-sm font-medium text-ink">{r.title}</p>
                  <Badge>{r.status === "active" ? "Active" : "Resolved"}</Badge>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
