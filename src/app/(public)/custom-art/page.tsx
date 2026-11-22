import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CustomArtBuilder } from "@/components/custom-art/custom-art-builder";
import { getSettings } from "@/lib/queries";
import { siteConfig } from "@/lib/config";
import { formatNPR } from "@/lib/utils";
import { ThreadRule } from "@/components/ui/ornaments";

export const metadata: Metadata = {
  title: "Custom String Face Art",
  description:
    "Upload a face photo and we'll hand-craft it into string art on a 45cm round plank. No account needed. Delivered across Nepal.",
};

const photoTips = [
  {
    title: "Front-facing, well lit",
    desc: "A clear photo of the face with good contrast gives the truest likeness. Avoid heavy filters.",
  },
  {
    title: "One face per portrait",
    desc: "For two people, choose the couple version — both faces are mapped into a single pattern.",
  },
  {
    title: "JPG, PNG or WEBP",
    desc: "Up to 10MB. We compress it on your device before sending, so uploads stay quick.",
  },
];

export default async function CustomArtPage() {
  const settings = await getSettings();
  const price = Number(settings?.custom_art_price ?? siteConfig.customArt.price);
  const makingTime = settings?.custom_art_days ?? siteConfig.customArt.makingTime;

  return (
    <div className="bg-paper">
      {/* Intro */}
      <div className="border-b border-line">
        <div className="shell pb-12 pt-6 lg:pb-16 lg:pt-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            <span className="text-ink">Custom art</span>
          </nav>

          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="eyebrow">The signature service</p>
              <h1 className="display-1 mt-4">String Face Art</h1>
              <p className="mt-5 max-w-xl text-lede text-ink-soft">
                Send one photograph. We map it into a nail-and-thread pattern, then wind a portrait
                on a 45 cm round wooden plank — by hand, in our workshop in Pokhara.
              </p>
            </div>

            <dl className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-line">
              <div className="flex items-baseline justify-between border-b border-line py-3">
                <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">
                  Format
                </dt>
                <dd className="text-sm text-ink">45 cm round plank</dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-line py-3">
                <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">
                  Making time
                </dt>
                <dd className="text-sm text-ink">{makingTime}</dd>
              </div>
              <div className="flex items-baseline justify-between py-3">
                <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">
                  Price
                </dt>
                <dd className="tnum text-base text-clay">{formatNPR(price)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Builder */}
      <section className="py-12 lg:py-16">
        <div className="shell">
          <CustomArtBuilder price={price} makingTime={makingTime} />
        </div>
      </section>

      {/* Photo guidance */}
      <section className="border-t border-line bg-paper-2">
        <div className="shell py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="eyebrow">Before you start</p>
              <h2 className="display-3 mt-4">What makes a good photo</h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
                The portrait can only be as detailed as the photograph it is built from. These
                three things matter most.
              </p>
            </div>
            <ol className="lg:col-span-8">
              {photoTips.map((tip, i) => (
                <li
                  key={tip.title}
                  className="flex gap-5 border-t border-line py-5 last:border-b sm:gap-8"
                >
                  <span className="pt-1 font-mono text-[0.6875rem] tracking-[0.1em] text-clay">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg tracking-tight text-ink">{tip.title}</h3>
                    <p className="mt-1 max-w-lg text-sm leading-relaxed text-ink-soft">{tip.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-12 text-clay/40">
            <ThreadRule tone="current" />
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="max-w-md text-sm leading-relaxed text-ink-soft">
              Not sure whether a photo will work? Send it to us on WhatsApp before ordering — we
              will tell you honestly.
            </p>
            <Link href="/contact" className="btn-outline btn-md">
              Ask the studio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
