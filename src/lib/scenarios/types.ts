export type FieldType = "number" | "percent" | "select" | "text";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  options?: { value: string; label: string }[];
  suffix?: string;
  defaultValue?: number | string;
  isAssumption?: boolean; // CredABLE-supplied assumption vs. user-provided fact
}

export interface ResultLine {
  label: string;
  value: string;
  emphasis?: boolean;
  note?: string;
}

export interface ResultGroup {
  title: string;
  lines: ResultLine[];
}

export interface ScenarioOutput {
  headline: string;
  interpretation: string;
  groups: ResultGroup[];
  sensitivity?: { label: string; rows: { input: string; result: string }[] };
}

export interface ScenarioDef {
  type: string;
  label: string;
  question: string;
  fields: FieldDef[];
  compute: (inputs: Record<string, number | string>) => ScenarioOutput;
}
