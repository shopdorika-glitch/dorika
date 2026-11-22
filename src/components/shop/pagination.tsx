import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const makeHref = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== "page") sp.set(k, v);
    });
    sp.set("page", String(p));
    return `/shop?${sp.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav
      aria-label="Pagination"
      className="mt-14 flex items-center justify-between border-t border-line pt-6"
    >
      {page > 1 ? (
        <Link
          href={makeHref(page - 1)}
          rel="prev"
          className="group inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
            strokeWidth={1.5}
          />
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 text-sm text-ink-faint">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Previous
        </span>
      )}

      <ol className="flex items-center gap-1">
        {pages.map((p, idx) => {
          const prev = pages[idx - 1];
          const gap = prev && p - prev > 1;
          return (
            <li key={p} className="flex items-center gap-1">
              {gap && <span className="px-1 text-ink-faint">…</span>}
              <Link
                href={makeHref(p)}
                aria-current={p === page ? "page" : undefined}
                className={cn(
                  "flex h-8 min-w-8 items-center justify-center px-2 font-mono text-xs tabular-nums transition-colors",
                  p === page
                    ? "bg-ink text-paper"
                    : "text-ink-muted hover:bg-paper-2 hover:text-ink"
                )}
              >
                {p}
              </Link>
            </li>
          );
        })}
      </ol>

      {page < totalPages ? (
        <Link
          href={makeHref(page + 1)}
          rel="next"
          className="group inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          Next
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 text-sm text-ink-faint">
          Next
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </span>
      )}
    </nav>
  );
}
