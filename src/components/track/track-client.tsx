"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2, Check, ArrowUpRight } from "lucide-react";
import { Field, Input } from "@/components/ui/input";
import { formatNPR, formatDateTime, statusLabel, STATUS_FLOW, cn } from "@/lib/utils";
import type { TrackResult, OrderStatus } from "@/lib/types";
import { whatsappLink } from "@/lib/config";

const statusTone: Record<OrderStatus, string> = {
  pending: "bg-paper-2 text-ink-soft",
  confirmed: "bg-clay-tint text-clay",
  in_progress: "bg-clay-tint text-clay",
  shipped: "bg-ink text-paper",
  delivered: "bg-success-tint text-success",
  cancelled: "bg-danger-tint text-danger",
};

function TrackInner() {
  const params = useSearchParams();
  const [orderNo, setOrderNo] = useState(params.get("order") ?? "");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackResult | null>(null);

  useEffect(() => {
    const o = params.get("order");
    if (o) setOrderNo(o);
  }, [params]);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!orderNo.trim() || !phone.trim()) {
      setError("Please enter both your Order ID and phone number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_no: orderNo.trim(), phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed.");
      setResult(data.result as TrackResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const cancelled = result?.status === "cancelled";
  const currentIdx = result ? STATUS_FLOW.indexOf(result.status) : -1;

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={lookup} className="border border-line bg-surface p-6 sm:p-8">
        <h2 className="font-display text-xl tracking-tight text-ink">Find your order</h2>
        <p className="mt-1.5 text-sm text-ink-soft">
          The Order ID is on your confirmation. Use the phone number you ordered with.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Order ID" required>
            <Input value={orderNo} onChange={(e) => setOrderNo(e.target.value)} placeholder="DRK-XXXXXX" autoComplete="off" />
          </Field>
          <Field label="Phone number" required>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98XXXXXXXX" inputMode="tel" autoComplete="tel" />
          </Field>
        </div>

        {error && (
          <p role="alert" aria-live="polite" className="mt-4 border-l-2 border-danger bg-danger-tint px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary btn-lg mt-5 w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> Searching…
            </>
          ) : (
            <>
              <Search className="h-4 w-4" strokeWidth={1.5} /> Track order
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="mt-8 border border-line bg-surface">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line p-6 sm:p-8">
            <div>
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">
                {result.type === "custom" ? "Custom art request" : "Order"}
              </p>
              <p className="mt-1.5 font-mono text-lg tracking-[0.06em] text-ink">{result.order_no}</p>
              <p className="mt-1 text-xs text-ink-muted">Placed {formatDateTime(result.created_at)}</p>
            </div>
            <span className={cn("badge px-2.5 py-1.5", statusTone[result.status])}>
              {statusLabel[result.status]}
            </span>
          </div>

          <div className="px-6 sm:px-8">
            <div className="flex items-center justify-between border-b border-line py-4 text-sm">
              <span className="text-ink-soft">Customer</span>
              <span className="text-ink">{result.customer_name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-line py-4 text-sm">
              <span className="text-ink-soft">{result.type === "custom" ? "Price" : "Total"}</span>
              <span className="tnum text-ink">
                {formatNPR((result.total ?? result.price ?? 0) as number)}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">
              Status timeline
            </p>

            {cancelled ? (
              <div className="mt-4 border-l-2 border-danger bg-danger-tint px-4 py-3 text-sm text-danger">
                This order was cancelled. Message us if you think that is a mistake.
              </div>
            ) : (
              <ol className="mt-5 border-l border-line pl-6">
                {STATUS_FLOW.map((s, i) => {
                  const done = i <= currentIdx;
                  const current = i === currentIdx;
                  const evt = result.events.find((e) => e.status === s);
                  return (
                    <li key={s} className="relative pb-6 last:pb-0">
                      <span
                        className={cn(
                          "absolute -left-[31px] top-0.5 flex h-3 w-3 items-center justify-center rounded-full border",
                          done ? "border-clay bg-clay text-white" : "border-line-strong bg-surface"
                        )}
                        aria-hidden="true"
                      >
                        {done && <Check className="h-2 w-2" strokeWidth={3} />}
                      </span>
                      <p
                        className={cn(
                          "text-sm",
                          current ? "text-clay" : done ? "text-ink" : "text-ink-faint"
                        )}
                      >
                        {statusLabel[s as OrderStatus]}
                        {current && (
                          <span className="ml-2 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-clay">
                            Current
                          </span>
                        )}
                      </p>
                      {evt && (
                        <p className="mt-0.5 text-xs text-ink-muted">
                          {formatDateTime(evt.created_at)}
                          {evt.note ? ` · ${evt.note}` : ""}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="mt-6 border-t border-line pt-4">
              <a
                href={whatsappLink(`Hi Dorika, I'm checking on order ${result.order_no}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
              >
                <span className="link-thread">Ask about this order</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TrackClient() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-clay" strokeWidth={1.5} />
        </div>
      }
    >
      <TrackInner />
    </Suspense>
  );
}
