"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";

/**
 * Search sheet. Dorika's catalogue is small and fully server-rendered, so the
 * overlay does one useful thing well: hand a query to /shop, which already
 * searches by name. It also surfaces the real categories for browsing.
 */
export function SearchOverlay({
  open,
  onClose,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  categories: Category[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [open, onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    onClose();
    router.push(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
  };

  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      <button
        aria-label="Close search"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-deep/45 backdrop-blur-[3px]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search Dorika"
        className={`absolute inset-x-0 top-0 border-b border-line bg-surface transition-transform duration-400 ease-out ${
          open ? "translate-y-0" : "-translate-y-4"
        }`}
      >
        <div className="shell py-6 sm:py-9">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Search the collection</p>
            <button
              onClick={onClose}
              className="group flex items-center gap-2 text-ink-muted transition-colors hover:text-ink"
              tabIndex={open ? 0 : -1}
            >
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em]">Close</span>
              <X className="h-4 w-4 transition-transform group-hover:rotate-90" strokeWidth={1.5} />
            </button>
          </div>

          <form onSubmit={submit} className="mt-5 border-b border-line-strong pb-3 sm:mt-7">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 flex-shrink-0 text-ink-faint" strokeWidth={1.5} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Faces, names, mountains…"
                aria-label="Search products"
                tabIndex={open ? 0 : -1}
                className="w-full bg-transparent font-display text-2xl tracking-tight text-ink placeholder:font-sans placeholder:text-base placeholder:tracking-normal placeholder:text-ink-faint focus:outline-none sm:text-3xl"
              />
              <button
                type="submit"
                tabIndex={open ? 0 : -1}
                className="btn-primary hidden flex-shrink-0 px-5 py-2.5 sm:inline-flex"
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="eyebrow">Browse</span>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/shop?category=${c.slug}`}
                onClick={onClose}
                tabIndex={open ? 0 : -1}
                className="group inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-clay"
              >
                {c.name}
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
              </Link>
            ))}
            <Link
              href="/custom-art"
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className="text-sm font-medium text-clay link-thread"
            >
              Custom String Face Art
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
