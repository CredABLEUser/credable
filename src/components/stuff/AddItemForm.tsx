"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { addItem } from "@/lib/actions/stuff";
import { StuffCategoryMeta } from "@/lib/config";
import { Chip } from "../ui/Primitives";
import { Button } from "../ui/Button";

const SOURCE_OPTIONS: { value: string; label: string }[] = [
  { value: "manual", label: "I know this" },
  { value: "approximate", label: "It's approximate" },
  { value: "known_unknown_details", label: "I know it exists, not the details" },
  { value: "unknown", label: "Unknown" },
];

export function AddItemForm({
  category,
  meta,
  defaultOpen,
  onClose,
}: {
  category: string;
  meta: StuffCategoryMeta;
  defaultOpen?: boolean;
  onClose?: () => void;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const [subtype, setSubtype] = useState("");

  function close() {
    if (onClose) onClose();
    else setOpen(false);
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <Plus size={16} /> Add to {meta.label}
      </Button>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-medium text-ink">Add to {meta.label}</p>
        <button onClick={close} className="text-ink-soft hover:text-ink">
          <X size={18} />
        </button>
      </div>
      <form action={addItem} className="space-y-4">
        <input type="hidden" name="category" value={category} />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">What kind is this?</label>
          <div className="flex flex-wrap gap-2">
            {meta.subtypeExamples.map((ex) => (
              <Chip key={ex} active={subtype === ex} onClick={() => setSubtype(ex)}>
                {ex}
              </Chip>
            ))}
            <Chip active={subtype === "I'm not sure"} onClick={() => setSubtype("I'm not sure")}>
              I&apos;m not sure
            </Chip>
          </div>
          <input type="hidden" name="subtype" value={subtype} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">What should we call it?</label>
          <input
            name="name"
            required
            placeholder="e.g. Chase checking, Visa ending 4821, 123 Main Street"
            className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {meta.hasValue && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">{meta.valueLabel}</label>
              <input
                name="value"
                placeholder="An estimate is fine"
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
              />
            </div>
          )}
          {meta.hasMonthly && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                {category === "income" ? "Monthly amount" : category === "credit_debt" ? "Monthly payment" : "Monthly cost"}
              </label>
              <input
                name="monthlyAmount"
                placeholder="Optional"
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
              />
            </div>
          )}
          {meta.hasRate && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Rate (APR %)</label>
              <input
                name="rate"
                placeholder="Optional"
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
              />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Whose is this?</label>
            <select
              name="owner"
              defaultValue="self"
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
          <div className="flex flex-wrap gap-2">
            {SOURCE_OPTIONS.map((opt) => (
              <label key={opt.value} className="cursor-pointer">
                <input type="radio" name="source" value={opt.value} defaultChecked={opt.value === "manual"} className="peer sr-only" />
                <span className="inline-block rounded-full border border-border px-3.5 py-1.5 text-sm text-ink-soft peer-checked:border-brand peer-checked:bg-brand-soft peer-checked:text-brand-strong">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Notes (optional)</label>
          <textarea
            name="notes"
            rows={2}
            className="w-full resize-none rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit">Save to My Stuff</Button>
        </div>
      </form>
    </div>
  );
}
