import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { readDB } from "@/lib/db";
import { Card } from "@/components/ui/Primitives";
import { LinkButton } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

export default async function HandoffConfirmPage(props: PageProps<"/app/handoffs/[handoffId]">) {
  const { handoffId } = await props.params;
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const db = readDB();
  const handoff = db.handoffs.find((h) => h.id === handoffId && h.userId === user.id);
  if (!handoff) notFound();

  return (
    <div className="mx-auto max-w-xl px-5 py-10 sm:px-8">
      <Card>
        <div className="flex items-center gap-2 text-brand-strong">
          <CheckCircle2 size={20} />
          <p className="font-medium">Connected</p>
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          Your question and the information you approved have been packaged for the {handoff.professionalType}. In a
          live deployment this triggers a real handoff (email, CRM, or booking link) — here it&apos;s recorded so you can
          see exactly what would be sent.
        </p>
        <div className="mt-4 rounded-xl bg-black/5 p-3 text-sm">
          <p className="font-medium text-ink">Question</p>
          <p className="text-ink-soft">{handoff.question || "—"}</p>
        </div>
        <LinkButton href="/app" size="sm" className="mt-5">
          Back to Today
        </LinkButton>
      </Card>
    </div>
  );
}
