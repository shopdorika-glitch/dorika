import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaqAccordion } from "@/components/faq-accordion";
import { faqItems } from "@/lib/faq";

export function FaqTeaser() {
  return (
    <section className="section bg-paper">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <div className="flex items-center gap-3">
              <span className="figure text-clay">05</span>
              <span className="h-px w-6 bg-line-strong" aria-hidden="true" />
              <p className="eyebrow">Good to know</p>
            </div>
            <h2 className="display-2 mt-5">The questions we are asked most</h2>
            <p className="mt-4 max-w-sm text-ink-soft">
              Ordering, photographs, delivery and payment — answered plainly. If something is
              still unclear, message us and a person will reply.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/faq" className="group inline-flex items-center gap-2 text-sm text-ink">
                <span className="link-thread">All questions</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
              <Link href="/contact" className="text-sm text-ink-soft link-thread hover:text-ink">
                Contact the studio
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <FaqAccordion items={faqItems.slice(0, 5)} />
        </div>
      </div>
    </section>
  );
}
