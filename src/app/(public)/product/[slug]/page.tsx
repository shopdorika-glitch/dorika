import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProductBySlug, getRelatedProducts, getAllProductSlugs } from "@/lib/queries";
import { ProductDetailClient } from "@/components/product/product-detail-client";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { productImage } from "@/lib/config";
import { faqItems } from "@/lib/faq";

export const revalidate = 30;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: [{ url: productImage(product.images, 0) }],
    },
  };
}

const pickFaq = (prefix: string) => faqItems.find((i) => i.q.startsWith(prefix));

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category_id, product.id, 4);

  const detailFaqs = [
    pickFaq("Do you deliver outside"),
    pickFaq("Can I return"),
    product.is_custom ? pickFaq("Are my uploaded photos") : pickFaq("How do I pay"),
  ].filter((i): i is { q: string; a: string } => Boolean(i));

  return (
    <div className="bg-paper">
      <div className="shell pt-6 lg:pt-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-muted">
          <Link href="/" className="hover:text-ink">Home</Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
          <Link href="/shop" className="hover:text-ink">Shop</Link>
          {product.category?.name && (
            <>
              <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-ink">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
          <span className="truncate text-ink">{product.name}</span>
        </nav>
      </div>

      <div className="shell pb-16 pt-8 lg:pb-24 lg:pt-12">
        <ProductDetailClient product={product} detailFaqs={detailFaqs} />
      </div>

      {related.length > 0 && (
        <section className="section border-t border-line bg-paper">
          <div className="shell">
            <SectionHeading
              eyebrow="You may also like"
              title="More from the workshop"
              action={
                <Link href="/shop" className="link-thread hidden text-sm sm:inline-flex">
                  View all pieces
                </Link>
              }
            />
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
