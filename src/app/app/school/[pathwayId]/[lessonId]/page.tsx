import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { readDB } from "@/lib/db";
import { getLesson } from "@/lib/school/content";
import { markProgress } from "@/lib/actions/school";
import { LessonViewTracker } from "@/components/school/LessonViewTracker";
import { Breadcrumb } from "@/components/ui/Primitives";
import { Button, LinkButton } from "@/components/ui/Button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default async function LessonPage(props: PageProps<"/app/school/[pathwayId]/[lessonId]">) {
  const { pathwayId, lessonId } = await props.params;
  const found = getLesson(pathwayId, lessonId);
  if (!found) notFound();
  const { pathway, lesson } = found;

  const user = await getCurrentUser();
  if (!user) redirect("/");

  const db = readDB();
  const existing = db.schoolProgress.find(
    (p) => p.userId === user.id && p.pathwayId === pathwayId && p.lessonId === lessonId
  );
  const completed = existing?.status === "completed";

  const idx = pathway.lessons.findIndex((l) => l.id === lessonId);
  const next = pathway.lessons[idx + 1];
  const markComplete = markProgress.bind(null, pathwayId, lessonId, "completed");

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <Breadcrumb
        items={[
          { label: "CredABLE School", href: "/app/school" },
          { label: pathway.label, href: `/app/school/${pathwayId}` },
          { label: lesson.title },
        ]}
      />
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{lesson.title}</h1>
      <p className="mt-1 text-sm text-ink-soft">{lesson.summary}</p>

      <LessonViewTracker pathwayId={pathwayId} lessonId={lessonId} alreadyStarted={!!existing} />

      <div className="mt-6 space-y-4">
        {lesson.body.map((p, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-ink">
            {p}
          </p>
        ))}
      </div>

      {lesson.bridge && (
        <div className="mt-8 rounded-2xl border border-brand/30 bg-brand-soft/40 p-5">
          <p className="mb-3 text-sm font-medium text-brand-strong">{lesson.bridge.prompt}</p>
          <LinkButton href={lesson.bridge.href} size="sm">
            {lesson.bridge.label} <ArrowRight size={14} />
          </LinkButton>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
        {completed ? (
          <span className="flex items-center gap-1.5 text-sm font-medium text-brand-strong">
            <CheckCircle2 size={16} /> Completed
          </span>
        ) : (
          <form action={markComplete}>
            <Button type="submit" variant="secondary" size="sm">
              <CheckCircle2 size={16} /> Mark complete
            </Button>
          </form>
        )}
        {next && (
          <Link
            href={`/app/school/${pathwayId}/${next.id}`}
            className="ml-auto flex items-center gap-1.5 text-sm font-medium text-brand-strong hover:underline"
          >
            Next: {next.title} <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
