import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { FaqAccordion } from "@/components/faq-accordion";
import { faqGroups } from "@/lib/faq";
import { siteConfig, whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about ordering, custom String Face Art, payment, delivery and returns.",
};

export default function FaqPage() {
  return (
    <div className="bg-paper">
      <div className="border-b border-line">
        <div className="shell pb-10 pt-6 lg:pb-14 lg:pt-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            <span className="text-ink">FAQ</span>
          </nav>
          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow">Help centre</p>
              <h1 className="display-2 mt-3">Questions, answered plainly</h1>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft lg:col-span-4 lg:col-start-9 lg:pt-2">
              If something is not covered here, message the studio — a person replies, usually the
              same day.
            </p>
          </div>
        </div>
      </div>

      <div className="shell grid gap-12 py-12 lg:grid-cols-12 lg:gap-16 lg:py-16">
        {/* Index */}
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">
              On this page
            </p>
            <ul className="mt-3 border-t border-line">
              {faqGroups.map((g, i) => (
                <li key={g.id}>
                  <a
                    href={`#${g.id}`}
                    className="group flex items-baseline justify-between border-b border-line py-2.5 text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    <span>{g.title}</span>
                    <span className="font-mono text-[0.625rem] text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 border border-line bg-paper-2 p-5">
              <p className="font-display text-base leading-snug tracking-tight text-ink">
                Still stuck?
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
                Message us on WhatsApp or send a note — we answer properly, not with templates.
              </p>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-3 inline-flex items-center gap-1.5 text-sm text-ink"
              >
                <span className="link-thread">WhatsApp</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
              </a>
              <Link href="/contact" className="mt-2 block text-sm text-ink-soft hover:text-ink">
                Or use the contact form
              </Link>
            </div>

            <p className="mt-6 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-faint">
              {siteConfig.contact.address}
            </p>
          </div>
        </aside>

        {/* Groups */}
        <div className="space-y-12 lg:col-span-8 lg:col-start-5">
          {faqGroups.map((group, i) => (
            <section key={group.id} id={group.id} className="scroll-mt-28">
              <div className="mb-4 flex items-baseline gap-3">
                <span className="figure text-clay">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="font-display text-2xl tracking-tight text-ink">{group.title}</h2>
              </div>
              <FaqAccordion items={group.items} defaultOpen={null} />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
