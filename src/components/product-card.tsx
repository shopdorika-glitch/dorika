"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, Plus, Check, ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatNPR, cn } from "@/lib/utils";
import { productImage, hasRealImage } from "@/lib/config";
import { ProductCover } from "@/components/product-cover";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

/**
 * Catalogue card. Deliberately frameless: the photograph sits on the paper,
 * and the caption is separated by a hairline rather than a box — closer to a
 * gallery label than a marketplace tile.
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const [added, setAdded] = useState(false);
  const wished = has(product.id);
  const img = productImage(product.images, 0);
  const realImage = hasRealImage(product.images?.[0]);
  const onSale = product.compare_at && product.compare_at > product.price;
  const soldOut = product.stock <= 0 && !product.is_custom;

  const add = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: img,
      size: product.size,
      stock: product.stock,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="group relative flex flex-col">
      <div className="mat frame-lift relative aspect-square">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 z-10" aria-label={product.name}>
          {realImage ? (
            <Image
              src={img}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width:640px) 50vw, (max-width:1024px) 45vw, 30vw"
              className={cn(
                "zoom-slow object-cover",
                soldOut && "opacity-70"
              )}
            />
          ) : (
            <ProductCover name={product.name} />
          )}
        </Link>

        {/* Quiet status marks */}
        <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-col items-start gap-1.5">
          {product.is_custom && (
            <span className="badge bg-deep/90 text-ondeep backdrop-blur-sm">Made to order</span>
          )}
          {onSale && !product.is_custom && (
            <span className="badge bg-clay text-white">Sale</span>
          )}
          {soldOut && (
            <span className="badge bg-surface/90 text-danger backdrop-blur-sm">Sold out</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={wished}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center bg-surface/85 text-ink-muted backdrop-blur-sm transition-colors hover:bg-surface hover:text-clay"
        >
          <Heart
            className={cn("h-[15px] w-[15px] transition-colors", wished && "fill-clay text-clay")}
            strokeWidth={1.5}
          />
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3 border-t border-line pt-4">
        <div className="min-w-0">
          {product.category?.name && (
            <p className="figure mb-1.5 truncate">{product.category.name}</p>
          )}
          <h3 className="font-display text-[1.0625rem] leading-snug tracking-tight text-ink">
            <Link href={`/product/${product.slug}`} className="link-thread">
              {product.name}
            </Link>
          </h3>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="tnum text-sm text-ink-soft">{formatNPR(product.price)}</span>
            {onSale && (
              <span className="tnum text-xs text-ink-faint line-through">
                {formatNPR(product.compare_at!)}
              </span>
            )}
          </div>
        </div>

        {product.is_custom ? (
          <Link
            href="/custom-art"
            aria-label={`Create your own — ${product.name}`}
            className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        ) : (
          <button
            type="button"
            onClick={add}
            disabled={soldOut}
            aria-label={`Add ${product.name} to cart`}
            className={cn(
              "mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center border transition-colors",
              soldOut
                ? "cursor-not-allowed border-line text-ink-faint"
                : added
                  ? "border-clay bg-clay text-white"
                  : "border-line text-ink hover:border-ink hover:bg-ink hover:text-paper"
            )}
          >
            {added ? (
              <Check className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Plus className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>
    </article>
  );
}
