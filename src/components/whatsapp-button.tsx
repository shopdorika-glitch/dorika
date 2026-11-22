"use client";

import { siteConfig, whatsappLink } from "@/lib/config";

/**
 * Floating WhatsApp entry point.
 *
 * Kept visually quiet — a paper chip with the WhatsApp green used only for the
 * mark — so it reads as part of the storefront rather than a third-party
 * badge pasted on top of it.
 */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink(siteConfig.contact.whatsappPrefill)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Dorika on WhatsApp"
      className="group fixed bottom-4 left-4 z-40 flex h-11 items-center gap-2 rounded-xs border border-line bg-surface/95 px-3 text-ink shadow-lift backdrop-blur transition-colors duration-300 hover:border-ink sm:bottom-6 sm:left-6"
    >
      <svg viewBox="0 0 32 32" className="h-[18px] w-[18px] fill-[#25D366]" aria-hidden="true">
        <path d="M16 3C8.82 3 3 8.82 3 16c0 2.3.6 4.46 1.66 6.33L3 29l6.84-1.8A12.9 12.9 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm7.62 18.38c-.32.9-1.6 1.66-2.62 1.88-.7.15-1.6.27-4.65-1-3.9-1.62-6.4-5.58-6.6-5.84-.19-.26-1.57-2.1-1.57-4s1-2.84 1.35-3.23c.29-.32.76-.47 1.2-.47.15 0 .28 0 .4.01.35.02.53.04.76.6.29.7 1 2.43 1.08 2.6.09.18.15.39.03.63-.11.24-.17.39-.34.6-.17.2-.36.45-.51.6-.17.17-.35.36-.15.7.2.35.9 1.48 1.93 2.4 1.32 1.18 2.44 1.54 2.79 1.69.35.15.56.12.76-.07.2-.2.88-1.02 1.11-1.37.23-.35.47-.29.79-.17.32.11 2.04.96 2.39 1.14.35.17.58.26.66.4.09.15.09.83-.23 1.73z" />
      </svg>
      <span className="hidden font-mono text-[0.6875rem] uppercase tracking-[0.12em] sm:inline">
        WhatsApp
      </span>
    </a>
  );
}
