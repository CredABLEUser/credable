import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { RESOURCES, RESOURCE_CATEGORIES } from "@/lib/resources/data";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { Card } from "@/components/ui/Primitives";

const PROFESSIONALS = [
  { type: "attorney", label: "Attorney" },
  { type: "cpa", label: "CPA" },
  { type: "financial_advisor", label: "Financial advisor" },
];

const CATEGORY_LABELS: Record<string, string> = {
  mortgage: "Mortgage",
  credit: "Credit",
  lending: "Lending",
  debt: "Debt",
  investing: "Investing",
  protection: "Protection",
};

export default async function ResourcesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Tools + Resources</h1>
      <p className="mt-1 text-sm text-ink-soft">
        CredABLE usually brings the right resource into a conversation when it&apos;s relevant. This is just a direct way
        to browse. Best answer first, best fit second — CredABLE will tell you plainly when you don&apos;t need anything
        else.
      </p>

      <div className="mt-8 space-y-8">
        {RESOURCE_CATEGORIES.map((cat) => (
          <div key={cat}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-soft/70">
              {CATEGORY_LABELS[cat] ?? cat}
            </p>
            <div className="space-y-3">
              {RESOURCES.filter((r) => r.category === cat && r.activeStatus).map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
          </div>
        ))}

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-soft/70">Talk to someone</p>
          <Card>
            <p className="text-sm text-ink-soft">
              CredABLE helps you get prepared first — the question, the context, what to bring — so the conversation
              starts further down the field.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PROFESSIONALS.map((p) => (
                <Link
                  key={p.type}
                  href={`/app/handoffs/new/${p.type}`}
                  className="rounded-full border border-border bg-white px-3.5 py-1.5 text-sm text-ink-soft hover:border-brand hover:text-brand-strong"
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
