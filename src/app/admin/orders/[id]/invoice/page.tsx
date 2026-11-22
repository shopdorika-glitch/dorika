import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/queries";
import { formatNPR, formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { PrintButton } from "@/components/admin/print-button";
import type { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  cod: "Cash on Delivery",
  esewa: "eSewa",
  khalti: "Khalti",
  bank_transfer: "Bank Transfer",
};

export default async function InvoicePage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const supabase = createClient();
  const [{ data }, settings] = await Promise.all([
    supabase.from("orders").select("*, order_items(*)").eq("id", params.id).single(),
    getSettings(),
  ]);

  const order = data as Order | null;
  if (!order) notFound();

  const store = {
    name: settings?.store_name ?? siteConfig.name,
    email: settings?.store_email ?? siteConfig.contact.email,
    phone: settings?.store_phone ?? siteConfig.contact.phoneDisplay,
    address: settings?.address ?? siteConfig.contact.address,
  };

  return (
    <div className="min-h-screen bg-white text-charcoal-800">
      <div className="mx-auto max-w-[760px] p-8 print:p-0">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link href={`/admin/orders/${order.id}`} className="btn-ghost btn-sm">
            ← Back to order
          </Link>
          <PrintButton />
        </div>

        <div className="rounded-2xl border border-charcoal-100 p-8 print:rounded-none print:border-0 print:p-0">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-charcoal-200 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-charcoal-800">{store.name}</h1>
              <p className="mt-1 text-sm text-terracotta-600">Crafted string art</p>
              <p className="mt-3 text-xs text-charcoal-500">
                {store.address}
                <br />
                {store.phone} · {store.email}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-extrabold">INVOICE</p>
              <p className="mt-1 text-sm font-semibold text-terracotta-600">{order.order_no}</p>
              <p className="mt-1 text-xs text-charcoal-500">{formatDate(order.created_at)}</p>
            </div>
          </div>

          {/* Bill to */}
          <div className="grid grid-cols-2 gap-6 py-6 text-sm">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-charcoal-400">Bill to</p>
              <p className="font-semibold">{order.customer_name}</p>
              <p className="text-charcoal-600">{order.phone}</p>
              {order.email && <p className="text-charcoal-600">{order.email}</p>}
              {order.address && (
                <p className="mt-1 text-charcoal-600">
                  {[order.address, order.city, order.district].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-charcoal-400">Payment</p>
              <p className="font-semibold">{PAYMENT_METHOD_LABEL[order.payment_method] ?? order.payment_method}</p>
              <p className="capitalize text-charcoal-600">{order.payment_status}</p>
            </div>
          </div>

          {/* Items */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-charcoal-200 text-left text-xs uppercase tracking-wide text-charcoal-400">
                <th className="py-2">Item</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Unit</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {(order.order_items ?? []).map((it) => (
                <tr key={it.id} className="border-b border-charcoal-100">
                  <td className="py-2.5">{it.product_name}</td>
                  <td className="py-2.5 text-center">{it.quantity}</td>
                  <td className="py-2.5 text-right">{formatNPR(it.unit_price)}</td>
                  <td className="py-2.5 text-right">{formatNPR(it.line_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="ml-auto mt-4 w-full max-w-[260px] space-y-1 text-sm">
            <div className="flex justify-between text-charcoal-600">
              <span>Subtotal</span>
              <span>{formatNPR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-charcoal-600">
              <span>Delivery</span>
              <span>{order.delivery_fee === 0 ? "Free" : formatNPR(order.delivery_fee)}</span>
            </div>
            <div className="flex justify-between border-t border-charcoal-200 pt-2 text-base font-extrabold">
              <span>Total</span>
              <span>{formatNPR(order.total)}</span>
            </div>
          </div>

          <p className="mt-10 text-center text-xs text-charcoal-400">
            Thank you for supporting craft. — {store.name}
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 16mm; }
          body { background: #fff; }
        }
      `}</style>
    </div>
  );
}
