import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { readDB } from "@/lib/db";
import { Breadcrumb, Card, Badge } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { askAboutWorry, setWorryStatus } from "@/lib/actions/worries";
import { WorryStatus } from "@/lib/types";

const STATUSES: WorryStatus[] = ["new", "working", "waiting", "resolved"];
const LABEL: Record<WorryStatus, string> = {
  new: "New",
  working: "Working on it",
  waiting: "Waiting",
  resolved: "Resolved",
};

export default async function WorryDetailPage(props: PageProps<"/app/my-worries/[worryId]">) {
  const { worryId } = await props.params;
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const db = readDB();
  const worry = db.worries.find((w) => w.id === worryId && w.userId === user.id);
  if (!worry) notFound();

  const runs = db.runs.filter((r) => worry.relatedRunIds.includes(r.id));
  const askWithId = askAboutWorry.bind(null, worryId);

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <Breadcrumb items={[{ label: "My Worries", href: "/app/my-worries" }, { label: worry.title }]} />
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{worry.title}</h1>
      {worry.description && <p className="mt-2 text-sm text-ink-soft">{worry.description}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const update = setWorryStatus.bind(null, worryId, s);
          return (
            <form action={update} key={s}>
              <button
                type="submit"
                className={
                  worry.status === s
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
          <Button type="submit">What should I do?</Button>
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
