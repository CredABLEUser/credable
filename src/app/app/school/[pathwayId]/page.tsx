import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { readDB } from "@/lib/db";
import { getPathway } from "@/lib/school/content";
import { Breadcrumb, Card, Badge } from "@/components/ui/Primitives";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";

const STATUS_ICON = { not_started: Circle, in_progress: PlayCircle, completed: CheckCircle2 } as const;

export default async function PathwayPage(props: PageProps<"/app/school/[pathwayId]">) {
  const { pathwayId } = await props.params;
  const pathway = getPathway(pathwayId);
  if (!pathway) notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/");

  const db = readDB();
  const progress = db.schoolProgress.filter((p) => p.userId === user.id && p.pathwayId === pathwayId);

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <Breadcrumb items={[{ label: "CredABLE School", href: "/app/school" }, { label: pathway.label }]} />
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{pathway.label}</h1>
      <p className="mt-1 text-sm text-ink-soft">{pathway.description}</p>

      <div className="mt-6 space-y-2">
        {pathway.lessons.map((lesson, i) => {
          const status = progress.find((p) => p.lessonId === lesson.id)?.status ?? "not_started";
          const Icon = STATUS_ICON[status];
          return (
            <Link key={lesson.id} href={`/app/school/${pathwayId}/${lesson.id}`}>
              <Card className="flex items-center gap-3 transition-shadow hover:shadow-sm">
                <Icon size={20} className={status === "completed" ? "text-brand shrink-0" : "text-ink-soft/50 shrink-0"} />
                <div className="min-w-0">
                  <p className="text-xs text-ink-soft/70">Lesson {i + 1}</p>
                  <p className="truncate font-medium text-ink">{lesson.title}</p>
                </div>
                {status === "in_progress" && (
                  <Badge tone="accent">Continue</Badge>
                )}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
