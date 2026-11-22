import Link from "next/link";
import { cn, formatNPR } from "@/lib/utils";

export function PanelHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
      <div>
        <h1 className="font-display text-[1.7rem] leading-tight tracking-display text-ink">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatTile({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
  href?: string;
}) {
  const body = (
    <>
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-muted">{label}</p>
      <p className="mt-2 font-display text-2xl tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </>
  );

  const className = "block border border-line bg-surface p-4 transition-colors hover:border-line-strong sm:p-5";

  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

export function Notice({
  kind,
  children,
}: {
  kind: "success" | "error" | "info";
  children: React.ReactNode;
}) {
  const styles = {
    success: "border-l-2 border-success bg-success-tint text-success",
    error: "border-l-2 border-danger bg-danger-tint text-danger",
    info: "border-l-2 border-line-strong bg-paper-2 text-ink-soft",
  } as const;

  return (
    <div role="status" className={cn("mb-4 px-4 py-3 text-sm", styles[kind])}>
      {children}
    </div>
  );
}

export function EmptyPanel({
  title,
  hint,
  actionLabel,
  actionHref,
}: {
  title: string;
  hint: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="border border-dashed border-line-strong px-6 py-14 text-center">
      <h3 className="font-display text-lg tracking-tight text-ink">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ink-soft">{hint}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary btn-md mt-5">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export function MoneyRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-soft">{label}</span>
      <span className="tnum text-ink">{formatNPR(value)}</span>
    </div>
  );
}
