import { ModuleFullBleedHero } from "@/components/modules/module-fullbleed-hero";
import {
  BlogArticleMarquee,
  BlogCloseSection,
  BlogEditorFlow,
  BlogSeoStrip,
  BlogVisualFeatures,
} from "@/components/modules/blog/blog-visual-sections";
import { moduleHeroImages } from "@/lib/module-heroes";

export function BlogPage() {
  return (
    <>
      <ModuleFullBleedHero
        breadcrumb="Storefront Blog"
        eyebrow="Paid module"
        title="Tell your story"
        titleAccent="on your storefront."
        description="Draft, publish, and organise posts that live beside your products and bookings: with covers, tags, and SEO fields built in."
        image={moduleHeroImages.blog}
        imageAlt="Storefront blog and content"
      />
      <BlogArticleMarquee />
      <BlogEditorFlow />
      <BlogVisualFeatures />
      <BlogSeoStrip />
      <BlogCloseSection />
    </>
  );
}
