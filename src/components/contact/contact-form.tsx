"use client";

import { useState } from "react";
import { Loader2, Check, Send } from "lucide-react";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Turnstile } from "@/components/turnstile";
import { HONEYPOT_FIELD } from "@/lib/security";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [token, setToken] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.message.trim()) {
      setError("Please enter your name and a message.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken: token, [HONEYPOT_FIELD]: hp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send.");
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("idle");
    }
  };

  if (status === "sent") {
    return (
      <div className="border border-line bg-surface">
        <div className="flex flex-col items-center px-8 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-clay/40 text-clay">
            <Check className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <h2 className="mt-5 font-display text-2xl tracking-tight text-ink">Message received</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
            Thank you — we have your note and will reply soon. If it is urgent, WhatsApp is faster.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="btn-outline btn-md mt-7"
          >
            Write another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-line bg-surface p-6 sm:p-8">
      <input type="text" tabIndex={-1} autoComplete="off" className="hp-field"
        data-lpignore="true" data-1p-ignore="true" data-form-type="other"
        aria-hidden="true" name={HONEYPOT_FIELD} value={hp} onChange={(e) => setHp(e.target.value)} />

      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-xl tracking-tight text-ink">Send a message</h2>
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-muted">
          Reply within a day
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Name" required>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" autoComplete="name" />
        </Field>
        <Field label="Phone">
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="98XXXXXXXX" inputMode="tel" autoComplete="tel" />
        </Field>
        <Field label="Email">
          <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" autoComplete="email" />
        </Field>
        <Field label="Subject">
          <Input value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="How can we help?" />
        </Field>
      </div>

      <Field label="Message" required className="mt-4">
        <Textarea
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Tell us what you have in mind…"
          className="min-h-[150px]"
        />
      </Field>

      <div className="mt-4">
        <Turnstile onToken={setToken} />
      </div>

      {error && (
        <p role="alert" aria-live="polite" className="mt-4 border-l-2 border-clay bg-clay-tint px-4 py-3 text-sm text-ink">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-[26ch] text-xs leading-relaxed text-ink-muted">
          We only use your details to answer this message.
        </p>
        <button type="submit" disabled={status === "sending"} className="btn-primary btn-md">
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> Sending…
            </>
          ) : (
            <>
              Send message <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
