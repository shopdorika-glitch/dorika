import type { Metadata } from "next";
import Link from "next/link";
import { Check, Package, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { getSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const orderNo = searchParams.order ?? "";
  const waMsg = `Hi Dorika, I just placed order ${orderNo}. I'd like to confirm it.`;

  // Shop-wide payment destinations. Deliberately not order-specific so this
  // public page never reveals an order's contents to a guessed URL.
  const settings = await getSettings();
  const hasManualPayment = Boolean(
    settings?.esewa_id || settings?.khalti_id || settings?.bank_account_number
  );

  return (
    <div className="bg-paper">
      <div className="shell max-w-3xl py-14 lg:py-20">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-clay/40 text-clay">
            <Check className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <p className="eyebrow mt-6">Order placed</p>
          <h1 className="display-2 mt-3">Thank you — your order is with us</h1>
          <p className="mx-auto mt-4 max-w-md text-ink-soft">
            We have your details. Someone from the workshop will call to confirm before anything is
            packed.
          </p>

          {orderNo && (
            <div className="mx-auto mt-8 inline-block border-y border-line px-10 py-4">
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">
                Your order ID
              </p>
              <p className="mt-1 font-mono text-xl tracking-[0.08em] text-clay">{orderNo}</p>
            </div>
          )}
        </div>

        {/* What happens next */}
        <ol className="mt-12 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
          {[
            { t: "We confirm", d: "A call or WhatsApp message to check the details and payment." },
            { t: "We make it", d: "Your piece is packed — or woven, if it is a portrait." },
            { t: "It travels", d: "Courier to your district. Follow it any time with your ID." },
          ].map((s, i) => (
            <li key={s.t}>
              <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-clay">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-2 font-display text-lg tracking-tight text-ink">{s.t}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.d}</p>
            </li>
          ))}
        </ol>

        {hasManualPayment && (
          <div className="mt-10 border border-line bg-surface p-6">
            <p className="font-display text-lg tracking-tight text-ink">
              Paying by eSewa, Khalti or bank transfer?
            </p>
            <div className="mt-3 space-y-1 text-sm text-ink-soft">
              {settings?.esewa_id && (
                <p>eSewa: <span className="font-mono text-ink">{settings.esewa_id}</span></p>
              )}
              {settings?.khalti_id && (
                <p>Khalti: <span className="font-mono text-ink">{settings.khalti_id}</span></p>
              )}
              {settings?.bank_account_number && (
                <p>
                  {settings.bank_name ?? "Bank"}:{" "}
                  <span className="font-mono text-ink">{settings.bank_account_number}</span>
                  {settings.bank_account_name ? ` (${settings.bank_account_name})` : ""}
                </p>
              )}
              {settings?.payment_note && <p className="text-xs">{settings.payment_note}</p>}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-muted">
              Send the screenshot and your order ID on WhatsApp so we can confirm it faster.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(waMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-md flex-1"
          >
            Confirm on WhatsApp
          </a>
          <Link href={`/track?order=${orderNo}`} className="btn-outline btn-md flex-1">
            <Package className="h-4 w-4" strokeWidth={1.5} /> Track your order
          </Link>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="max-w-sm text-xs leading-relaxed text-ink-muted">
            Want the order saved to an account? It is optional — an account only adds order history
            and saved addresses.
          </p>
          <Link href="/account/auth/signup" className="group inline-flex items-center gap-1.5 text-sm text-ink">
            <span className="link-thread">Create an account</span>
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={1.5}
            />
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/shop" className="text-sm text-ink-soft link-thread hover:text-ink">
            Continue browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
