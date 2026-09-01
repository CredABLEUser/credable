import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { readDB } from "@/lib/db";
import { STUFF_CATEGORY_META } from "@/lib/config";
import { Card, EmptyState } from "@/components/ui/Primitives";
import { money } from "@/lib/ai/context";

export default async function MyStuffIndexPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const db = readDB();
  const items = db.financialItems.filter((i) => i.userId === user.id);
  const present = Array.from(new Set(items.map((i) => i.category)));
  const empty = Object.keys(STUFF_CATEGORY_META).filter((c) => !present.includes(c as never));

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">My Stuff</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Your working financial life — connected data, what you&apos;ve entered, and documents, all in one place.
      </p>

      {present.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="My Stuff is empty so far"
            description="Add whatever you know — an estimate is fine. It grows as your financial life shows up here."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {present.map((cat) => {
            const meta = STUFF_CATEGORY_META[cat];
            const catItems = items.filter((i) => i.category === cat);
            const total = catItems.reduce((acc, i) => acc + (i.value ?? 0), 0);
            return (
              <Link key={cat} href={`/app/my-stuff/${cat}`}>
                <Card className="h-full transition-shadow hover:shadow-sm">
                  <p className="font-medium text-ink">{meta.label}</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    {catItems.length} item{catItems.length === 1 ? "" : "s"}
                    {total > 0 ? ` · ${money(total)}` : ""}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-10">
        <p className="mb-3 text-sm font-medium text-ink-soft">Add something new</p>
        <div className="flex flex-wrap gap-2">
          {empty.map((cat) => (
            <Link
              key={cat}
              href={`/app/my-stuff/${cat}?add=1`}
              className="rounded-full border border-border bg-white px-3.5 py-1.5 text-sm text-ink-soft hover:border-ink-soft hover:text-ink"
            >
              {STUFF_CATEGORY_META[cat].label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
