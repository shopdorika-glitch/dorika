import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/legal-layout";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you shop with Dorika.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="November 2026">
      <p>
        By using this website and placing an order, you agree to the following terms.
      </p>
      <LegalSection heading="Orders">
        <p>
          All orders are subject to acceptance and availability. We&apos;ll confirm your order by
          phone, WhatsApp or email. Prices are listed in {siteConfig.currency.code}
          ({siteConfig.currency.symbol}) and may change without notice.
        </p>
      </LegalSection>
      <LegalSection heading="Custom String Face Art">
        <p>
          Custom pieces are made to order from the photo you provide. Because each piece is
          personalised and crafted, slight variations from the reference photo are normal and
          part of the craft. By submitting a photo, you confirm you have the right to use it.
        </p>
      </LegalSection>
      <LegalSection heading="Payment">
        <p>
          We accept <mark className="hl-blush">Cash on Delivery</mark>, and (where enabled) eSewa, Khalti and bank transfer. Custom
          orders may require advance confirmation before we begin crafting.
        </p>
      </LegalSection>
      <LegalSection heading="Delivery">
        <p>
          We deliver across Nepal. Delivery times are estimates and may vary by location. Making
          times for custom pieces are shown on the product and custom art pages.
        </p>
      </LegalSection>
      <LegalSection heading="Intellectual property">
        <p>
          All site content, designs and the Dorika name and logo belong to Dorika and may not be
          used without <mark className="hl-blush">permission</mark>.
        </p>
      </LegalSection>
      <LegalSection heading="Contact">
        <p>
          Questions? Reach us at{" "}
          <a className="font-medium text-clay underline decoration-clay/30 underline-offset-2 hover:decoration-clay" href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
