import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import { siteConfig, whatsappLink } from "@/lib/config";
import { Reveal } from "@/components/ui/reveal";
import { ThreadRule } from "@/components/ui/ornaments";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The story behind Dorika — a family string-art craft from Pokhara, Nepal.",
};

const values = [
  {
    title: "Made with care",
    desc: "We treat every photograph and every order as if it were our own.",
  },
  {
    title: "Materials that last",
    desc: "Durable planks and premium threads, chosen to hold their shape for years.",
  },
  {
    title: "Local, and proud of it",
    desc: "A family craft in Pokhara, Nepal — made and shipped from here.",
  },
];

const process = [
  { title: "Design", desc: "We translate your photograph into a precise nail-and-thread pattern." },
  { title: "Frame", desc: "The 45 cm round wooden plank is prepared and finished by hand." },
  { title: "Nail", desc: "The pattern is marked, then every nail is hammered in along the edge." },
  { title: "Weave", desc: "Thread is wound back and forth across the nails until the portrait appears." },
];

const works = [
  {
    src: "/products/custom-string-face-art.jpg",
    alt: "Single portrait string art in black thread on a round plywood plank",
    title: "String Face Art",
    meta: "45 cm · single portrait",
  },
  {
    src: "/products/couple-portrait-face-art.jpg",
    alt: "Two faces woven in black thread on a round plywood plank",
    title: "Couple portrait",
    meta: "45 cm · two faces",
  },
  {
    src: "/products/himalaya-peaks-wall-art.jpg",
    alt: "Himalayan peaks rendered in fine black thread on a round board",
    title: "Himalaya peaks",
    meta: "40 × 60 cm · landscape",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-paper">
      {/* Header */}
      <div className="border-b border-line">
        <div className="shell pb-12 pt-6 lg:pb-20 lg:pt-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            <span className="text-ink">Our story</span>
          </nav>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="eyebrow">The studio</p>
              <h1 className="display-1 mt-4">
                Woven in Nepal,
                <br />
                made to be kept.
              </h1>
            </div>
            <div className="lg:col-span-5 lg:pt-2">
              <p className="text-lede text-ink-soft">
                Dorika is a small string-art workshop in Pokhara, Nepal. We turn photographs
                into thread — line by line, nail by nail, by hand.
              </p>
              <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-5">
                <div>
                  <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">
                    Workshop
                  </dt>
                  <dd className="mt-1 text-sm text-ink">Pokhara, Nepal</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">
                    Craft
                  </dt>
                  <dd className="mt-1 text-sm text-ink">Hand-woven string art</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="eyebrow">How it began</p>
            <h2 className="display-3 mt-4">A length of thread and a handful of nails</h2>
          </div>
          <div className="space-y-6 text-[1.0625rem] leading-[1.75] text-ink-soft lg:col-span-7 lg:col-start-6">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[3.4rem] first-letter:leading-[0.8] first-letter:text-ink">
              Dorika began in Pokhara, Kaski, Nepal with a simple idea: that a length of thread and
              a handful of nails could hold a memory. What started as a hobby grew into a small
              family workshop making crafted string art — and our signature String Face Art, woven
              from photographs sent to us by people across Nepal.
            </p>
            <p>
              Because each piece is made for one person, there is no catalogue of identical copies —
              only the portrait in front of us, and the person it is meant for. That is what we like
              about it.
            </p>
            <div className="pt-2">
              <ThreadRule className="text-clay/60" tone="current" />
            </div>
            <blockquote className="border-l-2 border-clay pl-6">
              <p className="font-display text-xl leading-snug tracking-tight text-ink">
                “A photograph is a moment. Wound in thread, it becomes something you can hang on a
                wall and keep.”
              </p>
              <footer className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">
                Dorika — Pokhara, Nepal
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className="border-y border-line bg-paper-2">
        <div className="shell py-14 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">From the workshop</p>
              <h2 className="display-3 mt-3">Recent pieces</h2>
            </div>
            <Link href="/shop" className="group inline-flex items-center gap-2 text-sm text-ink">
              <span className="link-thread">See the collection</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((w, i) => (
              <Reveal key={w.title} delay={i * 70}>
                <figure>
                  <div className="mat relative aspect-square bg-paper-3">
                    <Image
                      src={w.src}
                      alt={w.alt}
                      fill
                      sizes="(max-width:640px) 90vw, (max-width:1024px) 45vw, 30vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 flex items-baseline justify-between gap-3 border-y border-line py-3">
                    <span className="font-display text-[0.9375rem] tracking-tight text-ink">{w.title}</span>
                    <span className="figure text-ink-muted">{w.meta}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="eyebrow">The craft</p>
            <h2 className="display-3 mt-4">Four stages, one pair of hands</h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
              Most portraits take four to five days from the moment a photograph arrives. Rushing
              any of these stages shows in the final piece.
            </p>
          </div>
          <ol className="lg:col-span-7 lg:col-start-6">
            {process.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 60} className="border-t border-line py-6 last:border-b">
                <div className="flex gap-6">
                  <span className="pt-1 font-mono text-[0.6875rem] tracking-[0.1em] text-clay">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl tracking-tight text-ink">{p.title}</h3>
                    <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-soft">{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-line bg-paper">
        <div className="shell py-14 lg:py-20">
          <p className="eyebrow">What we stand for</p>
          <h2 className="display-3 mt-3 max-w-lg">Four things we will not compromise</h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 60} className="flex gap-5 border-t border-line pt-5">
                <span className="font-mono text-[0.6875rem] tracking-[0.1em] text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-lg tracking-tight text-ink">{v.title}</h3>
                  <p className="mt-1 max-w-sm text-sm leading-relaxed text-ink-soft">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Visit / contact */}
      <section className="border-t border-line bg-deep text-ondeep">
        <div className="shell grid gap-10 py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-6">
            <p className="eyebrow text-ondeep-soft/70">Visit the workshop</p>
            <h2 className="display-3 mt-4 text-ondeep">
              {siteConfig.contact.address}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ondeep-soft">
              If you are nearby, you are welcome to see a piece being made. Message first so we know
              to expect you.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={whatsappLink("Hi Dorika, I'd like to visit the workshop.")}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 border-b border-ondeep/30 pb-1 text-sm text-ondeep transition-colors hover:border-clay"
              >
                Message the studio
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
              </a>
              <Link href="/contact" className="text-sm text-ondeep-soft hover:text-ondeep">
                Contact details
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="border border-ondeep/15 p-6">
              <p className="font-display text-lg tracking-tight text-ondeep">
                Commission a portrait
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ondeep-soft">
                45 cm round plank, made in {siteConfig.customArt.makingTime}, delivered anywhere in
                Nepal.
              </p>
              <Link
                href="/custom-art"
                className="group mt-5 inline-flex items-center gap-2.5 bg-ondeep px-5 py-3 text-[0.75rem] font-medium uppercase tracking-[0.1em] text-ink transition-colors hover:bg-clay hover:text-white"
              >
                Start here
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
