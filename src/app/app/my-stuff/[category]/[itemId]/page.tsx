import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { readDB } from "@/lib/db";
import { STUFF_CATEGORY_META, SOURCE_LABELS } from "@/lib/config";
import { Breadcrumb, Badge, Card } from "@/components/ui/Primitives";
import { updateItem, deleteItem, askAboutItem } from "@/lib/actions/stuff";
import { Button } from "@/components/ui/Button";

export default async function StuffItemPage(props: PageProps<"/app/my-stuff/[category]/[itemId]">) {
  const { category, itemId } = await props.params;
  const meta = STUFF_CATEGORY_META[category];
  if (!meta) notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/");

  const db = readDB();
  const item = db.financialItems.find((i) => i.id === itemId && i.userId === user.id);
  if (!item) notFound();

  const updateWithId = updateItem.bind(null, itemId);
  const askWithId = askAboutItem.bind(null, itemId);
  const deleteWithId = deleteItem.bind(null, itemId, category);

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <Breadcrumb
        items={[
          { label: "My Stuff", href: "/app/my-stuff" },
          { label: meta.label, href: `/app/my-stuff/${category}` },
          { label: item.name },
        ]}
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{item.name}</h1>
        <Badge tone="brand">{SOURCE_LABELS[item.source]}</Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <form action={askWithId}>
          <Button type="submit" variant="secondary" size="sm">
            Ask CredABLE about this
          </Button>
        </form>
        <form action={deleteWithId}>
          <Button type="submit" variant="ghost" size="sm">
            Remove
          </Button>
        </form>
      </div>

      <Card className="mt-6">
        <form action={updateWithId} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Name</label>
              <input
                name="name"
                defaultValue={item.name}
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Type</label>
              <input
                name="subtype"
                defaultValue={item.subtype}
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
              />
            </div>
            {meta.hasValue && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">{meta.valueLabel}</label>
                <input
                  name="value"
                  defaultValue={item.value ?? ""}
                  className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                />
              </div>
            )}
            {meta.hasMonthly && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Monthly amount</label>
                <input
                  name="monthlyAmount"
                  defaultValue={item.monthlyAmount ?? ""}
                  className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                />
              </div>
            )}
            {meta.hasRate && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Rate (APR %)</label>
                <input
                  name="rate"
                  defaultValue={item.rate ?? ""}
                  className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Whose is this?</label>
              <select
                name="owner"
                defaultValue={item.owner ?? "self"}
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand"
              >
                <option value="self">Me</option>
                <option value="spouse">Spouse / partner</option>
                <option value="joint">Joint</option>
                <option value="business">Business</option>
                <option value="dependent">A dependent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">How sure are you about this?</label>
            <select
              name="source"
              defaultValue={item.source}
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand"
            >
              {Object.entries(SOURCE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Notes</label>
            <textarea
              name="notes"
              rows={3}
              defaultValue={item.notes}
              className="w-full resize-none rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </Card>

      <p className="mt-4 text-xs text-ink-soft/70">Last updated {new Date(item.updatedAt).toLocaleDateString()}.</p>
    </div>
  );
}
