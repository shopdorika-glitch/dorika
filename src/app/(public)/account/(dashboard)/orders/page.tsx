import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireCustomerSession } from "@/lib/auth";
import { getAccountOrders } from "@/lib/account-queries";
import { PanelHeader, EmptyPanel } from "@/components/account/ui";
import { StatusBadge, PaymentBadge } from "@/components/admin/ui";
import { cn, formatDate, formatNPR, statusLabel } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "My Orders",
  robots: { index: false, follow: false },
};

const FILTERS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  ...(["pending", "confirmed", "in_progress", "shipped", "delivered", "cancelled"] as OrderStatus[]).map(
    (status) => ({ value: status, label: statusLabel[status] })
  ),
];

export default async function AccountOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const session = await requireCustomerSession();
  const all = await getAccountOrders(session.userId);

  const active = FILTERS.some((f) => f.value === searchParams.status)
    ? (searchParams.status ?? "")
    : "";
  const orders = active ? all.filter((o) => o.status === active) : all;

  return (
    <>
      <PanelHeader
        title="Orders"
        subtitle={`${all.length} order${all.length === 1 ? "" : "s"} on your account`}
        action={
          <Link href="/track" className="btn-outline btn-sm">
            Track without login
          </Link>
        }
      />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {FILTERS.map((filter) => {
          const count =
            filter.value === "" ? all.length : all.filter((o) => o.status === filter.value).length;
          return (
            <Link
              key={filter.value || "all"}
              href={filter.value ? `/account/orders?status=${filter.value}` : "/account/orders"}
              className={cn(
                "flex-shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                active === filter.value
                  ? "border-clay bg-clay text-white"
                  : "border-line-strong bg-surface text-ink-soft hover:border-clay"
              )}
            >
              {filter.label}
              <span className={cn("ml-1.5", active === filter.value ? "text-white/80" : "text-ink-muted")}>
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <EmptyPanel
          title={all.length === 0 ? "No orders yet" : "Nothing in this status"}
          hint={
            all.length === 0
              ? "Once you place an order — as a guest with this phone or email — it lands here."
              : "Try a different filter to see your other orders."
          }
          actionLabel={all.length === 0 ? "Browse the shop" : undefined}
          actionHref={all.length === 0 ? "/shop" : undefined}
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.order_no}`}
              className="card block p-4 transition-shadow hover:shadow-lift sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-ink">{order.order_no}</p>
                  <p className="mt-0.5 truncate text-xs text-ink-muted">
                    {formatDate(order.created_at)}
                    {order.first_item_name && ` · ${order.first_item_name}`}
                    {order.item_count > 1 && ` +${order.item_count - 1} more`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <PaymentBadge status={order.payment_status} />
                  <StatusBadge status={order.status} />
                  <span className="text-sm font-normal text-ink">
                    {formatNPR(order.total)}
                  </span>
                  <ArrowRight className="h-4 w-4 text-ink-faint" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
