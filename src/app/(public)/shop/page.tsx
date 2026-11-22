import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, SearchX, ArrowUpRight } from "lucide-react";
import { getProducts, getCategories } from "@/lib/queries";
import { ProductCard } from "@/components/product-card";
import { ShopFilters } from "@/components/shop/shop-filters";
import { Pagination } from "@/components/shop/pagination";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse crafted string art — wall art, custom face art, home decor and gifts. Delivered across Nepal.",
};

export const revalidate = 30;

const PER_PAGE = 9;

type SP = { search?: string; category?: string; sort?: string; page?: string };

export default async function ShopPage({ searchParams }: { searchParams: SP }) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const sort = (["newest", "price_asc", "price_desc"].includes(searchParams.sort ?? "")
    ? searchParams.sort
    : "newest") as "newest" | "price_asc" | "price_desc";

  const [{ products, total }, categories] = await Promise.all([
    getProducts({
      search: searchParams.search,
      category: searchParams.category,
      sort,
      page,
      perPage: PER_PAGE,
    }),
    getCategories(),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const activeCategory = categories.find((c) => c.slug === searchParams.category);

  return (
    <div className="bg-paper">
      {/* Page header */}
      <div className="border-b border-line">
        <div className="shell pb-10 pt-6 lg:pb-14 lg:pt-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            <span className="text-ink">Shop</span>
          </nav>

          <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">The collection</p>
              <h1 className="display-2 mt-3">
                {activeCategory ? activeCategory.name : "Crafted string art"}
              </h1>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft md:text-right">
              {activeCategory?.description ??
                "Every piece is cut, nailed and wound in our workshop. Ready-to-hang work and made-to-order portraits, delivered across Nepal. (even in SP)"}
            </p>
          </div>
        </div>
      </div>

      <div className="shell">
        <Suspense fallback={<div className="h-[74px] border-y border-line" />}>
          <ShopFilters categories={categories} />
        </Suspense>

        <div className="flex items-baseline justify-between py-5">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
            {total} {total === 1 ? "piece" : "pieces"}
            {searchParams.search && (
              <>
                {" "}for <span className="text-ink">“{searchParams.search}”</span>
              </>
            )}
          </p>
          {total > 0 && (
            <p className="hidden font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-faint sm:block">
              Page {page} of {Math.max(1, totalPages)}
            </p>
          )}
        </div>

        {products.length === 0 ? (
          <div className="mb-16 border border-line bg-surface">
            <div className="mx-auto max-w-md px-6 py-20 text-center">
              <SearchX className="mx-auto h-8 w-8 text-ink-faint" strokeWidth={1.25} />
              <h2 className="mt-5 font-display text-2xl tracking-tight text-ink">
                Nothing matches that search
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Try a different word, or browse the collection. If you had something specific in
                mind, we can make it from scratch.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link href="/shop" className="btn-primary btn-md">
                  View all pieces
                </Link>
                <Link href="/custom-art" className="btn-outline btn-md">
                  Commission a piece
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-12 pb-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 60}>
                <ProductCard product={p} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} searchParams={searchParams} />

        {/* Closing note */}
        <div className="my-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="max-w-md text-sm leading-relaxed text-ink-soft">
            Looking for something you have not seen here? We take commissions — faces, names,
            landscapes.
          </p>
          <Link href="/custom-art" className="group inline-flex items-center gap-2 text-sm text-ink">
            <span className="link-thread">Start a commission</span>
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
