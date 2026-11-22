import { Hero } from "@/components/home/hero";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Signature } from "@/components/home/signature";
import { HowItWorks } from "@/components/home/how-it-works";
import { Categories } from "@/components/home/categories";
import { FaqTeaser } from "@/components/home/faq-teaser";
import { CtaBanner } from "@/components/home/cta-banner";
import { getFeaturedProducts, getCategories, getSettings } from "@/lib/queries";
import { siteConfig } from "@/lib/config";

// Read fresh on every request so admin Settings changes (hero tagline,
// headline, prices) appear immediately without waiting for a cache window.
export const revalidate = 0;

export default async function HomePage() {
  const [featured, categories, settings] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
    getSettings(),
  ]);

  const price = Number(settings?.custom_art_price ?? siteConfig.customArt.price);
  const makingTime = settings?.custom_art_days ?? siteConfig.customArt.makingTime;

  return (
    <>
      <Hero
        headline={settings?.hero_headline || siteConfig.tagline}
        tagline={settings?.hero_tagline || siteConfig.description}
      />
      <FeaturedProducts products={featured} />
      <Signature price={price} makingTime={makingTime} />
      <HowItWorks />
      <Categories categories={categories} />
      <FaqTeaser />
      <CtaBanner />
    </>
  );
}
