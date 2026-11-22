"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Heart, Check, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatNPR, cn } from "@/lib/utils";
import { productGallery, hasRealImage } from "@/lib/config";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { ProductCover } from "@/components/product-cover";
import { FaqAccordion } from "@/components/faq-accordion";
import type { FaqItem } from "@/lib/faq";

export function ProductDetailClient({
  product,
  detailFaqs,
}: {
  product: Product;
  detailFaqs: FaqItem[];
}) {
  const router = useRouter();
  const { addItem, setOpen } = useCart();
  const { has, toggle } = useWishlist();
  const images = productGallery(product.images);
  const showImage = hasRealImage(product.images?.[0]);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const soldOut = product.stock <= 0 && !product.is_custom;
  const onSale = product.compare_at && product.compare_at > product.price;
  const wished = has(product.id);

  const cartPayload = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: images[0],
    size: product.size,
    stock: product.stock,
  };

  const handleAdd = () => {
    addItem(cartPayload, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };
  const handleBuyNow = () => {
    addItem(cartPayload, qty);
    setOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Gallery */}
      <div className="lg:col-span-7">
        <div className="lg:sticky lg:top-28">
          <div className="mat relative aspect-square w-full bg-paper-2">
            {showImage ? (
              <Image
                src={images[active]}
                alt={product.name}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 56vw"
                className="object-cover"
              />
            ) : (
              <ProductCover name={product.name} />
            )}
            <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">
              {product.is_custom && (
                <span className="badge bg-deep/90 text-ondeep backdrop-blur-sm">Made to order</span>
              )}
              {onSale && !product.is_custom && (
                <span className="badge bg-clay text-white">Sale</span>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 border-y border-line py-3">
            <span className="figure">Fig. — {product.name}</span>
            <span className="figure text-ink-faint">{product.size ?? "Woven"}</span>
          </div>

          {showImage && images.length > 1 && (
            <div className="mt-5 flex gap-2.5">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-current={active === i}
                  className={cn(
                    "relative h-[68px] w-[68px] overflow-hidden border transition-colors",
                    active === i ? "border-clay" : "border-line hover:border-ink"
                  )}
                >
                  <Image src={img} alt="" fill sizes="68px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          {product.category?.name && (
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="eyebrow inline-block hover:text-clay"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="mt-3 font-display text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.08] tracking-display text-ink">
            {product.name}
          </h1>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="tnum font-display text-2xl text-ink">{formatNPR(product.price)}</span>
            {onSale && (
              <span className="tnum text-sm text-ink-faint line-through">
                {formatNPR(product.compare_at!)}
              </span>
            )}
          </div>

          <div
            className={cn(
              "mt-3 flex items-center gap-2 text-xs font-medium",
              product.is_custom ? "text-ink-muted" : soldOut ? "text-danger" : "text-success"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                product.is_custom ? "bg-clay" : soldOut ? "bg-danger" : "bg-success"
              )}
              aria-hidden="true"
            />
            {product.is_custom
              ? "Made to order · 4–5 days"
              : soldOut
                ? "Currently sold out"
                : `In stock · ${product.stock} available`}
          </div>

          {product.description && (
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-soft">{product.description}</p>
          )}

          {/* Purchase */}
          {product.is_custom ? (
            <div className="mt-8 border border-line bg-surface p-5">
              <p className="font-display text-lg leading-snug tracking-tight text-ink">
                This piece is made from your photograph.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Start the commission in the builder — upload a photo, add your delivery details,
                and we take it from there. No account needed.
              </p>
              <Link href="/custom-art" className="btn-primary btn-lg group mt-5 w-full">
                Start your portrait
                <ArrowRight className="btn-arrow h-4 w-4" strokeWidth={1.5} />
              </Link>
              <p className="mt-3 text-center text-xs text-ink-muted">
                45 cm round plank · {formatNPR(product.price)}
              </p>
            </div>
          ) : (
            <div className="mt-8">
              <div className="flex items-center justify-between gap-4">
                <span className="label mb-0">Quantity</span>
                <div className="flex items-center border border-line">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink disabled:opacity-40"
                    aria-label="Decrease quantity"
                    disabled={qty <= 1}
                  >
                    <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                  <span className="w-10 text-center text-sm tabular-nums text-ink">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                    className="flex h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink disabled:opacity-40"
                    aria-label="Increase quantity"
                    disabled={qty >= (product.stock || 99)}
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={soldOut}
                  className={cn("btn-primary btn-lg flex-1", added && "!bg-clay")}
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4" strokeWidth={1.75} /> Added to cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                      {soldOut ? "Sold out" : "Add to cart"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => toggle(product.id)}
                  aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                  aria-pressed={wished}
                  className={cn(
                    "flex w-12 items-center justify-center border transition-colors",
                    wished ? "border-clay text-clay" : "border-line text-ink-soft hover:border-ink hover:text-ink"
                  )}
                >
                  <Heart className={cn("h-4 w-4", wished && "fill-clay")} strokeWidth={1.5} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={soldOut}
                className="btn-outline btn-lg mt-2 w-full"
              >
                Buy now
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>

              <p className="mt-3 text-center text-xs text-ink-muted">
                Delivery calculated at checkout · No account needed
              </p>
            </div>
          )}

          {/* Specification */}
          <dl className="mt-9 divide-y divide-line border-y border-line">
            <Spec label="Size" value={product.size ?? "See description"} />
            <Spec label="Making" value={product.is_custom ? "Woven to order" : "Crafted in Pokhara"} />
            <Spec label="Materials" value="Thread on wooden plank" />
            <Spec label="Delivery" value="Across Nepal" />
          </dl>

          {detailFaqs.length > 0 && (
            <div className="mt-9">
              <p className="eyebrow">Good to know</p>
              <div className="mt-2">
                <FaqAccordion items={detailFaqs} defaultOpen={null} />
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-muted">
            <a href="/contact" className="link-thread hover:text-ink">
              Ask about this piece
            </a>
            <span className="h-3 w-px bg-line" aria-hidden="true" />
            <Link href="/shipping" className="link-thread hover:text-ink">
              Shipping &amp; returns
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3">
      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </dt>
      <dd className="text-right text-sm text-ink">{value}</dd>
    </div>
  );
}
