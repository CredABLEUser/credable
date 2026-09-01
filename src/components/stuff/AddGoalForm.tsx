"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { addGoal } from "@/lib/actions/goals";
import { Chip } from "../ui/Primitives";
import { Button } from "../ui/Button";

const EXAMPLES = [
  "Buy a home",
  "Pay off debt",
  "Build credit",
  "Save more",
  "Start investing",
  "Buy real estate",
  "Grow my business",
  "Build income outside my job",
  "Retire",
  "Create more financial freedom",
];

const TIMINGS = ["Next 3-6 months", "Next year", "Next 3 years", "5-year goal", "No target date yet"];

export function AddGoalForm() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <Plus size={16} /> Add a goal
      </Button>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-medium text-ink">What do you want to accomplish?</p>
        <button onClick={() => setOpen(false)} className="text-ink-soft hover:text-ink">
          <X size={18} />
        </button>
      </div>
      <form action={addGoal} className="space-y-3">
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="I know I want things to improve, even if I don't know exactly what to call it yet"
          className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <Chip key={ex} onClick={() => setTitle(ex)}>
              {ex}
            </Chip>
          ))}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">When?</label>
          <select
            name="timing"
            defaultValue={TIMINGS[0]}
            className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand"
          >
            {TIMINGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save goal</Button>
        </div>
      </form>
    </div>
  );
}
