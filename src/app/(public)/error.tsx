"use client";

import Link from "next/link";
import { RotateCcw, ArrowUpRight } from "lucide-react";
import { siteConfig, whatsappLink } from "@/lib/config";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-paper">
      <div className="shell flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-clay">
          Something came loose
        </p>
        <h1 className="display-2 mt-5 max-w-lg">This page could not be loaded.</h1>
        <p className="mt-4 max-w-md text-ink-soft">
          A thread slipped somewhere on our side. Try again — if it keeps happening, message the
          studio and we will sort it out.
        </p>
        {error.digest && (
          <p className="mt-4 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-faint">
            Reference {error.digest}
          </p>
        )}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button onClick={reset} className="btn-primary btn-md group">
            <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
            Try again
          </button>
          <Link href="/" className="btn-outline btn-md">
            Back home
          </Link>
          <a
            href={whatsappLink(`Hi ${siteConfig.name}, I hit an error on the website.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="link-thread group inline-flex items-center gap-1.5 px-2 text-sm text-ink"
          >
            Message us
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={1.5}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
