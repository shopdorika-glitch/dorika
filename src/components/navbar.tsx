"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag, Heart, User, Search, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { siteConfig, whatsappLink } from "@/lib/config";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "@/components/search-overlay";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Category } from "@/lib/types";

const PRIMARY_NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/custom-art", label: "Custom Art" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
] as const;

export function Navbar({ categories = [] }: { categories?: Category[] }) {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const { count: wishCount } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (pathname?.startsWith("/admin")) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40">
        {/* Announcement strip — real, quiet store facts only. */}
        <div className="border-b border-line bg-[rgb(var(--bar))] text-ink-muted">
          <div className="shell flex h-9 items-center justify-between gap-6">
            <p className="truncate font-mono text-[0.6875rem] uppercase tracking-[0.14em]">
              📍 Pokhara, Nepal
            </p>
            <div className="hidden items-center gap-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] sm:flex">
              <span>Delivery across Nepal</span>
              <span className="text-line-strong">·</span>
              <Link href="/track" className="text-ink transition-colors hover:text-clay">
                Track an order
              </Link>
            </div>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink sm:hidden"
            >
              WhatsApp
              <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div
          className={cn(
            "border-b transition-all duration-300",
            scrolled
              ? "border-line bg-paper/92 backdrop-blur-md"
              : "border-transparent bg-paper"
          )}
        >
          <nav
            aria-label="Primary"
            className="shell flex h-[68px] items-center justify-between gap-6 lg:h-[84px]"
          >
            <div className="flex items-center gap-10">
              <Logo className="shrink-0" />
              <ul className="hidden items-center gap-8 lg:flex">
                {PRIMARY_NAV.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group relative inline-block py-2 text-[0.8125rem] tracking-[0.01em] transition-colors",
                          active ? "text-ink" : "text-ink-soft hover:text-ink"
                        )}
                      >
                        {link.label}
                        <span
                          className={cn(
                            "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-clay transition-transform duration-300 ease-out",
                            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                          )}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search products"
                className="flex h-9 w-9 items-center justify-center rounded-xs text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink"
              >
                <Search className="h-[17px] w-[17px]" strokeWidth={1.5} />
              </button>

              <ThemeToggle className="hidden sm:inline-flex" />

              <Link
                href="/account"
                aria-label="Your account"
                className="hidden h-9 w-9 items-center justify-center rounded-xs text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink sm:flex"
              >
                <User className="h-[17px] w-[17px]" strokeWidth={1.5} />
              </Link>

              <Link
                href="/wishlist"
                aria-label={`Wishlist${wishCount ? `, ${wishCount} saved` : ""}`}
                className="relative hidden h-9 w-9 items-center justify-center rounded-xs text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink sm:flex"
              >
                <Heart className="h-[17px] w-[17px]" strokeWidth={1.5} />
                {wishCount > 0 && (
                  <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-clay" />
                )}
              </Link>

              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={`Open cart${count ? `, ${count} item${count > 1 ? "s" : ""}` : ""}`}
                className="relative ml-1 flex h-9 items-center gap-2 rounded-xs px-2 text-ink transition-colors hover:bg-paper-2"
              >
                <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.5} />
                <span className="font-mono text-[0.6875rem] tabular-nums text-ink-soft">
                  {String(count).padStart(2, "0")}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                className="ml-1 flex h-9 w-9 items-center justify-center rounded-xs text-ink transition-colors hover:bg-paper-2 lg:hidden"
              >
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-0 z-[70] lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={cn(
            "absolute inset-0 bg-deep/40 backdrop-blur-[2px] transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={cn(
            "absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-paper transition-transform duration-400 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex h-[68px] flex-shrink-0 items-center justify-between border-b border-line px-5">
            <Logo />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-xs text-ink hover:bg-paper-2"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6">
            <ul className="divide-y divide-line">
              {[{ href: "/", label: "Home" }, ...PRIMARY_NAV, { href: "/faq", label: "FAQ" }].map(
                (link, i) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      tabIndex={mobileOpen ? 0 : -1}
                      className="group flex items-baseline justify-between py-4"
                    >
                      <span className="font-display text-[1.6rem] leading-none tracking-tight text-ink">
                        {link.label}
                      </span>
                      <span className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </li>
                )
              )}
            </ul>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <Link
                href="/track"
                tabIndex={mobileOpen ? 0 : -1}
                className="border border-line px-4 py-3 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                Track order
              </Link>
              <Link
                href="/account"
                tabIndex={mobileOpen ? 0 : -1}
                className="border border-line px-4 py-3 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                Account
              </Link>
              <Link
                href="/wishlist"
                tabIndex={mobileOpen ? 0 : -1}
                className="border border-line px-4 py-3 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                Wishlist {wishCount > 0 && <span className="text-clay">({wishCount})</span>}
              </Link>
              <button
                type="button"
                tabIndex={mobileOpen ? 0 : -1}
                onClick={() => {
                  setMobileOpen(false);
                  setOpen(true);
                }}
                className="border border-line px-4 py-3 text-left text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                Cart ({count})
              </button>
            </div>

            <div className="mt-10 space-y-2">
              <p className="eyebrow">The workshop</p>
              <p className="text-sm leading-relaxed text-ink-soft">
                {siteConfig.contact.address}
              </p>
              <a href={`tel:+${siteConfig.contact.whatsapp}`} className="block text-sm text-ink">
                {siteConfig.contact.phoneDisplay}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="block text-sm text-ink-soft hover:text-ink"
              >
                {siteConfig.contact.email}
              </a>
            </div>
          </div>

          <div className="flex-shrink-0 border-t border-line px-5 py-4">
            <div className="flex items-center justify-between">
              <ThemeToggle label />
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
              >
                WhatsApp
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        categories={categories}
      />
    </>
  );
}
