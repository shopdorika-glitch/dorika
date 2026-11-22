import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Dorika wordmark.
 *
 * Drawn as live text rather than SVG <text> so the letterforms always use the
 * loaded display face (and stay selectable, searchable and crisp at any size).
 * The clay thread underneath is the constant: it sweeps under the word and is
 * pinned at both ends with a nail head.
 */
export function Logo({
  className,
  variant = "dark",
  withLink = true,
}: {
  className?: string;
  variant?: "dark" | "light";
  withLink?: boolean;
}) {
  const wordmark = (
    <span
      className={cn(
        "group/logo relative inline-flex flex-col items-stretch leading-none",
        className
      )}
    >
      <span
        className={cn(
          "font-display text-[1.55rem] font-medium leading-none tracking-[-0.045em] sm:text-[1.7rem]",
          variant === "light" ? "text-ondeep" : "text-ink"
        )}
      >
        Dorika
      </span>
      <svg
        viewBox="0 0 104 12"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="mt-[3px] h-[7px] w-full"
      >
        <path
          d="M2 7 C 20 3.5, 44 10.5, 66 6 S 92 2.5, 102 6"
          fill="none"
          stroke="rgb(var(--clay))"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="transition-all duration-500 ease-out group-hover/logo:stroke-[2]"
        />
        <circle cx="2" cy="7" r="1.7" fill="rgb(var(--clay))" />
        <circle cx="102" cy="6" r="1.7" fill="rgb(var(--clay))" />
      </svg>
    </span>
  );

  if (!withLink) return wordmark;
  return (
    <Link href="/" aria-label="Dorika — home" className="inline-flex items-center">
      {wordmark}
    </Link>
  );
}

/** Compact mark — a nail ring with a single thread chord. Favicon / tight spaces. */
export function LogoMark({ className }: { className?: string }) {
  const nails = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2 - Math.PI / 2;
    return { cx: 16 + Math.cos(a) * 13, cy: 16 + Math.sin(a) * 13 };
  });
  return (
    <svg viewBox="0 0 32 32" className={cn("h-8 w-8", className)} role="img" aria-label="Dorika">
      <rect width="32" height="32" rx="2" fill="rgb(var(--deep))" />
      {nails.map((n, i) => (
        <circle key={i} cx={n.cx} cy={n.cy} r="0.55" fill="rgb(var(--on-deep) / 0.55)" />
      ))}
      <path d="M7 19 C 11 14, 21 22, 25 15" fill="none" stroke="rgb(var(--clay))" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7" cy="19" r="1.5" fill="rgb(var(--clay))" />
      <circle cx="25" cy="15" r="1.5" fill="rgb(var(--clay))" />
    </svg>
  );
}
