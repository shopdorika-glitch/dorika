import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { formatNPR } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { FigLabel } from "@/components/ui/ornaments";

/**
 * The signature offer — String Face Art. Given more room than any other
 * section on the page because it is the piece the studio is known for.
 */
export function Signature({
  price,
  makingTime,
}: {
  price: number;
  makingTime: string;
}) {
  return (
    <section className="border-y border-line bg-surface">
      <div className="shell grid items-center gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
        <div className="lg:order-2 lg:col-span-5">
          <figure className="relative mx-auto w-full max-w-[520px] lg:ml-0">
            <div className="mat aspect-square w-full bg-paper-2">
              <Image
                src="/products/custom-string-face-art.jpg"
                alt="Single-face string art portrait woven in black thread on a round plywood plank"
                fill
                sizes="(max-width:1024px) 90vw, 40vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 flex items-center justify-between gap-3 border-y border-line py-3">
              <FigLabel>Fig. 02 — One face</FigLabel>
              <FigLabel className="text-ink-faint">{siteConfig.customArt.plankSize.replace(" diameter", "")}</FigLabel>
            </figcaption>
          </figure>
        </div>

        <div className="lg:order-1 lg:col-span-7 lg:translate-x-[120px] lg:pr-8">
          <div className="flex items-center gap-3">
            <span className="figure text-clay">02</span>
            <span className="h-px w-6 bg-line-strong" aria-hidden="true" />
            <p className="eyebrow">The signature</p>
          </div>

          <h2 className="display-2 mt-5">
            Your face, drawn in one unbroken thread.
          </h2>
          <p className="mt-5 max-w-lg text-lede text-ink-soft">
            Send a single clear photograph. We will create String-Art with a hammer, nails and a
            little touch of Magic! The unique Art result hangs on your wall for decades.
          </p>

          <dl className="mt-9 max-w-lg divide-y divide-line border-y border-line">
            <Row label="Size" value="45 cm round plank" />
            <Row label="Made in" value={makingTime} />
            <Row label="Delivery" value="Across Nepal" />
            <div className="flex items-baseline justify-between gap-6 py-3.5">
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">
                Price
              </dt>
              <dd className="flex items-baseline gap-2">
                <span className="tnum text-base font-medium text-clay">
                  {formatNPR(price)}
                </span>
                {siteConfig.customArt.compareAtPrice > price && (
                  <span className="tnum text-sm text-ink-muted line-through">
                    {formatNPR(siteConfig.customArt.compareAtPrice)}
                  </span>
                )}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href="/custom-art" className="btn-primary btn-lg group">
              Commission your portrait
              <ArrowRight className="btn-arrow h-4 w-4" strokeWidth={1.5} />
            </Link>
            <a
              href={siteConfig.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-thread group text-sm font-medium"
            >
              Ask a question first
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </a>
          </div>

          <p className="mt-5 text-xs leading-relaxed text-ink-muted">
            No account needed. We look at every photo before we begin, and confirm the details with
            you on WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3.5">
      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </dt>
      <dd className={emphasis ? "tnum text-base font-medium text-clay" : "tnum text-sm text-ink"}>
        {value}
      </dd>
    </div>
  );
}
