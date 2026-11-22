import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/legal-layout";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Dorika collects, uses and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="November 2026">
      <p>
        Dorika (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy explains what we
        collect and how we use it when you shop or submit a custom art request.
      </p>
      <LegalSection heading="Information we collect">
        <p>
          When you place an order, submit a custom art request, or contact us, we collect the
          details you provide: your name, phone number, WhatsApp number, email (optional),
          delivery address, and any photos you upload for custom art.
        </p>
      </LegalSection>
      <LegalSection heading="How we use it">
        <ul className="space-y-1.5">
          <li>To process, craft, and deliver your orders.</li>
          <li>To contact you about your order status via phone, WhatsApp or email.</li>
          <li>To respond to your enquiries.</li>
        </ul>
      </LegalSection>
      <LegalSection heading="Your uploaded photos">
        <p>
          Photos you upload for String Face Art are stored{" "}
          <mark className="hl-blush">privately</mark> and are only accessible to our team through
          secure, time-limited links. We use them solely to create your artwork.
          We never sell or publicly share your photos without your permission.
        </p>
      </LegalSection>
      <LegalSection heading="No account required">
        <p>
          You can browse, order and track entirely as a guest. Creating an account is optional and
          only stores the details you choose to save.
        </p>
      </LegalSection>
      <LegalSection heading="Data retention & security">
        <p>
          We keep order information as long as needed to fulfil your order and meet{" "}
          <mark className="hl-blush">legal obligations</mark>. We apply reasonable safeguards to
          protect your data.
        </p>
      </LegalSection>
      <LegalSection heading="Contact">
        <p>
          Questions about your data? Email us at{" "}
          <a className="font-medium text-clay underline decoration-clay/30 underline-offset-2 hover:decoration-clay" href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>{" "}
          or call <mark className="hl-blush">{siteConfig.contact.phoneDisplay}</mark>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
