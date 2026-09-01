import Link from "next/link";
import { Resource } from "@/lib/types";
import { Badge, Card } from "../ui/Primitives";
import { ExternalLink } from "lucide-react";

const HANDOFF_LINKS: Record<string, string> = {
  res_pomeroy: "/app/handoffs/new/mortgage",
};

export function ResourceCard({ resource }: { resource: Resource }) {
  const handoffHref = HANDOFF_LINKS[resource.id];
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium text-ink">{resource.name}</p>
        <Badge tone={resource.affiliateStatus ? "accent" : "neutral"}>{resource.pricing}</Badge>
      </div>
      <p className="mt-1.5 text-sm text-ink-soft">{resource.description}</p>

      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70">Helps with</p>
          <p className="text-ink-soft">{resource.helpsWith.join(", ")}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70">Watch for</p>
          <p className="text-ink-soft">{resource.doesNotHelpWith.join(", ") || "—"}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
        {handoffHref ? (
          <Link href={handoffHref} className="flex items-center gap-1 text-sm font-medium text-brand-strong hover:underline">
            Connect <ExternalLink size={13} />
          </Link>
        ) : resource.url && !resource.url.startsWith("#") ? (
          <a href={resource.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-medium text-brand-strong hover:underline">
            Learn more <ExternalLink size={13} />
          </a>
        ) : (
          <span className="text-sm text-ink-soft/60">Contact link coming soon</span>
        )}
      </div>

      {resource.affiliateStatus && resource.affiliateDisclosure && (
        <p className="mt-2 text-xs text-ink-soft/70">{resource.affiliateDisclosure}</p>
      )}
    </Card>
  );
}
