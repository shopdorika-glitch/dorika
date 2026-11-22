"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { displayImage, hasRealImage } from "@/lib/config";
import { formatNPR } from "@/lib/utils";
import { ProductCover } from "@/components/product-cover";

export function CartDrawer() {
  const { items, isOpen, setOpen, subtotal, updateQty, removeItem, count } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeRef.current?.focus(), 80);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [isOpen, setOpen]);

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-deep/45 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col border-l border-line bg-surface shadow-drawer transition-transform duration-400 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        <header className="flex h-[68px] flex-shrink-0 items-center justify-between border-b border-line px-5">
          <h2 className="flex items-baseline gap-2">
            <span className="font-display text-xl tracking-tight text-ink">Your cart</span>
            <span className="font-mono text-[0.6875rem] text-ink-muted">
              ({String(count).padStart(2, "0")})
            </span>
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-line">
              <ShoppingBag className="h-6 w-6 text-ink-faint" strokeWidth={1.25} />
            </div>
            <p className="mt-5 font-display text-xl tracking-tight text-ink">Nothing here yet</p>
            <p className="mt-2 max-w-[24ch] text-sm leading-relaxed text-ink-soft">
              Pieces you add will wait here while you keep looking.
            </p>
            <Link href="/shop" onClick={() => setOpen(false)} className="btn-primary btn-md mt-6">
              Browse the shop
            </Link>
            <Link
              href="/custom-art"
              onClick={() => setOpen(false)}
              className="mt-4 text-sm text-ink-soft link-thread hover:text-ink"
            >
              Or commission a portrait
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              <ul className="divide-y divide-line">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-4 py-5">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={() => setOpen(false)}
                      className="relative h-[84px] w-[84px] flex-shrink-0 overflow-hidden bg-paper-2"
                    >
                      {hasRealImage(item.image) ? (
                        <Image
                          src={displayImage(item.image)}
                          alt={item.name}
                          fill
                          sizes="84px"
                          className="object-cover"
                        />
                      ) : (
                        <ProductCover name={item.name} compact />
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setOpen(false)}
                          className="font-display text-[0.9375rem] leading-snug tracking-tight text-ink hover:text-clay"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="flex-shrink-0 text-[0.6875rem] text-ink-muted underline decoration-line underline-offset-4 transition-colors hover:text-clay hover:decoration-clay"
                        >
                          Remove
                        </button>
                      </div>
                      {item.size && (
                        <span className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-muted">
                          {item.size}
                        </span>
                      )}

                      <div className="mt-auto flex items-end justify-between pt-3">
                        <div className="flex items-center border border-line">
                          <button
                            type="button"
                            onClick={() => updateQty(item.productId, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="h-3 w-3" strokeWidth={1.75} />
                          </button>
                          <span className="w-7 text-center text-xs tabular-nums text-ink">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.productId, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="h-3 w-3" strokeWidth={1.75} />
                          </button>
                        </div>
                        <span className="tnum text-sm text-ink">
                          {formatNPR(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="flex-shrink-0 border-t border-line px-5 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-ink-soft">Subtotal</span>
                <span className="tnum font-display text-xl text-ink">{formatNPR(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-ink-muted">
                Delivery calculated at checkout · No account needed
              </p>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="btn-primary btn-lg group mt-4 w-full"
              >
                Checkout
                <ArrowRight className="btn-arrow h-4 w-4" strokeWidth={1.5} />
              </Link>
              <div className="mt-3 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-ink-soft link-thread hover:text-ink"
                >
                  Keep shopping
                </button>
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="text-ink-soft link-thread hover:text-ink"
                >
                  View cart
                </Link>
              </div>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
