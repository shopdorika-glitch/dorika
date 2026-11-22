import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Delivery across Nepal, timelines, and our returns policy for crafted string art.",
};

export default function ShippingPage() {
  return (
    <LegalLayout title="Shipping & Returns" updated="November 2026">
      <LegalSection heading="Delivery across Nepal">
        <p>
          We deliver to every district in Nepal through trusted courier partners. Inside the
          Kathmandu Valley and major cities, delivery is typically faster; remote areas may take
          a little longer.
        </p>
      </LegalSection>
      <LegalSection heading="Delivery charges">
        <p>
          A standard delivery fee is calculated at checkout based on your location. Orders above a
          set value qualify for free delivery — you&apos;ll see this automatically in your cart.
        </p>
      </LegalSection>
      <LegalSection heading="Making & dispatch time">
        <ul className="space-y-1.5">
          <li><strong>Ready-made pieces:</strong> dispatched within 1–3 days.</li>
          <li><strong>Custom String Face Art:</strong> crafted in 4–5 days, then dispatched.</li>
        </ul>
        <p>You can track your order anytime from the Track Order page using your Order ID and phone number.</p>
      </LegalSection>
      <LegalSection heading="Returns & exchanges">
        <p>
          Because our work is crafted by hand, small natural variations are part of the charm and are not
          considered defects.
        </p>
        <ul className="space-y-1.5">
          <li><strong>Damaged in transit:</strong> contact us within 48 hours with photos and we&apos;ll make it right.</li>
          <li><strong>Ready-made items:</strong> may be exchanged if unused and in original condition.</li>
          <li><strong>Custom pieces:</strong> as they&apos;re personalised, they can&apos;t be returned unless they arrive damaged or incorrect.</li>
        </ul>
      </LegalSection>
      <LegalSection heading="Need help?">
        <p>
          Message us on WhatsApp at +977 9708285877 — we&apos;re happy to help with any delivery or
          return question.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
