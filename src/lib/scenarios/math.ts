export function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function fmtSigned(n: number): string {
  return `${n >= 0 ? "+" : "-"}${fmt(Math.abs(n))}`;
}

export function pct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

/** Standard amortizing loan payment. */
export function amortizedPayment(principal: number, annualRatePct: number, termMonths: number): number {
  if (termMonths <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (principal * r) / (1 - Math.pow(1 + r, -termMonths));
}

export function totalInterest(payment: number, termMonths: number, principal: number): number {
  return Math.max(payment * termMonths - principal, 0);
}

export function num(v: number | string | undefined, fallback = 0): number {
  if (v === undefined || v === "") return fallback;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(/[$,%]/g, ""));
  return Number.isFinite(n) ? n : fallback;
}
