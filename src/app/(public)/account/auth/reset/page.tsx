import type { Metadata } from "next";
import Link from "next/link";
import { Field, Input } from "@/components/ui/input";
import {
  AuthShell,
  FormError,
  FormSuccess,
  SupabaseSetupNotice,
} from "@/components/account/auth-shell";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { requestResetAction, updatePasswordAction } from "../actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  missing: "Enter the email you signed up with.",
  weak: "Use at least 8 characters for your new password.",
  mismatch: "The two passwords don't match.",
  expired: "Your reset link has expired. Request a new one.",
  failed: "We couldn't update the password. Try again.",
  not_configured: "Accounts aren't switched on yet — see the note below.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; sent?: string };
}) {
  const configured = isSupabaseConfigured();
  const error = searchParams.error ? ERRORS[searchParams.error] ?? "Something went wrong." : null;

  // A recovery link lands here with an active session, so we can let the
  // customer set a new password immediately.
  let hasSession = false;
  let email: string | null = null;
  if (configured) {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      hasSession = !!user;
      email = user?.email ?? null;
    } catch {
      hasSession = false;
    }
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      title={hasSession ? "Choose a new password" : "Reset your password"}
      subtitle={
        hasSession
          ? `You're verified${email ? ` as ${email}` : ""}. Set a new password below.`
          : "We'll email you a secure link to set a new password."
      }
      below={
        <p className="text-center text-sm text-ink-soft">
          <Link href="/account/auth/login" className="font-semibold text-clay hover:underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      {!configured ? (
        <SupabaseSetupNotice />
      ) : hasSession ? (
        <>
          <FormError message={error} />
          <form action={updatePasswordAction} className="space-y-4">
            <Field label="New password" htmlFor="password" required hint="At least 8 characters.">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                minLength={8}
                required
              />
            </Field>
            <Field label="Confirm new password" htmlFor="confirm_password" required>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                minLength={8}
                required
              />
            </Field>
            <button type="submit" className="btn-primary btn-lg w-full">
              Save new password
            </button>
          </form>
        </>
      ) : (
        <>
          {searchParams.sent === "1" && (
            <FormSuccess message="If that email is registered, a reset link is on its way. It expires in one hour." />
          )}
          <FormError message={error} />
          <form action={requestResetAction} className="space-y-4">
            <Field label="Email" htmlFor="email" required>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </Field>
            <button type="submit" className="btn-primary btn-lg w-full">
              Send reset link
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}
