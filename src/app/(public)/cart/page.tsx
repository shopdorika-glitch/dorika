"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ArrowRight, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { displayImage, hasRealImage } from "@/lib/config";
import { formatNPR } from "@/lib/utils";
import { ProductCover } from "@/components/product-cover";

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem, count } = useCart();

  return (
    <div className="bg-paper">
      <div className="shell pb-20 pt-6 lg:pt-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-muted">
          <Link href="/" className="hover:text-ink">Home</Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
          <span className="text-ink">Cart</span>
        </nav>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <div>
            <p className="eyebrow">Your selection</p>
            <h1 className="display-2 mt-3">Cart</h1>
          </div>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
            {count} {count === 1 ? "item" : "items"}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="mx-auto max-w-md py-20 text-center">
            <p className="font-display text-2xl tracking-tight text-ink">Your cart is empty</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Nothing added yet. Have a look at the collection — or send us a photo and we will
              weave it into a portrait.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/shop" className="btn-primary btn-md">
                Browse the shop
              </Link>
              <Link href="/custom-art" className="btn-outline btn-md">
                Commission a piece
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-10 pt-8 lg:grid-cols-[1fr_360px] lg:gap-14">
            <ul className="divide-y divide-line border-b border-line">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 py-6 sm:gap-6">
                  <Link
                    href={`/product/${item.slug}`}
                    className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-paper-2 sm:h-28 sm:w-28"
                  >
                    {hasRealImage(item.image) ? (
                      <Image
                        src={displayImage(item.image)}
                        alt={item.name}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    ) : (
                      <ProductCover name={item.name} compact />
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-display text-[1.05rem] leading-snug tracking-tight text-ink hover:text-clay"
                        >
                          {item.name}
                        </Link>
                        {item.size && (
                          <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-muted">
                            {item.size}
                          </p>
                        )}
                      </div>
                      <span className="tnum text-sm text-ink">
                        {formatNPR(item.price * item.quantity)}
                      </span>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                      <div className="flex items-center border border-line">
                        <button
                          type="button"
                          onClick={() => updateQty(item.productId, item.quantity - 1)}
                          className="flex h-9 w-9 items-center justify-center text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                        <span className="w-8 text-center text-sm tabular-nums text-ink">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.productId, item.quantity + 1)}
                          className="flex h-9 w-9 items-center justify-center text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-ink-muted underline decoration-line underline-offset-4 transition-colors hover:text-clay hover:decoration-clay"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit border border-line bg-surface p-6 lg:sticky lg:top-28">
              <h2 className="font-display text-xl tracking-tight text-ink">Summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Subtotal</dt>
                  <dd className="tnum text-ink">{formatNPR(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Delivery</dt>
                  <dd className="text-ink-muted">Calculated at checkout</dd>
                </div>
              </dl>
              <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
                <span className="text-sm text-ink-soft">Total</span>
                <span className="tnum font-display text-xl text-ink">{formatNPR(subtotal)}</span>
              </div>
              <Link href="/checkout" className="btn-primary btn-lg group mt-6 w-full">
                Checkout
                <ArrowRight className="btn-arrow h-4 w-4" strokeWidth={1.5} />
              </Link>
              <Link
                href="/shop"
                className="mt-3 block text-center text-xs text-ink-soft link-thread hover:text-ink"
              >
                Continue shopping
              </Link>
              <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-ink-muted">
                No account needed — checkout as a guest. We confirm every order by phone before it
                is packed.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
