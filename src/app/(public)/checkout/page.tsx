import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import { getSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Guest checkout — no account required.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const settings = await getSettings();
  return (
    <div className="bg-paper">
      <div className="shell pt-6 lg:pt-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-muted">
          <Link href="/" className="hover:text-ink">Home</Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
          <Link href="/cart" className="hover:text-ink">Cart</Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
          <span className="text-ink">Checkout</span>
        </nav>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <div>
            <p className="eyebrow">Almost there</p>
            <h1 className="display-2 mt-3">Checkout</h1>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
            No account needed. We confirm every order by phone before it is packed.
          </p>
        </div>
      </div>

      <div className="shell pb-20 pt-8 lg:pt-10">
        <CheckoutClient settings={settings} />
      </div>
    </div>
  );
}
