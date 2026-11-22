import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className="flex-1 bg-paper">
        <div className="shell flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
          <svg
            aria-hidden="true"
            viewBox="0 0 320 90"
            className="h-[70px] w-[280px] text-clay"
            fill="none"
          >
            <path
              d="M4 62 C 48 20, 88 74, 132 44 S 214 12, 262 54"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray="5 6"
            />
            <circle cx="4" cy="62" r="3" fill="currentColor" />
            <circle cx="262" cy="54" r="4.5" fill="currentColor" />
            <circle cx="262" cy="54" r="9" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          </svg>

          <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-muted">
            Error 404
          </p>
          <h1 className="display-2 mt-4 max-w-xl">This thread led nowhere</h1>
          <p className="mt-4 max-w-md text-ink-soft">
            The page you were looking for has moved, or never existed. The work, however, is still
            here.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link href="/" className="btn-primary btn-lg group">
              Back home
              <ArrowRight className="btn-arrow h-4 w-4" strokeWidth={1.5} />
            </Link>
            <Link href="/shop" className="link-thread text-sm font-medium">
              Browse the collection
            </Link>
            <Link href="/custom-art" className="link-thread text-sm text-ink-soft hover:text-ink">
              Commission a portrait
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
