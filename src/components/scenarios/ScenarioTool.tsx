"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SCENARIOS } from "@/lib/scenarios";
import { Scenario } from "@/lib/types";
import { Card, Badge } from "../ui/Primitives";
import { Button } from "../ui/Button";
import { saveScenario, deleteScenario } from "@/lib/actions/scenarios";

export function ScenarioTool({
  type,
  initialInputs,
  savedScenarios,
}: {
  type: string;
  initialInputs: Record<string, number | string>;
  savedScenarios: Scenario[];
}) {
  const def = SCENARIOS[type];
  const [inputs, setInputs] = useState<Record<string, number | string>>(initialInputs);
  const [saveName, setSaveName] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const output = useMemo(() => {
    try {
      return def.compute(inputs);
    } catch {
      return null;
    }
  }, [def, inputs]);

  function setField(key: string, value: string) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!output) return;
    setSaving(true);
    await saveScenario(def.type as never, saveName || def.label, inputs, output as unknown as Record<string, unknown>);
    setSaving(false);
    setSaveName("");
    router.refresh();
  }

  function loadSaved(s: Scenario) {
    setInputs(s.inputs);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <Card>
          <p className="mb-4 font-medium text-ink">{def.question}</p>
          <div className="space-y-4">
            {def.fields.map((f) => (
              <div key={f.key}>
                <label className="mb-1 flex items-center gap-2 text-sm font-medium text-ink">
                  {f.label}
                  {f.isAssumption && <Badge tone="accent">Assumption</Badge>}
                </label>
                {f.help && <p className="mb-1 text-xs text-ink-soft">{f.help}</p>}
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={inputs[f.key] ?? ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                    className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                  />
                  {f.type === "percent" && (
                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-soft">%</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <input
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Name this scenario (optional)"
              className="min-w-0 flex-1 rounded-full border border-border px-3.5 py-2 text-sm outline-none focus:border-brand"
            />
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save scenario"}
            </Button>
          </div>
        </Card>

        {savedScenarios.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-ink-soft">Saved</p>
            <div className="space-y-2">
              {savedScenarios.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-border bg-white px-3.5 py-2">
                  <button onClick={() => loadSaved(s)} className="text-sm text-ink hover:underline">
                    {s.name}
                  </button>
                  <form action={deleteScenario.bind(null, s.id, def.type)}>
                    <button type="submit" className="text-xs text-ink-soft hover:text-danger">
                      Remove
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        {output && (
          <Card className="border-brand/30 bg-brand-soft/30">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-strong/70">Result</p>
            <p className="mt-1 text-xl font-semibold text-ink">{output.headline}</p>
            <p className="mt-2 text-sm text-ink-soft">{output.interpretation}</p>

            <div className="mt-5 space-y-5">
              {output.groups.map((g, i) => (
                <div key={i}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft/70">{g.title}</p>
                  <div className="space-y-1.5">
                    {g.lines.map((line, j) => (
                      <div key={j} className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="text-ink-soft">{line.label}</span>
                        <span className={line.emphasis ? "font-semibold text-ink" : "text-ink"}>{line.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
