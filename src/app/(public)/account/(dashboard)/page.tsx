import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Link2,
  MapPin,
  Package,
  Palette,
  ShoppingBag,
  Sparkles,
  Wallet,
} from "lucide-react";
import { requireCustomerSession } from "@/lib/auth";
import {
  getAccountOrders,
  getAccountProfile,
  getAccountSummary,
} from "@/lib/account-queries";
import { PanelHeader, StatTile, Notice, EmptyPanel } from "@/components/account/ui";
import { StatusBadge, PaymentBadge } from "@/components/admin/ui";
import { formatDate, formatNPR } from "@/lib/utils";
import { claimGuestOrdersAction } from "../actions";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export default async function AccountOverviewPage({
  searchParams,
}: {
  searchParams: { welcome?: string; ok?: string; error?: string };
}) {
  const session = await requireCustomerSession();
  const [profile, orders, summary] = await Promise.all([
    getAccountProfile(session.userId, session.email),
    getAccountOrders(session.userId),
    getAccountSummary(session.userId),
  ]);

  const firstName = (profile.full_name ?? "").trim().split(" ")[0] || "there";
  const recent = orders.slice(0, 3);

  return (
    <>
      <PanelHeader
        title={`Namaste, ${firstName}`}
        subtitle="Your orders, custom art and saved details — all in one place."
        action={
          <Link href="/shop" className="btn-outline btn-sm">
            <ShoppingBag className="h-4 w-4" /> Shop
          </Link>
        }
      />

      {searchParams.welcome === "1" && (
        <Notice kind="success">Welcome to Dorika — your account is ready.</Notice>
      )}
      {searchParams.ok === "claimed" && (
        <Notice kind="success">
          Done. Every past order that matched your phone or email now shows below.
        </Notice>
      )}
      {searchParams.ok === "password" && (
        <Notice kind="success">Password updated — you&apos;re signed in.</Notice>
      )}
      {searchParams.error === "claim_failed" && (
        <Notice kind="error">
          We couldn&apos;t attach your past orders just now. Please try again in a moment.
        </Notice>
      )}
      {searchParams.error === "not_configured" && (
        <Notice kind="error">Accounts are not configured on this deployment yet.</Notice>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatTile
          label="Orders"
          value={String(summary.orders)}
          hint={summary.openOrders > 0 ? `${summary.openOrders} in progress` : "Nothing pending"}
          icon={<Package className="h-4 w-4" />}
          href="/account/orders"
        />
        <StatTile
          label="Total spent"
          value={formatNPR(summary.spent)}
          hint="Excludes cancelled orders"
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatTile
          label="Custom art"
          value={String(summary.customRequests)}
          hint="Photo-based requests"
          icon={<Palette className="h-4 w-4" />}
          href="/account/custom-requests"
        />
        <StatTile
          label="Addresses"
          value={String(summary.addresses)}
          hint="Saved for checkout"
          icon={<MapPin className="h-4 w-4" />}
          href="/account/addresses"
        />
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-lg font-medium">Recent orders</h2>
          {orders.length > 0 && (
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1 text-sm font-semibold text-clay hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {recent.length === 0 ? (
          <EmptyPanel
            title="No orders yet"
            hint="Your orders will appear here automatically — whether you ordered as a guest or while signed in."
            actionLabel="Browse the shop"
            actionHref="/shop"
          />
        ) : (
          <div className="card divide-y divide-charcoal-100 overflow-hidden">
            {recent.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.order_no}`}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-paper-2"
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink">{order.order_no}</p>
                  <p className="truncate text-xs text-ink-muted">
                    {formatDate(order.created_at)} · {order.item_count}{" "}
                    {order.item_count === 1 ? "item" : "items"}
                    {order.first_item_name ? ` · ${order.first_item_name}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <PaymentBadge status={order.payment_status} />
                  <StatusBadge status={order.status} />
                  <span className="ml-1 text-sm font-medium">{formatNPR(order.total)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <p className="flex items-center gap-2 text-sm font-medium text-ink">
            <Sparkles className="h-4 w-4 text-clay" /> Made from your photo
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Custom String Face Art on a 45cm round plank, hand-woven in 7–10 days from the photo
            you upload.
          </p>
          <Link href="/custom-art" className="btn-primary btn-sm mt-4">
            Start a custom piece
          </Link>
        </div>

        <div className="card p-5">
          <p className="flex items-center gap-2 text-sm font-medium text-ink">
            <Link2 className="h-4 w-4 text-clay" /> Ordered as a guest before?
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Add your mobile number in your profile, then pull in any past order placed with that
            number or email.
          </p>
          <form action={claimGuestOrdersAction} className="mt-4">
            <button type="submit" className="btn-outline btn-sm">
              Attach my past orders
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
