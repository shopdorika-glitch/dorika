import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

/**
 * Category index. Presented as a printed contents page rather than a row of
 * image tiles — the catalogue has too few photographs to support the latter
 * honestly, and the list is faster to scan.
 */
export function Categories({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;

  return (
    <section className="section-tight border-y border-line bg-paper-2">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeading
            index="04"
            eyebrow="Browse"
            title="Shop by subject"
            subtitle="Four ways into the collection, from ready-to-hang wall pieces to a portrait made from your own photograph."
            className="mb-0"
          />
        </div>

        <ul className="border-t border-line lg:col-span-8">
          {categories.map((c, i) => (
            <Reveal as="li" key={c.id} delay={i * 60}>
              <Link
                href={`/shop?category=${c.slug}`}
                className="group flex items-center justify-between gap-6 border-b border-line py-6 md:py-7"
              >
                <span className="flex min-w-0 items-baseline gap-4 md:gap-7">
                  <span className="figure w-5 flex-shrink-0 text-ink-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate font-display text-[1.55rem] leading-none tracking-tight text-ink transition-all duration-300 group-hover:translate-x-1 group-hover:text-clay md:text-[2rem]">
                    {c.name}
                  </span>
                </span>
                <span className="flex flex-shrink-0 items-center gap-6">
                  <span className="hidden max-w-[240px] text-right text-sm leading-snug text-ink-muted lg:block">
                    {c.description}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-ink-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-clay"
                    strokeWidth={1.5}
                  />
                </span>
              </Link>
            </Reveal>
          ))}
          <Reveal as="li" delay={categories.length * 60}>
            <Link
              href="/shop"
              className="group flex items-center justify-between gap-6 py-6 text-ink-soft transition-colors hover:text-ink"
            >
              <span className="text-sm">Everything in the shop</span>
              <span className="link-thread text-sm group-hover:[background-size:100%_1px]">
                View all pieces
              </span>
            </Link>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
