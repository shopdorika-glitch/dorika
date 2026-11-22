import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { requireCustomerSession } from "@/lib/auth";
import { getAccountProfile } from "@/lib/account-queries";
import { PanelHeader, Notice } from "@/components/account/ui";
import { Field, Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { updateProfileAction } from "../../actions";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  name: "Please enter your full name.",
  phone: "Enter a valid Nepali mobile number (e.g. 98XXXXXXXX).",
  failed: "We couldn't save your changes. Please try again.",
  not_configured: "Accounts are not configured on this deployment.",
};

export default async function AccountProfilePage({
  searchParams,
}: {
  searchParams: { ok?: string; error?: string };
}) {
  const session = await requireCustomerSession();
  const profile = await getAccountProfile(session.userId, session.email);
  const error = searchParams.error ? ERRORS[searchParams.error] ?? "Something went wrong." : null;

  return (
    <>
      <PanelHeader
        title="Profile"
        subtitle="Your name and mobile number are used to match past guest orders to this account."
      />

      {searchParams.ok === "saved" && <Notice kind="success">Profile saved.</Notice>}
      {error && <Notice kind="error">{error}</Notice>}

      <div className="grid gap-4 lg:grid-cols-[1fr_290px]">
        <div className="card p-4 sm:p-6">
          <form action={updateProfileAction} className="space-y-4">
            <Field label="Full name" htmlFor="full_name" required>
              <Input
                id="full_name"
                name="full_name"
                autoComplete="name"
                defaultValue={profile.full_name ?? ""}
                placeholder="Sita Sharma"
                required
              />
            </Field>

            <Field
              label="Mobile number"
              htmlFor="phone"
              hint="Nepali mobile, 10 digits. This is how we find orders you placed as a guest."
            >
              <Input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                defaultValue={profile.phone ?? ""}
                placeholder="98XXXXXXXX"
              />
            </Field>

            <Field label="Email" htmlFor="email" hint="Contact us on WhatsApp if you need this changed.">
              <Input id="email" name="email" type="email" defaultValue={profile.email ?? ""} disabled />
            </Field>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button type="submit" className="btn-primary btn-md">
                Save changes
              </button>
              <Link href="/account/addresses" className="btn-ghost btn-md">
                Manage addresses
              </Link>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="card p-4 sm:p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-ink">
              <KeyRound className="h-4 w-4 text-clay" /> Password
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Choose a new password any time — you stay signed in on this device.
            </p>
            <Link href="/account/auth/reset" className="btn-outline btn-sm mt-4 w-full">
              Change password
            </Link>
          </div>

          <div className="card p-4 text-xs leading-relaxed text-ink-muted sm:p-5">
            <p>
              <span className="font-semibold text-ink-soft">Member since:</span>{" "}
              {formatDate(profile.created_at)}
            </p>
            <p className="mt-1">
              <span className="font-semibold text-ink-soft">Account ID:</span>{" "}
              <span className="break-all">{profile.id.slice(0, 8)}…</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
