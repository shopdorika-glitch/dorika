import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/config";

const HERO_IMAGE = "/hero.webp";

/**
 * Wraps chosen words of the headline in highlights, so the phrase stays
 * editable in settings but the emphasis is designed, not typed.
 * Words are highlighted in the order given; later words win on overlap.
 */
function withHighlight(
  text: string,
  words: { word: string; className: string }[],
) {
  type Node = { value: string; mark?: string };
  let nodes: Node[] = [{ value: text }];

  for (const { word, className } of words) {
    nodes = nodes.flatMap((node) => {
      if (node.mark) return [node];
      const at = node.value.toLowerCase().indexOf(word.toLowerCase());
      if (at === -1) return [node];
      const out: Node[] = [];
      if (at > 0) out.push({ value: node.value.slice(0, at) });
      out.push({ value: node.value.slice(at, at + word.length), mark: className });
      if (at + word.length < node.value.length)
        out.push({ value: node.value.slice(at + word.length) });
      return out;
    });
  }

  return (
    <>
      {nodes.map((node, i) =>
        node.mark ? (
          <mark key={i} className={node.mark}>
            {node.value}
          </mark>
        ) : (
          <span key={i}>{node.value}</span>
        ),
      )}
    </>
  );
}


export function Hero({ headline, tagline }: { headline: string; tagline: string }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      <div className="shell relative grid items-center gap-12 py-8 lg:grid-cols-12 lg:gap-3 lg:pt-10 lg:pb-10">
        <div className="min-w-0 translate-y-[5px] lg:col-span-6 lg:translate-x-[20px] lg:pl-16 xl:pl-24 2xl:pl-[150px]">
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-clay" aria-hidden="true" />
            <p className="eyebrow">Crafted string art · Nepal</p>
          </div>

          <h1 className="display-1 mt-6 text-balance">
            {withHighlight(headline, [
              { word: "memories", className: "hl-blush hl-blush--display hl-blush--pink" },
            ])}
          </h1>

          <p className="mt-6 max-w-[26rem] text-lede text-ink-soft">{tagline}</p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href="/custom-art" className="btn-primary btn-lg group">
              Commission a portrait
              <ArrowRight className="btn-arrow h-4 w-4" strokeWidth={1.5} />
            </Link>
            <Link href="/shop" className="link-thread group text-sm font-medium">
              Shop the collection
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </Link>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
            <Spec label="Plank" value="45 cm round" />
            <Spec label="Lead time" value={siteConfig.customArt.makingTime} />
            <Spec label="Delivery" value="Across Nepal" />
          </dl>
        </div>

        <div className="relative min-w-0 lg:col-span-6">
          <figure className="relative mx-auto w-full max-w-full sm:max-w-[600px] lg:ml-auto lg:mr-[50px] lg:w-[80%] lg:-translate-x-1.5 lg:max-w-none">
            <div className="mat relative aspect-square w-full overflow-hidden bg-paper-3">
              <Image
                src={HERO_IMAGE}
                alt="Dorika custom string face art on a round wooden plank, resting on an easel"
                fill
                priority
                sizes="(max-width:1024px) 92vw, 46vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-2 border-y border-line py-3">
              <span className="figure">Fig. 01 — String Face Art</span>
              <span className="figure text-ink-faint">Thread on plywood · 45 cm</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">{label}</dt>
      <dd className="mt-1.5 text-sm text-ink">{value}</dd>
    </div>
  );
}
