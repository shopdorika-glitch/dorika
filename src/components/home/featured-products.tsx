import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="section bg-paper">
      <div className="shell">
        <SectionHeading
          index="01"
          eyebrow="The collection"
          title="Pieces from the workshop"
          subtitle="Small editions, made to be lived with."
          action={
            <Link href="/shop" className="group hidden items-center gap-2 text-sm text-ink sm:inline-flex">
              <span className="link-thread">View all pieces</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          }
        />

        {products.length === 0 ? (
          <div className="border border-dashed border-line-strong px-6 py-16 text-center">
            <p className="font-display text-xl text-ink">The shelves are being restocked.</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
              New pieces are woven every week. In the meantime, you can commission a portrait
              made from your own photograph.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/custom-art" className="btn-primary btn-md">
                Commission a piece
              </Link>
              <Link href="/shop" className="btn-outline btn-md">
                Browse the shop
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <ProductCard product={p} priority={i < 2} />
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-14 flex justify-center sm:hidden">
          <Link href="/shop" className="btn-outline btn-md w-full">
            View all pieces
          </Link>
        </div>
      </div>
    </section>
  );
}
