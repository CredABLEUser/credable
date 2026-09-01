import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { readDB } from "@/lib/db";
import { PATHWAYS } from "@/lib/school/content";
import { Card, Badge } from "@/components/ui/Primitives";

export default async function SchoolIndexPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const db = readDB();
  const progress = db.schoolProgress.filter((p) => p.userId === user.id);

  function pathwayStats(pathwayId: string, total: number) {
    const done = progress.filter((p) => p.pathwayId === pathwayId && p.status === "completed").length;
    return { done, total };
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">CredABLE School</h1>
      <p className="mt-1 text-sm text-ink-soft">What do you want to understand better?</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {PATHWAYS.map((p) => {
          const stats = pathwayStats(p.id, p.lessons.length);
          const featured = p.id === "leverage";
          return (
            <Link key={p.id} href={`/app/school/${p.id}`}>
              <Card className={`h-full transition-shadow hover:shadow-sm ${featured ? "border-brand/40 bg-brand-soft/30" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-ink">{p.label}</p>
                  {featured && <Badge tone="brand">Core CredABLE philosophy</Badge>}
                </div>
                <p className="mt-1 text-sm text-ink-soft">{p.description}</p>
                {stats.done > 0 && (
                  <p className="mt-2 text-xs text-ink-soft/70">
                    {stats.done} of {stats.total} completed
                  </p>
                )}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
