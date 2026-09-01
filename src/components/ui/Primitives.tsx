import clsx from "clsx";
import { HTMLAttributes, ReactNode } from "react";

export function Card({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("rounded-2xl border border-border bg-surface p-5", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Chip({
  children,
  className,
  active,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  active?: boolean;
} & HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={clsx(
        "rounded-full border px-3.5 py-1.5 text-sm transition-colors text-left",
        active
          ? "border-brand bg-brand-soft text-brand-strong"
          : "border-border bg-white text-ink-soft hover:border-ink-soft hover:text-ink",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "accent" | "danger";
}) {
  const toneClasses = {
    neutral: "bg-black/5 text-ink-soft",
    brand: "bg-brand-soft text-brand-strong",
    accent: "bg-accent-soft text-accent",
    danger: "bg-danger-soft text-danger",
  }[tone];
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", toneClasses)}>
      {children}
    </span>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70">{children}</p>;
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-white/60 p-8 text-center">
      <p className="font-medium text-ink">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm text-ink-soft">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-border">›</span>}
          {item.href ? (
            <a href={item.href} className="hover:text-ink hover:underline">
              {item.label}
            </a>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
