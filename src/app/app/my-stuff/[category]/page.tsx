import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { readDB } from "@/lib/db";
import { STUFF_CATEGORY_META, SOURCE_LABELS, CONNECTABLE_CATEGORIES } from "@/lib/config";
import { Card, EmptyState, Badge, Breadcrumb } from "@/components/ui/Primitives";
import { EntryMethods } from "@/components/stuff/EntryMethods";
import { money } from "@/lib/ai/context";
import { StuffCategory } from "@/lib/types";

export default async function StuffCategoryPage(props: PageProps<"/app/my-stuff/[category]">) {
  const { category } = await props.params;
  const search = await props.searchParams;
  const meta = STUFF_CATEGORY_META[category];
  if (!meta) notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/");

  const db = readDB();
  const items = db.financialItems.filter((i) => i.userId === user.id && i.category === category);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <Breadcrumb items={[{ label: "My Stuff", href: "/app/my-stuff" }, { label: meta.label }]} />
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{meta.label}</h1>
      <p className="mt-1 text-sm text-ink-soft">{meta.helper}</p>

      {search.connected === "1" && (
        <div className="mt-4 rounded-xl bg-brand-soft/60 px-4 py-2.5 text-sm text-brand-strong">
          Connected — we pulled in sample account data for this preview. Nothing here touches a real bank yet.
        </div>
      )}

      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <EmptyState title={`Nothing here yet`} description="Add what you know — an estimate is fine." />
        ) : (
          items.map((item) => (
            <Link key={item.id} href={`/app/my-stuff/${category}/${item.id}`}>
              <Card className="flex items-center justify-between transition-shadow hover:shadow-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{item.name}</p>
                  <p className="text-sm text-ink-soft">{item.subtype || meta.label}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {(item.value != null || item.monthlyAmount != null) && (
                    <span className="text-sm font-medium text-ink">
                      {item.value != null ? money(item.value) : `${money(item.monthlyAmount)}/mo`}
                    </span>
                  )}
                  <Badge>{SOURCE_LABELS[item.source]}</Badge>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      <div className="mt-6">
        <EntryMethods
          category={category as StuffCategory}
          meta={meta}
          connectable={CONNECTABLE_CATEGORIES.includes(category as StuffCategory)}
          defaultOpen={search.add === "1"}
        />
      </div>
    </div>
  );
}
