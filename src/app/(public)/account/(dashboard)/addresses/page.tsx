import type { Metadata } from "next";
import Link from "next/link";
import { Check, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { requireCustomerSession } from "@/lib/auth";
import { getAccountAddresses, getAccountProfile } from "@/lib/account-queries";
import { PanelHeader, Notice } from "@/components/account/ui";
import { Field, Input } from "@/components/ui/input";
import {
  deleteAddressAction,
  saveAddressAction,
  setDefaultAddressAction,
} from "../../actions";

export const metadata: Metadata = {
  title: "Addresses",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  required: "Name, mobile, district and street address are required.",
  phone: "Enter a valid Nepali mobile number (e.g. 98XXXXXXXX).",
  failed: "We couldn't save that. Please try again.",
  not_configured: "Accounts are not configured on this deployment.",
};

const OK: Record<string, string> = {
  saved: "Address saved.",
  deleted: "Address removed.",
  default: "Default address updated.",
};

export default async function AccountAddressesPage({
  searchParams,
}: {
  searchParams: { ok?: string; error?: string; edit?: string; new?: string };
}) {
  const session = await requireCustomerSession();
  const [addresses, profile] = await Promise.all([
    getAccountAddresses(session.userId),
    getAccountProfile(session.userId, session.email),
  ]);

  const editing = searchParams.edit ? addresses.find((a) => a.id === searchParams.edit) ?? null : null;
  const showForm = !!editing || searchParams.new === "1" || addresses.length === 0;

  return (
    <>
      <PanelHeader
        title="Addresses"
        subtitle="Saved delivery addresses make checkout one tap faster."
        action={
          !showForm ? (
            <Link href="/account/addresses?new=1" className="btn-primary btn-sm">
              <Plus className="h-4 w-4" /> Add address
            </Link>
          ) : undefined
        }
      />

      {searchParams.ok && OK[searchParams.ok] && <Notice kind="success">{OK[searchParams.ok]}</Notice>}
      {searchParams.error && (
        <Notice kind="error">{ERRORS[searchParams.error] ?? "Something went wrong."}</Notice>
      )}

      {showForm && (
        <div className="card mb-5 p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-medium">{editing ? "Edit address" : "New address"}</h2>
            {(editing || addresses.length > 0) && (
              <Link
                href="/account/addresses"
                className="text-sm font-semibold text-ink-soft hover:text-clay"
              >
                Cancel
              </Link>
            )}
          </div>

          <form action={saveAddressAction} className="space-y-4">
            {editing && <input type="hidden" name="id" value={editing.id} />}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Label" htmlFor="label" hint="e.g. Home, Office">
                <Input
                  id="label"
                  name="label"
                  defaultValue={editing?.label ?? "Home"}
                  placeholder="Home"
                />
              </Field>
              <Field label="Full name" htmlFor="full_name" required>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={editing?.full_name ?? profile.full_name ?? ""}
                  placeholder="Sita Sharma"
                  required
                />
              </Field>
              <Field label="Mobile number" htmlFor="phone" required>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  defaultValue={editing?.phone ?? profile.phone ?? ""}
                  placeholder="98XXXXXXXX"
                  required
                />
              </Field>
              <Field label="District" htmlFor="district" required>
                <Input
                  id="district"
                  name="district"
                  defaultValue={editing?.district ?? ""}
                  placeholder="e.g. Tanahun"
                  required
                />
              </Field>
              <Field label="City / municipality" htmlFor="city">
                <Input
                  id="city"
                  name="city"
                  defaultValue={editing?.city ?? ""}
                  placeholder="e.g. Khairenitar"
                />
              </Field>
              <Field label="Landmark" htmlFor="landmark">
                <Input
                  id="landmark"
                  name="landmark"
                  defaultValue={editing?.landmark ?? ""}
                  placeholder="Near the school"
                />
              </Field>
            </div>

            <Field label="Street address" htmlFor="address" required>
              <Input
                id="address"
                name="address"
                defaultValue={editing?.address ?? ""}
                placeholder="Ward 4, house no. 12"
                required
              />
            </Field>

            <label className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
              <input
                type="checkbox"
                name="is_default"
                defaultChecked={editing?.is_default ?? addresses.length === 0}
                className="h-4 w-4 rounded border-charcoal-300 text-clay"
              />
              Use as my default address
            </label>

            <button type="submit" className="btn-primary btn-md">
              {editing ? "Save address" : "Add address"}
            </button>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <p className="text-sm text-ink-muted">
          No addresses saved yet — add one above and it will appear at checkout.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className="card flex flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-ink">{address.label || "Address"}</p>
                {address.is_default && (
                  <span className="badge bg-clay-tint text-clay">
                    <Star className="h-3 w-3" /> Default
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-ink">{address.full_name}</p>
              <p className="text-sm text-ink-soft">{address.phone}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {[address.address, address.city, address.district].filter(Boolean).join(", ")}
                {address.landmark ? ` (near ${address.landmark})` : ""}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                <Link
                  href={`/account/addresses?edit=${address.id}`}
                  className="inline-flex items-center gap-1 rounded-xs px-2 py-1 text-xs font-semibold text-ink-soft hover:bg-paper-2"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Link>

                {!address.is_default && (
                  <form action={setDefaultAddressAction}>
                    <input type="hidden" name="id" value={address.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded-xs px-2 py-1 text-xs font-semibold text-ink-soft hover:bg-paper-2"
                    >
                      <Check className="h-3.5 w-3.5" /> Make default
                    </button>
                  </form>
                )}

                <form action={deleteAddressAction} className="ml-auto">
                  <input type="hidden" name="id" value={address.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 rounded-xs px-2 py-1 text-xs font-semibold text-ink-muted hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
