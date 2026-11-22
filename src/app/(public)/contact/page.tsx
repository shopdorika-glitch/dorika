import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { siteConfig, whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Dorika — call, WhatsApp, email, or visit us in Pokhara, Nepal.",
};

export default function ContactPage() {
  return (
    <div className="bg-paper">
      <div className="border-b border-line">
        <div className="shell pb-10 pt-6 lg:pb-14 lg:pt-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            <span className="text-ink">Contact</span>
          </nav>
          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow">Talk to us</p>
              <h1 className="display-2 mt-3">Questions, photographs, or a piece in mind</h1>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft lg:col-span-4 lg:col-start-9 lg:pt-2">
              A person answers every message — usually the same day. WhatsApp is the quickest way to
              reach the workshop.
            </p>
          </div>
        </div>
      </div>

      <div className="shell grid gap-12 py-12 lg:grid-cols-12 lg:gap-16 lg:py-16">
        {/* Details */}
        <div className="lg:col-span-4">
          <dl className="border-t border-line">
            <ContactRow
              label="Call or WhatsApp"
              value={siteConfig.contact.phoneDisplay}
              href={`tel:+${siteConfig.contact.whatsapp}`}
              note="Sun–Fri · 9:00 AM – 6:00 PM"
            />
            <ContactRow
              label="WhatsApp"
              value="Chat with the studio"
              href={whatsappLink()}
              external
              note="Send a photo directly"
            />
            <ContactRow
              label="Email"
              value={siteConfig.contact.email}
              href={`mailto:${siteConfig.contact.email}`}
              note="For longer questions"
            />
            <ContactRow
              label="Workshop"
              value={siteConfig.contact.address}
              note="Visits by arrangement"
            />
          </dl>

          <div className="mt-8 border border-line bg-paper-2 p-5">
            <p className="font-display text-lg leading-snug tracking-tight text-ink">
              Thinking about a portrait?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Send the photograph on WhatsApp before ordering. We will tell you honestly whether it
              will translate well into thread.
            </p>
            <a
              href={whatsappLink("Hi Dorika, I'd like to ask about a custom portrait.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex items-center gap-2 text-sm text-ink"
            >
              <span className="link-thread">Ask about a portrait</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7 lg:col-start-6">
          <ContactForm />
        </div>
      </div>

      {/* Map */}
      <div className="shell pb-16">
        <div className="mat relative h-[300px] sm:h-[380px]">
          <iframe
            title="Dorika location — Pokhara, Nepal"
            src={siteConfig.mapEmbed}
            className="absolute inset-0 h-full w-full"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-3">
          <span className="figure">Fig. — Pokhara, Nepal</span>
          <a
            href="https://www.google.com/maps?q=Pokhara,Nepal"
            target="_blank"
            rel="noopener noreferrer"
            className="figure link-thread hover:text-ink"
          >
            Open in maps
          </a>
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  label,
  value,
  href,
  external,
  note,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  note?: string;
}) {
  const valueEl = href ? (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-ink link-thread break-words"
    >
      {value}
    </a>
  ) : (
    <span className="text-ink">{value}</span>
  );

  return (
    <div className="border-b border-line py-5">
      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </dt>
      <dd className="mt-2 text-[0.9375rem]">{valueEl}</dd>
      {note && <p className="mt-1 text-xs text-ink-muted">{note}</p>}
    </div>
  );
}
