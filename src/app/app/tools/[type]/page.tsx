import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { readDB } from "@/lib/db";
import { SCENARIOS } from "@/lib/scenarios";
import { prefillInputs } from "@/lib/scenarios/prefill";
import { Breadcrumb } from "@/components/ui/Primitives";
import { ScenarioTool } from "@/components/scenarios/ScenarioTool";

export default async function ToolPage(props: PageProps<"/app/tools/[type]">) {
  const { type } = await props.params;
  const def = SCENARIOS[type];
  if (!def) notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/");

  const db = readDB();
  const items = db.financialItems.filter((i) => i.userId === user.id);
  const saved = db.scenarios.filter((s) => s.userId === user.id && s.type === type).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const initialInputs = prefillInputs(def, items);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
      <Breadcrumb items={[{ label: "Tools", href: "/app/tools" }, { label: def.label }]} />
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{def.label}</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Change any number — CredABLE recalculates instantly. Fields marked &quot;Assumption&quot; are CredABLE&apos;s estimate, not
        something you told us.
      </p>
      <div className="mt-6">
        <ScenarioTool type={type} initialInputs={initialInputs} savedScenarios={saved} />
      </div>
    </div>
  );
}
