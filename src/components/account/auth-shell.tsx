import Link from "next/link";
import { Database } from "lucide-react";

// Shared frame for /account/auth/* pages.
export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  below,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  below?: React.ReactNode;
}) {
  return (
    <div className="bg-paper-2">
      <div className="shell flex min-h-[72vh] items-center justify-center py-14">
        <div className="w-full max-w-md">
          <div className="border border-line bg-surface p-7 sm:p-9">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-3 font-display text-[1.9rem] leading-tight tracking-display text-ink">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
          {below && <div className="mt-4">{below}</div>}
          <p className="mt-6 text-center text-xs leading-relaxed text-ink-muted">
            An account is always optional —{" "}
            <Link href="/shop" className="text-ink link-thread">
              keep shopping as a guest
            </Link>{" "}
            or{" "}
            <Link href="/track" className="text-ink link-thread">
              track an order
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div role="alert" className="mb-4 border-l-2 border-danger bg-danger-tint px-4 py-3 text-sm text-danger">
      {message}
    </div>
  );
}

export function FormSuccess({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div role="status" className="mb-4 border-l-2 border-success bg-success-tint px-4 py-3 text-sm text-success">
      {message}
    </div>
  );
}

// Shown when NEXT_PUBLIC_SUPABASE_* is missing, so nobody hits a crash.
export function SupabaseSetupNotice() {
  return (
    <div className="border-l-2 border-clay bg-clay-tint p-4 text-sm text-ink">
      <p className="flex items-center gap-2 font-medium">
        <Database className="h-4 w-4" strokeWidth={1.5} /> Accounts are not switched on yet
      </p>
      <p className="mt-2 leading-relaxed text-ink-soft">
        Add <code className="bg-surface px-1 font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="bg-surface px-1 font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
        <code className="bg-surface px-1 font-mono text-xs">.env.local</code>, run the SQL in{" "}
        <code className="bg-surface px-1 font-mono text-xs">supabase/</code>, then restart the
        server. Shopping, checkout and order tracking keep working without it.
      </p>
    </div>
  );
}
