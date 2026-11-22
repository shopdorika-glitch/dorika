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
import { signInAction } from "../actions";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  missing: "Please enter your email and password.",
  invalid: "That email and password don't match. Try again.",
  unconfirmed: "That account exists but its email isn't confirmed yet — open the link in your inbox, then sign in.",
  failed: "Sign-in failed for an unexpected reason. Please try again.",
  not_configured: "Accounts aren't switched on yet — see the note below.",
  link_expired: "That link has expired or was already used. Request a fresh one.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; sent?: string; email?: string; redirect?: string };
}) {
  const configured = isSupabaseConfigured();
  const error = searchParams.error ? ERRORS[searchParams.error] ?? "Something went wrong." : null;
  const sent = searchParams.sent === "1";
  const redirectTo =
    typeof searchParams.redirect === "string" && searchParams.redirect.startsWith("/account")
      ? searchParams.redirect
      : "/account";

  return (
    <AuthShell
      eyebrow="Your account"
      title="Welcome back"
      subtitle="Sign in to see your orders and custom art requests. Guests can always track orders without an account."
      below={
        <p className="text-center text-sm text-ink-soft">
          New to Dorika?{" "}
          <Link
            href={`/account/auth/signup${redirectTo !== "/account" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            className="font-semibold text-clay hover:underline"
          >
            Create an account
          </Link>
        </p>
      }
    >
      {!configured ? (
        <SupabaseSetupNotice />
      ) : (
        <>
          {sent && (
            <FormSuccess message="Confirmation sent. Open the link in your email, then sign in here." />
          )}
          <FormError message={error} />

          <form action={signInAction} className="space-y-4">
            <input type="hidden" name="redirect" value={redirectTo} />
            <Field label="Email" htmlFor="email" required>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                defaultValue={searchParams.email ?? ""}
                required
              />
            </Field>
            <Field label="Password" htmlFor="password" required>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </Field>

            <div className="flex items-center justify-between text-sm">
              <Link
                href="/account/auth/reset"
                className="font-semibold text-ink-soft hover:text-clay"
              >
                Forgot password?
              </Link>
              <Link href="/track" className="font-semibold text-ink-soft hover:text-clay">
                Track an order
              </Link>
            </div>

            <button type="submit" className="btn-primary btn-lg w-full">
              Sign in
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}
