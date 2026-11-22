import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig, whatsappLink } from "@/lib/config";
import { ThreadRule } from "@/components/ui/ornaments";

export function CtaBanner() {
  return (
    <section className="bg-clay text-white">
      <div className="shell py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-white/70">
            Custom String Face Art
          </p>
          <h2 className="display-2 mt-5 text-white">
            Send a photograph.
            <br />
            Receive a portrait in thread.
          </h2>
          <p className="mx-auto mt-5 max-w-md leading-relaxed text-white/80">
            45 cm round plank · {siteConfig.customArt.makingTime} making time · delivered anywhere
            in Nepal. No account needed.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <Link
              href="/custom-art"
              className="group inline-flex items-center gap-2.5 bg-ondeep px-6 py-3.5 text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-ink transition-colors duration-300 hover:bg-deep hover:text-ondeep"
            >
              Start your portrait
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/40 px-6 py-3.5 text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
        <div className="mt-14 text-white/35">
          <ThreadRule tone="current" />
        </div>
      </div>
    </section>
  );
}
