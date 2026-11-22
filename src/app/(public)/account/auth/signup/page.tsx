import type { Metadata } from "next";
import Link from "next/link";
import { Field, Input } from "@/components/ui/input";
import {
  AuthShell,
  FormError,
  SupabaseSetupNotice,
} from "@/components/account/auth-shell";
import { isSupabaseConfigured } from "@/lib/env";
import { signUpAction } from "../actions";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  missing: "Please fill in your name, email and password.",
  phone: "Enter a valid Nepali mobile number (e.g. 98XXXXXXXX).",
  weak: "Use at least 8 characters for your password.",
  mismatch: "The two passwords don't match.",
  exists: "An account with that email already exists. Try signing in instead.",
  failed: "We couldn't create the account. Please try again.",
  not_configured: "Accounts aren't switched on yet — see the note below.",
};

export default function SignUpPage({
  searchParams,
}: {
  searchParams: { error?: string; redirect?: string };
}) {
  const configured = isSupabaseConfigured();
  const error = searchParams.error ? ERRORS[searchParams.error] ?? "Something went wrong." : null;

  return (
    <AuthShell
      eyebrow="Optional"
      title="Create your account"
      subtitle="Save your details, see every order in one place, and reuse addresses at checkout. You never need an account to buy from Dorika."
      below={
        <p className="text-center text-sm text-ink-soft">
          Already have one?{" "}
          <Link href="/account/auth/login" className="font-semibold text-clay hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      {!configured ? (
        <SupabaseSetupNotice />
      ) : (
        <>
          <FormError message={error} />

          <form action={signUpAction} className="space-y-4">
            <Field label="Full name" htmlFor="full_name" required>
              <Input
                id="full_name"
                name="full_name"
                autoComplete="name"
                placeholder="Sita Sharma"
                required
              />
            </Field>
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
            <Field
              label="Mobile number"
              htmlFor="phone"
              hint="Used to attach any orders you placed earlier as a guest."
            >
              <Input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="98XXXXXXXX"
              />
            </Field>
            <Field label="Password" htmlFor="password" required hint="At least 8 characters.">
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
            <Field label="Confirm password" htmlFor="confirm_password" required>
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
              Create account
            </button>

            <p className="text-center text-xs leading-relaxed text-ink-muted">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="font-semibold text-clay hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-semibold text-clay hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </>
      )}
    </AuthShell>
  );
}
