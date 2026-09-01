import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { SCENARIO_LIST } from "@/lib/scenarios";
import { Card } from "@/components/ui/Primitives";

export default async function ToolsIndexPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Tools</h1>
      <p className="mt-1 text-sm text-ink-soft">
        These usually show up in context while you&apos;re talking with CredABLE — this is just a direct way in.
      </p>
      <div className="mt-6 space-y-3">
        {SCENARIO_LIST.map((s) => (
          <Link key={s.type} href={`/app/tools/${s.type}`}>
            <Card className="transition-shadow hover:shadow-sm">
              <p className="font-medium text-ink">{s.label}</p>
              <p className="mt-1 text-sm text-ink-soft">{s.question}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
