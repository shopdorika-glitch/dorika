"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Banknote, Wallet, Landmark, Lock } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Turnstile } from "@/components/turnstile";
import { HONEYPOT_FIELD } from "@/lib/security";
import { displayImage, hasRealImage } from "@/lib/config";
import { formatNPR, cn, isValidNepaliPhone } from "@/lib/utils";
import type { PaymentMethod, Settings } from "@/lib/types";
import { ProductCover } from "@/components/product-cover";

export function CheckoutClient({ settings }: { settings: Settings | null }) {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();

  const [form, setForm] = useState({
    customer_name: "", phone: "", email: "", district: "", city: "",
    address: "", landmark: "", notes: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [reference, setReference] = useState("");
  const [token, setToken] = useState("");
  const [hp, setHp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee =
    settings && subtotal >= Number(settings.free_delivery_over)
      ? 0
      : Number(settings?.delivery_fee ?? 150);
  const total = subtotal + deliveryFee;

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const methods: { id: PaymentMethod; label: string; desc: string; icon: typeof Banknote; enabled: boolean }[] = [
    { id: "cod", label: "Cash on delivery", desc: "Pay when your order arrives", icon: Banknote, enabled: settings?.cod_enabled ?? true },
    { id: "esewa", label: "eSewa", desc: "Pay from your eSewa wallet", icon: Wallet, enabled: settings?.esewa_enabled ?? false },
    { id: "khalti", label: "Khalti", desc: "Pay from your Khalti wallet", icon: Wallet, enabled: settings?.khalti_enabled ?? false },
    { id: "bank_transfer", label: "Bank transfer / QR", desc: "Transfer to our bank, or scan the QR", icon: Landmark, enabled: settings?.bank_enabled ?? true },
  ];
  const activeMethods = methods.filter((m) => m.enabled);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.customer_name.trim() || !isValidNepaliPhone(form.phone)) {
      setError("Please enter your name and a valid phone number.");
      return;
    }
    if (!form.district.trim() || !form.address.trim()) {
      setError("Please enter your delivery district and address.");
      return;
    }
    if (payment !== "cod" && !reference.trim()) {
      setError("Please paste the transaction ID from your payment so we can confirm the order.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          payment_method: payment,
          payment_reference: reference.trim() || null,
          items,
          turnstileToken: token,
          [HONEYPOT_FIELD]: hp,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed.");
      clear();
      router.push(`/order-confirmation?order=${data.order_no}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md border border-line bg-surface py-16 text-center">
        <p className="font-display text-xl tracking-tight text-ink">Nothing to check out</p>
        <p className="mx-auto mt-2 max-w-[30ch] text-sm leading-relaxed text-ink-soft">
          Your cart is empty. Add a piece first — or commission a portrait from a photograph.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn-primary btn-md">Browse the shop</Link>
          <Link href="/custom-art" className="btn-outline btn-md">Custom art</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
      <input type="text" tabIndex={-1} autoComplete="off" className="hp-field"
        data-lpignore="true" data-1p-ignore="true" data-form-type="other"
        aria-hidden="true" name={HONEYPOT_FIELD} value={hp} onChange={(e) => setHp(e.target.value)} />

      <div>
        {/* Delivery */}
        <section>
          <div className="flex items-baseline gap-3 border-b border-line pb-4">
            <span className="figure text-clay">01</span>
            <h2 className="font-display text-xl tracking-tight text-ink">Delivery details</h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required>
              <Input value={form.customer_name} onChange={(e) => set("customer_name", e.target.value)} placeholder="Your name" autoComplete="name" />
            </Field>
            <Field label="Phone" required hint="We will call to confirm">
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="98XXXXXXXX" inputMode="tel" autoComplete="tel" />
            </Field>
            <Field label="Email" hint="Optional — for confirmation" className="sm:col-span-2">
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" autoComplete="email" />
            </Field>
            <Field label="District" required>
              <Input value={form.district} onChange={(e) => set("district", e.target.value)} placeholder="e.g. Kaski" />
            </Field>
            <Field label="City / municipality">
              <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Byas" />
            </Field>
            <Field label="Full delivery address" required className="sm:col-span-2">
              <Textarea value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="House / street / area" />
            </Field>
            <Field label="Nearest landmark">
              <Input value={form.landmark} onChange={(e) => set("landmark", e.target.value)} placeholder="Helps the courier find you" />
            </Field>
            <Field label="Order notes">
              <Input value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Anything else?" />
            </Field>
          </div>
        </section>

        {/* Payment */}
        <section className="mt-12">
          <div className="flex items-baseline gap-3 border-b border-line pb-4">
            <span className="figure text-clay">02</span>
            <h2 className="font-display text-xl tracking-tight text-ink">Payment method</h2>
          </div>

          <div role="radiogroup" aria-label="Payment method" className="mt-5 divide-y divide-line border-y border-line">
            {activeMethods.map((m) => {
              const selected = payment === m.id;
              return (
                <button
                  type="button"
                  key={m.id}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPayment(m.id)}
                  className={cn(
                    "flex w-full items-center gap-4 px-1 py-4 text-left transition-colors",
                    selected ? "bg-paper-2" : "hover:bg-paper-2/60"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border transition-colors",
                      selected ? "border-clay" : "border-line-strong"
                    )}
                    aria-hidden="true"
                  >
                    {selected && <span className="h-2 w-2 rounded-full bg-clay" />}
                  </span>
                  <m.icon
                    className={cn("h-4 w-4 flex-shrink-0", selected ? "text-clay" : "text-ink-muted")}
                    strokeWidth={1.5}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-ink">{m.label}</span>
                    <span className="block text-xs text-ink-muted">{m.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {payment !== "cod" && (
            <div className="mt-5 border border-line bg-paper-2 p-5">
              <p className="text-sm text-ink">
                {payment === "bank_transfer"
                  ? "Pay by bank transfer or QR"
                  : `Pay with ${payment === "esewa" ? "eSewa" : "Khalti"}`}
              </p>

              {payment === "esewa" && (
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  Send <strong className="text-ink">{formatNPR(total)}</strong> to eSewa{" "}
                  <span className="font-mono text-ink">
                    {settings?.esewa_id || "— add your eSewa number in admin settings —"}
                  </span>
                </p>
              )}
              {payment === "khalti" && (
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  Send <strong className="text-ink">{formatNPR(total)}</strong> to Khalti{" "}
                  <span className="font-mono text-ink">
                    {settings?.khalti_id || "— add your Khalti number in admin settings —"}
                  </span>
                </p>
              )}
              {payment === "bank_transfer" && (
                <div className="mt-1.5 space-y-1 text-sm text-ink-soft">
                  <p>
                    Transfer <strong className="text-ink">{formatNPR(total)}</strong> to:
                  </p>
                  <p className="font-mono text-ink">
                    {settings?.bank_name || "—"}
                    {settings?.bank_account_number
                      ? ` · ${settings.bank_account_number}`
                      : " · add account in admin settings"}
                  </p>
                  {settings?.bank_account_name && <p>{settings.bank_account_name}</p>}
                  {settings?.bank_qr_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={settings.bank_qr_url}
                      alt="Bank QR code"
                      className="mt-3 h-40 w-40 bg-white object-contain p-2"
                    />
                  )}
                </div>
              )}

              {settings?.payment_note && (
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{settings.payment_note}</p>
              )}

              <div className="mt-4">
                <Field label="Transaction ID" htmlFor="payment_reference" hint="Paste the ID from your payment receipt">
                  <Input
                    id="payment_reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g. 8H4K2L9M"
                  />
                </Field>
              </div>
            </div>
          )}

          <p className="mt-5 text-xs leading-relaxed text-ink-muted">
            eSewa, Khalti and bank payments are confirmed manually by our team. You will receive a
            call before the order is packed.
          </p>
        </section>
      </div>

      {/* Summary */}
      <aside className="h-fit border border-line bg-surface lg:sticky lg:top-28">
        <div className="border-b border-line px-6 py-5">
          <h2 className="font-display text-lg tracking-tight text-ink">Your order</h2>
        </div>

        <ul className="max-h-[280px] divide-y divide-line overflow-y-auto px-6">
          {items.map((i) => (
            <li key={i.productId} className="flex gap-3 py-4">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden bg-paper-2">
                {hasRealImage(i.image) ? (
                  <Image src={displayImage(i.image)} alt={i.name} fill sizes="56px" className="object-cover" />
                ) : (
                  <ProductCover name={i.name} compact />
                )}
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center bg-ink px-1 font-mono text-[0.5625rem] text-paper">
                  {i.quantity}
                </span>
              </div>
              <div className="flex flex-1 items-center justify-between gap-3">
                <span className="line-clamp-2 text-xs leading-snug text-ink-soft">{i.name}</span>
                <span className="tnum flex-shrink-0 text-xs text-ink">
                  {formatNPR(i.price * i.quantity)}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <dl className="space-y-2 border-t border-line px-6 py-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Subtotal</dt>
            <dd className="tnum text-ink">{formatNPR(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Delivery</dt>
            <dd className={cn("tnum", deliveryFee === 0 ? "text-success" : "text-ink")}>
              {deliveryFee === 0 ? "Free" : formatNPR(deliveryFee)}
            </dd>
          </div>
        </dl>

        <div className="flex items-baseline justify-between border-t border-line px-6 py-4">
          <span className="text-sm text-ink-soft">Total</span>
          <span className="tnum font-display text-xl text-ink">{formatNPR(total)}</span>
        </div>

        <div className="border-t border-line px-6 py-5">
          <Turnstile onToken={setToken} />

          {error && (
            <p role="alert" aria-live="polite" className="mb-3 border-l-2 border-danger bg-danger-tint px-3 py-2 text-xs text-danger">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting || !token} className="btn-primary btn-lg w-full">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> Placing order…
              </>
            ) : (
              <>Place order</>
            )}
          </button>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[0.6875rem] text-ink-muted">
            <Lock className="h-3 w-3" strokeWidth={1.5} />
            Guest checkout · no account needed
          </p>
          <Link href="/cart" className="mt-2 block text-center text-xs text-ink-soft link-thread hover:text-ink">
            Back to cart
          </Link>
        </div>
      </aside>
    </form>
  );
}
