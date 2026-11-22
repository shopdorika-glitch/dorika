import { cn } from "@/lib/utils";

/**
 * Editorial section header: a small mono annotation over a display line,
 * with an optional index ("01") that keeps long pages navigable.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  index,
  className,
  action,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  index?: string;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-6 sm:mb-14",
        action && "md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {(eyebrow || index) && (
          <div
            className={cn(
              "mb-4 flex items-center gap-3",
              align === "center" && "justify-center"
            )}
          >
            {index && <span className="figure text-clay">{index}</span>}
            {index && eyebrow && <span className="h-px w-6 bg-line-strong" aria-hidden="true" />}
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          </div>
        )}
        <h2 className="display-2">{title}</h2>
        {subtitle && (
          <p className={cn("mt-4 max-w-xl text-ink-soft", align === "center" && "mx-auto")}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
