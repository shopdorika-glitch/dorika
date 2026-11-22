"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Shop toolbar. Everything lives in the URL (search, category, sort) so a
 * filtered view can be shared, bookmarked and reached with the back button.
 */
export function ShopFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [search, setSearch] = useState(params.get("search") ?? "");
  const activeCat = params.get("category") ?? "";
  const activeSort = params.get("sort") ?? "newest";
  const hasFilters = Boolean(search || activeCat || activeSort !== "newest");

  useEffect(() => setSearch(params.get("search") ?? ""), [params]);

  const push = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      });
      next.delete("page");
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router]
  );

  return (
    <div className="border-y border-line">
      <div className="flex flex-col gap-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        {/* Categories */}
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar lg:gap-2">
          <CatTab label="All pieces" active={!activeCat} onClick={() => push({ category: null })} />
          {categories.map((c) => (
            <CatTab
              key={c.id}
              label={c.name}
              active={activeCat === c.slug}
              onClick={() => push({ category: c.slug })}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              push({ search: search.trim() || null });
            }}
            className="relative flex-1 lg:w-56 lg:flex-none"
            role="search"
          >
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
              strokeWidth={1.5}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pieces"
              aria-label="Search products"
              className="w-full border border-line bg-surface py-2 pl-9 pr-8 text-sm text-ink transition-colors placeholder:text-ink-faint hover:border-line-strong focus:border-clay focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  push({ search: null });
                }}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            )}
          </form>

          {/* Sort */}
          <label className="relative flex flex-shrink-0 items-center">
            <span className="sr-only">Sort products</span>
            <SlidersHorizontal
              className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-ink-muted"
              strokeWidth={1.5}
            />
            <select
              value={activeSort}
              onChange={(e) => push({ sort: e.target.value })}
              className="cursor-pointer appearance-none border border-line bg-surface py-2 pl-8 pr-8 text-sm text-ink transition-colors hover:border-line-strong focus:border-clay focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price, low to high</option>
              <option value="price_desc">Price, high to low</option>
            </select>
            <Chevron />
          </label>
        </div>
      </div>

      {hasFilters && (
        <div className="flex items-center gap-3 border-t border-line py-2.5">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-muted">
            Filtered
          </span>
          <button
            type="button"
            onClick={() => router.push(pathname, { scroll: false })}
            className="text-xs text-clay underline decoration-clay/40 underline-offset-4 hover:decoration-clay"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 10 6"
      className="pointer-events-none absolute right-3 h-1.5 w-2.5 text-ink-muted"
    >
      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function CatTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative flex-shrink-0 whitespace-nowrap px-3 py-2 text-[0.8125rem] transition-colors",
        active ? "text-ink" : "text-ink-muted hover:text-ink"
      )}
    >
      {label}
      <span
        className={cn(
          "absolute inset-x-3 bottom-0 h-px origin-left bg-clay transition-transform duration-300",
          active ? "scale-x-100" : "scale-x-0"
        )}
      />
    </button>
  );
}
