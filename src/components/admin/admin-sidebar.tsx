"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Palette,
  Package,
  Tags,
  Users,
  Mail,
  CreditCard,
  Settings,
  Menu,
  X,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export interface AdminBadges {
  pendingOrders: number;
  pendingCustom: number;
  unreadMessages: number;
}

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, badge: "pendingOrders" },
  { href: "/admin/custom-requests", label: "Custom Art", icon: Palette, badge: "pendingCustom" },
  { href: "/admin/products", label: "Products", icon: Package, badge: null },
  { href: "/admin/categories", label: "Categories", icon: Tags, badge: null },
  { href: "/admin/customers", label: "Customers", icon: Users, badge: null },
  { href: "/admin/messages", label: "Messages", icon: Mail, badge: "unreadMessages" },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, badge: null },
  { href: "/admin/settings", label: "Settings", icon: Settings, badge: null },
] as const;

export function AdminSidebar({
  email,
  badges,
  signOut,
}: {
  email: string;
  badges: AdminBadges;
  signOut: () => void;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navList = (
    <nav className="flex-1 space-y-1 px-3">
      {NAV.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname?.startsWith(item.href);
        const count = item.badge ? badges[item.badge as keyof AdminBadges] : 0;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
              active
                ? "bg-terracotta-500 text-white"
                : "text-charcoal-200 hover:bg-charcoal-700 hover:text-white"
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
            <span className="flex-1">{item.label}</span>
            {count > 0 && (
              <span
                className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
                  active ? "bg-white text-terracotta-600" : "bg-terracotta-500 text-white"
                )}
              >
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="space-y-2 border-t border-charcoal-700 p-3">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-charcoal-200 hover:bg-charcoal-700 hover:text-white"
      >
        <ExternalLink className="h-[18px] w-[18px] " /> View store
      </Link>
      <form action={signOut}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-charcoal-200 hover:bg-charcoal-700 hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px]" /> Sign out
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-charcoal-100 bg-white px-4 py-3 lg:hidden">
        <Logo className="h-7" />
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-charcoal-700 hover:bg-charcoal-50"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-charcoal-900/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-charcoal-800 py-5">
            <div className="mb-5 flex items-center justify-between px-5">
              <Logo variant="light" withLink={false} />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-1.5 text-charcoal-200 hover:bg-charcoal-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {navList}
            {footer}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col bg-charcoal-800 py-5 lg:flex">
        <div className="mb-6 px-5">
          <Logo variant="light" withLink={false} />
          <p className="mt-1 truncate text-xs text-charcoal-300" title={email}>
            {email}
          </p>
        </div>
        {navList}
        {footer}
      </aside>
    </>
  );
}
