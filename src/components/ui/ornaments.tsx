import { cn } from "@/lib/utils";

/**
 * The thread — Dorika's signature motif.
 * One continuous clay-coloured line, pinned at both ends with a nail head,
 * used to separate major passages of a page the way a thread separates
 * wound sections on a plank.
 */
export function ThreadRule({
  className,
  tone = "clay",
}: {
  className?: string;
  tone?: "clay" | "ink" | "current";
}) {
  const stroke =
    tone === "clay"
      ? "rgb(var(--clay))"
      : tone === "ink"
        ? "rgb(var(--ink) / 0.35)"
        : "currentColor";
  return (
    <svg
      viewBox="0 0 1200 26"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("h-[18px] w-full", className)}
    >
      <path
        d="M4 13 C 160 6, 300 21, 460 13 S 760 5, 920 14 S 1120 19, 1196 11"
        fill="none"
        stroke={stroke}
        strokeWidth="1.25"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="4" cy="13" r="2.6" fill={stroke} />
      <circle cx="1196" cy="11" r="2.6" fill={stroke} />
    </svg>
  );
}

/**
 * A ring of nail heads, echoing the edge of a wound plank.
 * Decorative only — never a substitute for real content.
 */
export function NailRing({
  className,
  count = 96,
  beads = 2,
}: {
  className?: string;
  count?: number;
  beads?: number;
}) {
  const radius = 50;
  const nails = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return {
      cx: Number((50 + Math.cos(angle) * radius).toFixed(3)),
      cy: Number((50 + Math.sin(angle) * radius).toFixed(3)),
    };
  });

  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn("h-full w-full", className)}>
      <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.5" />
      {nails.map((n, i) => (
        <circle key={i} cx={n.cx} cy={n.cy} r={i % Math.max(1, Math.round(count / (beads * 12))) === 0 ? 0.62 : 0.4} fill="currentColor" />
      ))}
    </svg>
  );
}

/** Small mono annotation, e.g. "FIG. 01 — STRING FACE ART". */
export function FigLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("figure", className)}>{children}</span>;
}
