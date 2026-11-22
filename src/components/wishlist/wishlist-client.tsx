"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Heart, RotateCcw } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useWishlist } from "@/lib/wishlist-context";
import type { Product } from "@/lib/types";

export function WishlistClient() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      setFailed(false);
      return;
    }
    setLoading(true);
    setFailed(false);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch {
      setFailed(true);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [ids]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="bg-paper">
      <div className="shell pb-20 pt-6 lg:pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <div>
            <p className="eyebrow">Saved on this device</p>
            <h1 className="display-2 mt-3">Wishlist</h1>
          </div>
          {!loading && products.length > 0 && (
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
              {products.length} {products.length === 1 ? "piece" : "pieces"}
            </p>
          )}
        </div>

        <div className="pt-8">
          {loading ? (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="skeleton aspect-square w-full" />
                  <div className="mt-4 border-t border-line pt-4">
                    <div className="skeleton h-2.5 w-20" />
                    <div className="skeleton mt-3 h-4 w-40" />
                  </div>
                </div>
              ))}
            </div>
          ) : failed ? (
            <div className="border border-line bg-surface px-6 py-16 text-center">
              <p className="font-display text-xl tracking-tight text-ink">
                We could not load your saved pieces
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
                Your wishlist is stored in this browser — it is still there, we just could not
                reach the catalogue.
              </p>
              <button onClick={load} className="btn-outline btn-md mt-6">
                <RotateCcw className="h-4 w-4" strokeWidth={1.5} /> Try again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="mx-auto max-w-md py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-line">
                <Heart className="h-5 w-5 text-ink-faint" strokeWidth={1.25} />
              </div>
              <p className="mt-5 font-display text-xl tracking-tight text-ink">Nothing saved yet</p>
              <p className="mx-auto mt-2 max-w-[30ch] text-sm leading-relaxed text-ink-soft">
                Tap the heart on any piece and it will wait here for you — no account needed.
              </p>
              <Link href="/shop" className="btn-primary btn-md mt-6">
                Browse the shop
              </Link>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
