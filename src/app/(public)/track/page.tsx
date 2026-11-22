import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TrackClient } from "@/components/track/track-client";

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Enter your Order ID and phone number to see your order status — no account needed.",
};

export default function TrackPage() {
  return (
    <div className="bg-paper">
      <div className="border-b border-line">
        <div className="shell pb-10 pt-6 lg:pb-14 lg:pt-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            <span className="text-ink">Track order</span>
          </nav>
          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow">Order status</p>
              <h1 className="display-2 mt-3">Where your piece is up to</h1>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft lg:col-span-4 lg:col-start-9 lg:pt-2">
              No account needed. Every order and custom request can be followed with the ID we
              sent you.
            </p>
          </div>
        </div>
      </div>

      <div className="shell py-12 lg:py-16">
        <TrackClient />
      </div>
    </div>
  );
}
