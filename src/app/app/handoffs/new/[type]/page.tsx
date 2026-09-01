import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getUserContext } from "@/lib/repo";
import { buildContextSummary } from "@/lib/ai/context";
import { createHandoff } from "@/lib/actions/handoffs";
import { Breadcrumb, Card } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";

const PROFESSIONAL_META: Record<string, { label: string; why: string; questionPlaceholder: string }> = {
  mortgage: {
    label: "Pomeroy Lending (mortgage)",
    why: "This connects you with CredABLE's mortgage resource for a complimentary strategy consultation.",
    questionPlaceholder: "e.g. Can this actually be structured the way we modeled it?",
  },
  attorney: {
    label: "Attorney",
    why: "For questions that depend on your legal rights, an agreement, or a court order.",
    questionPlaceholder: "e.g. How should liability and reimbursement be handled for this joint debt?",
  },
  cpa: {
    label: "CPA",
    why: "For questions where the tax consequence actually changes the decision.",
    questionPlaceholder: "e.g. What's the tax impact of selling this year versus next year?",
  },
  financial_advisor: {
    label: "Financial advisor",
    why: "For a licensed, personalized recommendation across your full financial picture.",
    questionPlaceholder: "e.g. Does this allocation make sense given my full picture?",
  },
};

export default async function NewHandoffPage(props: PageProps<"/app/handoffs/new/[type]">) {
  const { type } = await props.params;
  const meta = PROFESSIONAL_META[type];
  if (!meta) notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/");

  const ctx = getUserContext(user.id);
  const summary = ctx ? buildContextSummary(ctx) : "";

  return (
    <div className="mx-auto max-w-xl px-5 py-10 sm:px-8">
      <Breadcrumb items={[{ label: "Resources", href: "/app/resources" }, { label: meta.label }]} />
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Connect with a {meta.label}</h1>
      <p className="mt-1 text-sm text-ink-soft">{meta.why}</p>

      <Card className="mt-6">
        <form action={createHandoff} className="space-y-4">
          <input type="hidden" name="professionalType" value={type} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">What&apos;s the key question?</label>
            <textarea
              name="question"
              rows={2}
              placeholder={meta.questionPlaceholder}
              className="w-full resize-none rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">What we&apos;d share — edit anything before sending</label>
            <textarea
              name="context"
              rows={6}
              defaultValue={summary}
              className="w-full resize-none rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
            />
            <p className="mt-1.5 text-xs text-ink-soft/70">
              Nothing is sent until you approve it here. Remove anything you&apos;d rather not share.
            </p>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Approve + Connect</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
