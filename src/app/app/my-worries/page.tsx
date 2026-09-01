import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { readDB } from "@/lib/db";
import { Card, EmptyState, Badge } from "@/components/ui/Primitives";
import { AddWorryForm } from "@/components/stuff/AddWorryForm";

const STATUS_TONE: Record<string, "neutral" | "brand" | "accent"> = {
  new: "accent",
  working: "brand",
  waiting: "neutral",
  resolved: "neutral",
};

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  working: "Working on it",
  waiting: "Waiting",
  resolved: "Resolved",
};

export default async function MyWorriesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const db = readDB();
  const worries = db.worries
    .filter((w) => w.userId === user.id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const open = worries.filter((w) => w.status !== "resolved");
  const resolved = worries.filter((w) => w.status === "resolved");

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">My Worries</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Things that are bothering you, confusing you, or creating uncertainty. They stay here until resolved.
      </p>

      <div className="mt-6 space-y-3">
        {open.length === 0 ? (
          <EmptyState title="Nothing weighing on you right now" description="Add a worry whenever something comes up." />
        ) : (
          open.map((w) => (
            <Link key={w.id} href={`/app/my-worries/${w.id}`}>
              <Card className="flex items-center justify-between gap-3 transition-shadow hover:shadow-sm">
                <p className="min-w-0 truncate font-medium text-ink">{w.title}</p>
                <Badge tone={STATUS_TONE[w.status]}>{STATUS_LABEL[w.status]}</Badge>
              </Card>
            </Link>
          ))
        )}
      </div>

      <div className="mt-6">
        <AddWorryForm />
      </div>

      {resolved.length > 0 && (
        <div className="mt-10">
          <p className="mb-3 text-sm font-medium text-ink-soft">Resolved</p>
          <div className="space-y-2">
            {resolved.map((w) => (
              <Link key={w.id} href={`/app/my-worries/${w.id}`}>
                <Card className="flex items-center justify-between gap-3 opacity-70 transition-opacity hover:opacity-100">
                  <p className="min-w-0 truncate text-sm text-ink">{w.title}</p>
                  <Badge>Resolved</Badge>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
