"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { addWorry } from "@/lib/actions/worries";
import { Chip } from "../ui/Primitives";
import { Button } from "../ui/Button";

const EXAMPLES = [
  "My credit",
  "Debt",
  "Whether I can afford something",
  "Retirement",
  "My income",
  "Investing",
  "A divorce or separation",
  "I just feel financially stuck",
];

export function AddWorryForm() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <Plus size={16} /> Add a worry
      </Button>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-medium text-ink">What&apos;s on your mind?</p>
        <button onClick={() => setOpen(false)} className="text-ink-soft hover:text-ink">
          <X size={18} />
        </button>
      </div>
      <form action={addWorry} className="space-y-3">
        <textarea
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          rows={2}
          placeholder="It doesn't need to be a fully formed question — just say what's bothering you."
          className="w-full resize-none rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <Chip key={ex} onClick={() => setTitle(ex)}>
              {ex}
            </Chip>
          ))}
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save worry</Button>
        </div>
      </form>
    </div>
  );
}
