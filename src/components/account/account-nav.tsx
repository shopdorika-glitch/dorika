"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/custom-requests", label: "Custom art" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/profile", label: "Profile" },
] as const;

export function AccountNav({
  name,
  email,
  signOut,
}: {
  name: string | null;
  email: string;
  signOut: () => void;
}) {
  const pathname = usePathname();
  const initial = (name || email || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="lg:sticky lg:top-28">
      <div className="border border-line bg-surface">
        <div className="flex items-center gap-3 border-b border-line p-4">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line font-mono text-xs text-clay">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm text-ink">{name || "Dorika customer"}</p>
            <p className="truncate text-xs text-ink-muted" title={email}>
              {email}
            </p>
          </div>
        </div>

        <nav aria-label="Account" className="flex gap-1 overflow-x-auto p-2 no-scrollbar lg:flex-col">
          {NAV.map((item) => {
            const active =
              item.href === "/account" ? pathname === "/account" : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-shrink-0 items-center justify-between gap-3 px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-paper-2 text-ink"
                    : "text-ink-soft hover:bg-paper-2 hover:text-ink"
                )}
              >
                <span className="whitespace-nowrap">{item.label}</span>
                <span
                  className={cn(
                    "hidden h-px w-4 bg-clay transition-opacity lg:block",
                    active ? "opacity-100" : "opacity-0"
                  )}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        <form action={signOut} className="border-t border-line p-2">
          <button
            type="submit"
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-ink-muted transition-colors hover:bg-paper-2 hover:text-ink"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} /> Sign out
          </button>
        </form>
      </div>

      <Link
        href="/shop"
        className="mt-3 hidden items-center justify-center gap-2 border border-line px-3 py-2.5 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink lg:flex"
      >
        Continue shopping
      </Link>
    </div>
  );
}
