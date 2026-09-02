import clsx from "clsx";

/**
 * The CredABLE wordmark, matching the original logo treatment:
 * lowercase "cred" in soft gold, bold uppercase "ABLE" in deep purple,
 * stacked on two lines so the words read distinctly instead of running together.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={clsx("flex flex-col leading-[0.95] tracking-tight", className)}>
      <span className="font-semibold text-accent">cred</span>
      <span className="font-bold text-brand-strong">ABLE</span>
    </span>
  );
}
