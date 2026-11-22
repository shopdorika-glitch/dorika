import Link from "next/link";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThreadRule } from "@/components/ui/ornaments";
import { siteConfig, whatsappLink } from "@/lib/config";
import type { Category } from "@/lib/types";
import { ThemeToggle } from "@/components/theme-toggle";

const STUDIO_LINKS = [
  { href: "/about", label: "Our story" },
  { href: "/custom-art", label: "String Face Art" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const SUPPORT_LINKS = [
  { href: "/shipping", label: "Shipping & returns" },
  { href: "/track", label: "Track an order" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
];

export function Footer({ categories = [] }: { categories?: Category[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-deep text-ondeep-soft">
      <div className="absolute inset-x-0 top-0 -translate-y-1/2 opacity-50">
        <ThreadRule tone="clay" />
      </div>

      <div className="shell py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10">
          {/* Brand */}
          <div className="max-w-sm">
            <Logo variant="light" />
            <p className="mt-5 text-sm leading-relaxed text-ondeep-soft">
              Hand-woven string art from Pokhara, Nepal — including our signature
              String Face Art, made from a photo you send us.
            </p>
            <div className="mt-6 space-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ondeep-soft/70">
              <p>Pokhara, Nepal</p>
            </div>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2 border-b border-ondeep/25 pb-1 text-sm text-ondeep transition-colors hover:border-clay"
            >
              Talk to the maker
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </a>
          </div>

          {/* Shop */}
          <FooterColumn title="Shop">
            <FooterLink href="/shop">All pieces</FooterLink>
            <FooterLink href="/custom-art">Custom String Face Art</FooterLink>
            {categories.slice(0, 3).map((c) => (
              <FooterLink key={c.id} href={`/shop?category=${c.slug}`}>
                {c.name}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Studio */}
          <FooterColumn title="Studio">
            {STUDIO_LINKS.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Support */}
          <FooterColumn title="Support">
            {SUPPORT_LINKS.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>

        {/* Contact + payment */}
        <div className="mt-14 grid gap-8 border-t border-ondeep/10 pt-8 md:grid-cols-2">
          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ondeep-soft/60">
                Call / WhatsApp
              </p>
              <a
                href={`tel:+${siteConfig.contact.whatsapp}`}
                className="mt-1 block text-sm text-ondeep transition-opacity hover:opacity-70"
              >
                {siteConfig.contact.phoneDisplay}
              </a>
            </div>
            <div>
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ondeep-soft/60">
                Email
              </p>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="mt-1 block break-all text-sm text-ondeep transition-opacity hover:opacity-70"
              >
                {siteConfig.contact.email}
              </a>
            </div>
            <div className="sm:col-span-2">
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ondeep-soft/60">
                Workshop
              </p>
              <p className="mt-1 text-sm text-ondeep">{siteConfig.contact.address}</p>
            </div>
          </div>

          <div className="md:justify-self-end md:text-right">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ondeep-soft/60">
              Payment
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ondeep md:justify-end">
              <li>Cash on delivery</li>
              <li className="text-ondeep-soft/40">/</li>
              <li>eSewa</li>
              <li className="text-ondeep-soft/40">/</li>
              <li>Khalti</li>
              <li className="text-ondeep-soft/40">/</li>
              <li>Bank transfer</li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-ondeep-soft/70">
              Every order is confirmed by phone before it is crafted.
            </p>
          </div>
        </div>

        {/* Legal bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-ondeep/10 pt-6 text-xs text-ondeep-soft/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. Crafted in Nepal. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em]">
              Prices in {siteConfig.currency.code}
            </span>
            <ThemeToggle className="text-ondeep-soft hover:bg-white/10 hover:text-ondeep" />
            <a
              href="#main"
              className="group inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ondeep transition-opacity hover:opacity-70"
            >
              Top
              <ArrowUp className="h-3 w-3 transition-transform group-hover:-translate-y-0.5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ondeep-soft/60">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="inline-block text-ondeep-soft transition-colors duration-200 hover:text-ondeep"
      >
        {children}
      </Link>
    </li>
  );
}
