import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

const steps = [
  {
    title: "Send a photograph",
    desc: "One clear, front-facing photo. Straight from your phone is fine — JPG, PNG or WEBP.",
  },
  {
    title: "We map the pattern",
    desc: "The portrait is translated into a nail-and-thread plan before a single nail goes in.",
  },
  {
    title: "Nails, then thread",
    desc: "Every nail is placed, then the thread is woven across the 45 cm plank until the face appears.",
  },
  {
    title: "Packed and delivered",
    desc: "Wrapped, boxed and couriered to your district — with a status you can follow any time.",
  },
];

export function HowItWorks() {
  return (
    <section className="section bg-paper">
      <div className="shell">
        <SectionHeading
          index="03"
          eyebrow="The process"
          title="From a photograph to a plank"
          subtitle="Four stages, one pair of hands. Most portraits leave the workshop within four to five days."
        />

        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
            className="pointer-events-none absolute left-0 right-0 top-[19px] hidden h-10 w-full text-clay/40 lg:block"
          >
            <path
              d="M0 21 C 220 5, 380 35, 600 18 S 980 2, 1200 23"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <ol className="grid gap-y-10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-8">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 90} className="relative">
                <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center border border-line-strong bg-paper font-mono text-[0.6875rem] tracking-[0.08em] text-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 font-display text-[1.3rem] leading-snug tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-ink-soft">
                  {step.desc}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
