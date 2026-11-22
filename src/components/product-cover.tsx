import { cn } from "@/lib/utils";
import { NailRing } from "@/components/ui/ornaments";

/**
 * Typographic cover for a piece that has no photograph yet.
 *
 * Some catalogue entries legitimately have no image on file. Rather than
 * borrowing a stock photo — which would misrepresent the work — we print a
 * quiet label: the name, set in the display face, inside a nail ring.
 */
export function ProductCover({
  name,
  className,
  compact = false,
}: {
  name: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-3 bg-paper-2 px-4 text-center",
        className
      )}
    >
      <NailRing className={cn("text-ink/20", compact ? "h-8 w-8" : "h-20 w-20")} />
      {!compact && (
        <>
          <p className="max-w-[14ch] font-display text-[1.05rem] leading-tight tracking-tight text-ink">
            {name}
          </p>
          <p className="figure text-ink-muted">Woven to order</p>
        </>
      )}
    </div>
  );
}
