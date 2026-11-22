// ─────────────────────────────────────────────────────────────
//  Dorika — global site configuration & brand constants
// ─────────────────────────────────────────────────────────────

/**
 * Public base URL used for canonical tags, Open Graph metadata and the
 * Supabase auth redirects.
 *
 * In production we fall back to the real domain rather than localhost, so a
 * missing env var produces a correct link instead of a broken one. The
 * deployed value should still be set explicitly — `NEXT_PUBLIC_*` vars are
 * baked in at build time, so changing it requires a redeploy.
 */
function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return process.env.NODE_ENV === "production"
    ? "https://dorika.shop"
    : "http://localhost:3000";
}

export const siteConfig = {
  name: "Dorika",
  tagline: "Crafted string art from the heart of Nepal",
  description:
    "Dorika crafts string art in Nepal — including custom String Face Art woven from your photo on a 45cm plank. Delivered across Nepal.",
  url: resolveSiteUrl(),

  contact: {
    phone: "9708285877",
    phoneDisplay: "+977 9708285877",
    whatsapp: "9779708285877",
    whatsappUrl: "https://wa.me/9779708285877",
    whatsappPrefill:
      "Hi Dorika, I want to know more about your string art.",
    email: "shopdorika@gmail.com",
    address: "Pokhara, Nepal",
  },

  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    youtube: "https://youtube.com",
  },

  currency: {
    code: "NPR",
    symbol: "Rs.",
  },

  // Signature product spec (shown on the Custom Art page)
  customArt: {
    plankSize: "45cm diameter round plank",
    price: 4600,
    compareAtPrice: 4900,
    makingTime: "4–5 days",
  },

  // Google Maps embed for Pokhara, Nepal
  mapEmbed:
    "https://www.google.com/maps?q=Pokhara,Nepal&output=embed",
} as const;

// Build a WhatsApp deep-link with an optional custom message
export function whatsappLink(message?: string) {
  const text = encodeURIComponent(message ?? siteConfig.contact.whatsappPrefill);
  return `${siteConfig.contact.whatsappUrl}?text=${text}`;
}

// ── Placeholder images ───────────────────────────────────────
// Stock placeholder photos are suppressed on purpose.
//
// Reason: they are fetched from a third party and, historically, resized on
// demand by a host with 0.1 CPU — which cost up to 5s per image. Real photos
// live in public/products/ and are served as plain static files, so they are
// always shown. Anything still pointing at a stock placeholder renders as an
// empty cream tile instead of downloading someone else's photo.
//
// Set to `false` to let the stock placeholders show again (e.g. on a fresh
// seed with no real photos yet).
export const HIDE_PLACEHOLDER_IMAGES = true;

/** 1x1 transparent SVG — renders instantly and downloads nothing. */
export const BLANK_IMAGE =
  "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'1'%20height%3D'1'%2F%3E";

/** Hosts that serve throwaway stock placeholders, never real catalogue art. */
const PLACEHOLDER_HOSTS = ["picsum.photos", "images.unsplash.com"];

function isPlaceholderUrl(url: string): boolean {
  return PLACEHOLDER_HOSTS.some((h) => url.includes(h));
}

/**
 * Resolve any stored image URL to something safe to render.
 * Real photos pass through untouched; placeholders become the blank tile.
 */
export function displayImage(url: string | null | undefined): string {
  if (!url) return BLANK_IMAGE;
  if (HIDE_PLACEHOLDER_IMAGES && isPlaceholderUrl(url)) return BLANK_IMAGE;
  return url;
}

/** True when the URL is a real photo that should be shown as an image. */
export function hasRealImage(url: string | null | undefined): boolean {
  return !!url && !(HIDE_PLACEHOLDER_IMAGES && isPlaceholderUrl(url));
}

export const placeholderConfig = {
  // Deterministic placeholder from a seed string
  product: (seed: string, size = 900) =>
    HIDE_PLACEHOLDER_IMAGES
      ? BLANK_IMAGE
      : `https://picsum.photos/seed/${encodeURIComponent(seed)}/${size}/${size}`,
  wide: (seed: string) =>
    HIDE_PLACEHOLDER_IMAGES
      ? BLANK_IMAGE
      : `https://picsum.photos/seed/${encodeURIComponent(seed)}/1600/900`,
  // Fallback when a product has no images at all
  fallback: HIDE_PLACEHOLDER_IMAGES
    ? BLANK_IMAGE
    : "https://picsum.photos/seed/dorika-fallback/900/900",
};

export function productImage(images: string[] | null | undefined, index = 0) {
  const url = images && images.length > index ? images[index] : undefined;
  return displayImage(url ?? placeholderConfig.fallback);
}

/** Gallery for the product page. */
export function productGallery(images: string[] | null | undefined): string[] {
  const list = (images ?? []).filter(Boolean).map(displayImage);
  return list.length ? list : [placeholderConfig.fallback];
}

// Nav links (shared by navbar + footer)
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/custom-art", label: "Custom Art" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/track", label: "Track Order" },
] as const;
