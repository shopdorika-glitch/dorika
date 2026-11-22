import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Shared frame for policy pages: a quiet title block, then a single measured
 * column set in the body face. Content typography lives in `.legal-prose`
 * (globals.css) so the policy files stay plain, semantic HTML.
 */
export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-paper">
      <div className="border-b border-line">
        <div className="shell pb-10 pt-6 lg:pb-14 lg:pt-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            <span className="text-ink">{title}</span>
          </nav>
          <div className="mt-8 grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="eyebrow">The fine print</p>
              <h1 className="display-2 mt-3">{title}</h1>
            </div>
            {updated && (
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted lg:col-span-4 lg:pt-3 lg:text-right">
                Last updated {updated}
              </p>
            )}
          </div>
        </div>
      </div>

      <article className="shell py-12 lg:py-16">
        <div className="legal-prose max-w-[68ch]">{children}</div>
        <div className="mt-12 max-w-[68ch] border-t border-line pt-6">
          <p className="text-sm text-ink-soft">
            Questions about this page?{" "}
            <Link href="/contact" className="link-thread text-ink">
              Contact the studio
            </Link>
            .
          </p>
        </div>
      </article>
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-display text-[1.45rem] leading-snug tracking-tight text-ink">{heading}</h2>
      <div className="mt-3 space-y-3 text-[0.9375rem] leading-[1.75] text-ink-soft">{children}</div>
    </section>
  );
}
