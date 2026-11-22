"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import {
  Upload, Camera, Check, ChevronLeft, ChevronRight, Loader2, X, Image as ImageIcon,
} from "lucide-react";
import { Field, Input, Textarea, Select } from "@/components/ui/input";
import { Turnstile } from "@/components/turnstile";
import { HONEYPOT_FIELD } from "@/lib/security";
import { formatNPR, cn, isValidNepaliPhone } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

const DRAFT_KEY = "dorika_custom_draft_v1";
const STEPS = ["Photo", "Details", "Review", "Done"] as const;

interface FormState {
  full_name: string; phone: string; whatsapp: string; sameWhatsapp: boolean;
  email: string; district: string; municipality: string; ward_tole: string;
  full_address: string; landmark: string;
  alt_phone: string; preferred_date: string; gift_or_self: string;
  background_pref: string; special_instructions: string;
}

const emptyForm: FormState = {
  full_name: "", phone: "", whatsapp: "", sameWhatsapp: true, email: "",
  district: "", municipality: "", ward_tole: "", full_address: "", landmark: "",
  alt_phone: "", preferred_date: "", gift_or_self: "", background_pref: "", special_instructions: "",
};

export function CustomArtBuilder({ price, makingTime }: { price: number; makingTime: string }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ request_no: string } | null>(null);
  const [token, setToken] = useState("");
  const [hp, setHp] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Restore draft (text fields only — files can't persist)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) setForm({ ...emptyForm, ...JSON.parse(raw) });
    } catch {/* ignore */}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(form)); } catch {/* ignore */}
  }, [form]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please upload a JPG, PNG or WEBP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image is too large. Max size is 10MB.");
      return;
    }
    setCompressing(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
        fileType: file.type === "image/png" ? "image/png" : "image/jpeg",
      });
      setPhotoFile(compressed);
      setPreview(URL.createObjectURL(compressed));
    } catch {
      // Fallback to original if compression fails
      setPhotoFile(file);
      setPreview(URL.createObjectURL(file));
    } finally {
      setCompressing(false);
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const canNext = () => {
    if (step === 0) return !!photoFile;
    if (step === 1)
      return Boolean(
        form.full_name.trim() &&
        isValidNepaliPhone(form.phone) &&
        form.district.trim() &&
        form.full_address.trim()
      );
    return true;
  };

  const next = () => {
    if (!canNext()) {
      setError("Please complete the required fields before continuing.");
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const back = () => { setError(null); setStep((s) => Math.max(s - 1, 0)); };

  const submit = async () => {
    if (!photoFile) { setStep(0); return; }
    setSubmitting(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("photo", photoFile);
      const whatsapp = form.sameWhatsapp ? form.phone : form.whatsapp;
      Object.entries({ ...form, whatsapp }).forEach(([k, v]) => {
        if (k === "sameWhatsapp") return;
        fd.append(k, String(v ?? ""));
      });
      fd.append("turnstileToken", token);
      fd.append(HONEYPOT_FIELD, hp);

      const res = await fetch("/api/custom-requests", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      setResult({ request_no: data.request_no });
      setStep(STEPS.length - 1);
      localStorage.removeItem(DRAFT_KEY);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Confirmation ─────────────────────────────────────────────
  if (result) {
    const waMsg = `Hi Dorika, I just submitted my String Face Art request. My Order ID is ${result.request_no}.`;
    return (
      <div className="mx-auto max-w-xl border border-line bg-surface">
        <div className="border-b border-line px-8 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-clay/40 text-clay">
            <Check className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <h2 className="mt-5 font-display text-2xl tracking-tight text-ink">Request received</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
            Thank you — we will look at your photograph and get in touch shortly to confirm the
            portrait before we begin.
          </p>
          <div className="mt-7 border-y border-line py-4">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-muted">
              Your request ID
            </p>
            <p className="mt-1 font-mono text-xl tracking-[0.08em] text-clay">{result.request_no}</p>
          </div>
        </div>

        <div className="px-8 py-7">
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(waMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-md flex-1"
            >
              Confirm on WhatsApp
            </a>
            <a href={`/track?order=${result.request_no}`} className="btn-outline btn-md flex-1">
              Track your request
            </a>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ink-muted">
            Keep this ID — it is all you need to follow the request. Creating an account is
            optional and only adds the history to your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={panelRef} className="mx-auto max-w-3xl scroll-mt-28">
      {/* Stepper */}
      <ol className="mb-6 grid grid-cols-3 border-y border-line">
        {STEPS.slice(0, 3).map((label, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={label} className="relative py-4 pr-4">
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-px origin-left transition-transform duration-500",
                  done || current ? "scale-x-100 bg-clay" : "scale-x-0 bg-clay"
                )}
              />
              <div className="flex items-baseline gap-2.5">
                <span
                  className={cn(
                    "font-mono text-[0.6875rem] tracking-[0.1em]",
                    current ? "text-clay" : done ? "text-ink" : "text-ink-faint"
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "text-sm transition-colors",
                    current ? "text-ink" : done ? "text-ink-soft" : "text-ink-faint"
                  )}
                >
                  {label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="border border-line bg-surface">
        {/* Honeypot */}
        <input
          type="text" tabIndex={-1} autoComplete="off"
          data-lpignore="true" data-1p-ignore="true" data-form-type="other"
          className="hp-field" aria-hidden="true"
          name={HONEYPOT_FIELD} value={hp} onChange={(e) => setHp(e.target.value)}
        />

        <div className="p-6 sm:p-9">
          {/* STEP 0 — Photo */}
          {step === 0 && (
            <div>
              <h2 className="font-display text-xl tracking-tight text-ink">Upload your face photo</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                A clear, well-lit photo of the face works best. JPG, PNG or WEBP, up to 10MB — it is
                compressed on your device before it is sent.
              </p>

              {!preview ? (
                <div
                  onDrop={onDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileRef.current?.click();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Choose a photo to upload"
                  className={cn(
                    "mt-6 flex cursor-pointer flex-col items-center justify-center px-6 py-14 text-center transition-colors duration-300",
                    "border border-dashed",
                    dragOver
                      ? "border-clay bg-clay-tint"
                      : "border-line-strong bg-paper hover:border-clay hover:bg-paper-2"
                  )}
                >
                  {compressing ? (
                    <>
                      <Loader2 className="h-7 w-7 animate-spin text-clay" strokeWidth={1.5} />
                      <p className="mt-4 text-sm text-ink">Optimising your photo…</p>
                    </>
                  ) : (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-ink-soft">
                        <ImageIcon className="h-5 w-5" strokeWidth={1.25} />
                      </div>
                      <p className="mt-4 font-display text-lg tracking-tight text-ink">
                        Drop your photograph here
                      </p>
                      <p className="mt-1 text-sm text-ink-muted">or choose a file from your device</p>
                      <div className="mt-5 flex flex-wrap justify-center gap-2">
                        <span className="btn-outline btn-sm pointer-events-none">
                          <Upload className="h-3.5 w-3.5" strokeWidth={1.5} /> Browse
                        </span>
                        <span className="btn-outline btn-sm pointer-events-none">
                          <Camera className="h-3.5 w-3.5" strokeWidth={1.5} /> Camera
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="mt-6">
                  <div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden bg-paper-2">
                    <Image src={preview} alt="Your photo preview" fill className="object-cover" sizes="320px" />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={() => { setPhotoFile(null); setPreview(null); }}
                      className="inline-flex items-center gap-1.5 text-xs text-ink-soft underline decoration-line underline-offset-4 hover:text-ink"
                    >
                      <X className="h-3 w-3" strokeWidth={1.5} /> Choose a different photo
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
                capture="environment" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>
          )}

          {/* STEP 1 — Details */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-xl tracking-tight text-ink">Your details</h2>
                <p className="mt-1.5 text-sm text-ink-soft">
                  Only what we need to make and deliver the piece. No account required.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" required>
                  <Input value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="Your full name" autoComplete="name" />
                </Field>
                <Field label="Phone" required hint="Nepali mobile number">
                  <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="98XXXXXXXX" inputMode="tel" autoComplete="tel" />
                </Field>
              </div>

              <div>
                <label className="flex items-center gap-2.5 text-sm text-ink-soft">
                  <input
                    type="checkbox"
                    checked={form.sameWhatsapp}
                    onChange={(e) => set("sameWhatsapp", e.target.checked)}
                    className="h-4 w-4 rounded-none border-line text-clay accent-[rgb(var(--clay))]"
                  />
                  WhatsApp number is the same as my phone
                </label>
                {!form.sameWhatsapp && (
                  <div className="mt-3">
                    <Field label="WhatsApp number">
                      <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="WhatsApp number" inputMode="tel" />
                    </Field>
                  </div>
                )}
              </div>

              <Field label="Email" hint="Optional — for your confirmation">
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" autoComplete="email" />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="District" required>
                  <Input value={form.district} onChange={(e) => set("district", e.target.value)} placeholder="e.g. Kaski" />
                </Field>
                <Field label="Municipality / city">
                  <Input value={form.municipality} onChange={(e) => set("municipality", e.target.value)} placeholder="e.g. Byas" />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Ward / tole">
                  <Input value={form.ward_tole} onChange={(e) => set("ward_tole", e.target.value)} placeholder="Ward no. / tole" />
                </Field>
                <Field label="Nearest landmark">
                  <Input value={form.landmark} onChange={(e) => set("landmark", e.target.value)} placeholder="e.g. near Lakeside bus park" />
                </Field>
              </div>

              <Field label="Full delivery address" required>
                <Textarea value={form.full_address} onChange={(e) => set("full_address", e.target.value)} placeholder="House / street / area details" />
              </Field>

              <details className="group border-t border-line pt-4">
                <summary className="flex cursor-pointer items-center justify-between text-sm text-ink-soft transition-colors hover:text-ink">
                  Optional details — gift note, framing, timing
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" strokeWidth={1.5} />
                </summary>
                <div className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Alternate contact number">
                      <Input value={form.alt_phone} onChange={(e) => set("alt_phone", e.target.value)} placeholder="Another number" inputMode="tel" />
                    </Field>
                    <Field label="Preferred delivery date">
                      <Input type="date" value={form.preferred_date} onChange={(e) => set("preferred_date", e.target.value)} />
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Gift or self">
                      <Select value={form.gift_or_self} onChange={(e) => set("gift_or_self", e.target.value)}>
                        <option value="">Select…</option>
                        <option value="self">For myself</option>
                        <option value="gift">It&apos;s a gift</option>
                      </Select>
                    </Field>
                    <Field label="Background / frame preference">
                      <Input value={form.background_pref} onChange={(e) => set("background_pref", e.target.value)} placeholder="e.g. natural wood, black frame" />
                    </Field>
                  </div>
                  <Field label="Special instructions">
                    <Textarea value={form.special_instructions} onChange={(e) => set("special_instructions", e.target.value)} placeholder="Anything we should know?" />
                  </Field>
                </div>
              </details>
            </div>
          )}

          {/* STEP 2 — Review */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-xl tracking-tight text-ink">Review &amp; submit</h2>
              <p className="mt-1.5 text-sm text-ink-soft">
                Check the details below. We will still confirm the portrait with you before we
                start winding.
              </p>

              <div className="mt-6 grid gap-6 sm:grid-cols-[220px_1fr]">
                {preview && (
                  <div className="relative aspect-square overflow-hidden bg-paper-2">
                    <Image src={preview} alt="Your photo" fill className="object-cover" sizes="220px" />
                  </div>
                )}
                <dl className="divide-y divide-line border-y border-line text-sm">
                  <Row k="Name" v={form.full_name} />
                  <Row k="Phone" v={form.phone} />
                  <Row k="WhatsApp" v={form.sameWhatsapp ? form.phone : form.whatsapp} />
                  {form.email && <Row k="Email" v={form.email} />}
                  <Row k="District" v={form.district} />
                  {form.municipality && <Row k="City" v={form.municipality} />}
                  <Row k="Address" v={form.full_address} />
                  {form.landmark && <Row k="Landmark" v={form.landmark} />}
                </dl>
              </div>

              <dl className="mt-6 divide-y divide-line border-y border-line text-sm">
                <Row k="Plank" v={siteConfig.customArt.plankSize} />
                <Row k="Making time" v={makingTime} />
                <Row k="Price" v={formatNPR(price)} emphasis />
              </dl>

              <div className="mt-5">
                <Turnstile onToken={setToken} />
              </div>
            </div>
          )}

          {error && (
            <p
              role="alert"
              aria-live="polite"
              className="mt-5 border-l-2 border-clay bg-clay-tint px-4 py-3 text-sm text-ink"
            >
              {error}
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-4 sm:px-9">
          {step > 0 ? (
            <button type="button" onClick={back} className="btn-ghost btn-md group">
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.5} />
              Back
            </button>
          ) : (
            <span className="text-xs text-ink-muted">Step 1 of 3</span>
          )}

          {step < 2 ? (
            <button type="button" onClick={next} className="btn-primary btn-md group">
              Continue
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting || !token}
              className="btn-primary btn-md"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> Submitting…
                </>
              ) : (
                <>Submit request · {formatNPR(price)}</>
              )}
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-ink-muted">
        Your photo stays private and is used only to make your artwork.
      </p>
    </div>
  );
}

function Row({ k, v, emphasis = false }: { k: string; v: string; emphasis?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-muted">{k}</dt>
      <dd className={cn("text-right", emphasis ? "tnum text-base text-clay" : "text-ink")}>
        {v || "—"}
      </dd>
    </div>
  );
}
