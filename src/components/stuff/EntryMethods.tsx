"use client";

import { useState } from "react";
import { Link2, Plus, Compass, ArrowRight } from "lucide-react";
import { AddItemForm } from "./AddItemForm";
import { StuffCategoryMeta } from "@/lib/config";
import { simulateConnect, helpMeFindIt } from "@/lib/actions/stuff";
import { StuffCategory } from "@/lib/types";

type Mode = null | "manual";

export function EntryMethods({
  category,
  meta,
  connectable,
  defaultOpen,
}: {
  category: StuffCategory;
  meta: StuffCategoryMeta;
  connectable: boolean;
  defaultOpen?: boolean;
}) {
  const [mode, setMode] = useState<Mode>(defaultOpen ? "manual" : null);

  if (mode === "manual") {
    return <AddItemForm category={category} meta={meta} defaultOpen onClose={() => setMode(null)} />;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <button
        onClick={() => setMode("manual")}
        className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-white p-4 text-left transition-shadow hover:shadow-sm"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
          <Plus size={16} />
        </span>
        <span className="text-sm font-medium text-ink">Add it manually</span>
        <span className="text-xs text-ink-soft">Type it in yourself — an estimate is fine.</span>
      </button>

      {connectable ? (
        <form action={simulateConnect.bind(null, category)}>
          <button
            type="submit"
            className="flex w-full flex-col items-start gap-2 rounded-2xl border border-border bg-white p-4 text-left transition-shadow hover:shadow-sm"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
              <Link2 size={16} />
            </span>
            <span className="text-sm font-medium text-ink">Connect it</span>
            <span className="text-xs text-ink-soft">
              Securely link your bank or account. (Prototype: this simulates a connection with sample data — see the
              README for wiring up real bank connections.)
            </span>
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-start gap-2 rounded-2xl border border-dashed border-border bg-white/60 p-4 text-left opacity-70">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
            <Link2 size={16} />
          </span>
          <span className="text-sm font-medium text-ink">Connect it</span>
          <span className="text-xs text-ink-soft">Not available for this category yet — add it manually instead.</span>
        </div>
      )}

      <form action={helpMeFindIt.bind(null, category, meta.label)}>
        <button
          type="submit"
          className="flex w-full flex-col items-start gap-2 rounded-2xl border border-border bg-white p-4 text-left transition-shadow hover:shadow-sm"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
            <Compass size={16} />
          </span>
          <span className="text-sm font-medium text-ink">Help me find it</span>
          <span className="text-xs text-ink-soft">
            Not sure what you have or where to look? CredABLE will walk you through it. <ArrowRight size={12} className="inline" />
          </span>
        </button>
      </form>
    </div>
  );
}
