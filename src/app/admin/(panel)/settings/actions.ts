"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Trim a field and turn "" into null. */
function text(value: FormDataEntryValue | null): string | null {
  const v = String(value ?? "").trim();
  return v.length ? v : null;
}

export async function saveSettings(formData: FormData) {
  const supabase = createClient();

  // Core settings — columns that always exist in the base schema.
  const core = {
    store_name: String(formData.get("store_name") ?? "").trim(),
    store_email: String(formData.get("store_email") ?? "").trim(),
    store_phone: String(formData.get("store_phone") ?? "").trim(),
    whatsapp: String(formData.get("whatsapp") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    currency: String(formData.get("currency") ?? "NPR").trim(),
    delivery_fee: Number(formData.get("delivery_fee") ?? 0),
    free_delivery_over: Number(formData.get("free_delivery_over") ?? 0),
    custom_art_price: Number(formData.get("custom_art_price") ?? 0),
    custom_art_days: String(formData.get("custom_art_days") ?? "").trim(),
    hero_headline: String(formData.get("hero_headline") ?? "").trim(),
    hero_tagline: String(formData.get("hero_tagline") ?? "").trim(),
    cod_enabled: formData.get("cod_enabled") === "on",
    esewa_enabled: formData.get("esewa_enabled") === "on",
    khalti_enabled: formData.get("khalti_enabled") === "on",
    bank_enabled: formData.get("bank_enabled") === "on",
  };

  // Manual payment destinations — these live in the optional 04_payments.sql
  // migration. Blank strings become null so checkout can treat "not
  // configured" and "cleared" the same way.
  const payments = {
    esewa_id: text(formData.get("esewa_id")),
    khalti_id: text(formData.get("khalti_id")),
    bank_name: text(formData.get("bank_name")),
    bank_account_name: text(formData.get("bank_account_name")),
    bank_account_number: text(formData.get("bank_account_number")),
    bank_qr_url: text(formData.get("bank_qr_url")),
    payment_note: text(formData.get("payment_note")),
  };

  // Try to save everything at once (works once 04_payments.sql has been run).
  const full = await supabase
    .from("settings")
    .update({ ...core, ...payments })
    .eq("id", 1);

  if (full.error) {
    // If the payment columns don't exist yet (migration not applied), the
    // whole update is rejected. Fall back to saving just the core settings
    // so the rest of the form still works. PostgREST reports a missing
    // column with code PGRST204 / "schema cache" in the message.
    const missingColumn =
      full.error.code === "PGRST204" ||
      /column|schema cache/i.test(full.error.message);

    if (!missingColumn) {
      throw new Error(`Failed to save settings: ${full.error.message}`);
    }

    const coreOnly = await supabase.from("settings").update(core).eq("id", 1);
    if (coreOnly.error) {
      throw new Error(`Failed to save settings: ${coreOnly.error.message}`);
    }
    // Core saved; payment fields were skipped because the migration is
    // pending. Not fatal — the storefront works without them.
  }

  // Settings feed the homepage hero, delivery fees, etc.
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/checkout");
  revalidatePath("/custom-art");
}
