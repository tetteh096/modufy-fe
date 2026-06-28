import type { Metadata } from "next";
import { BlogLatestGrid } from "@/components/blog/blog-latest-grid";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { PageHero } from "@/components/marketing/page-hero";
import { blogPosts, latestArticles } from "@/lib/blog-content";
import { pageHeroes } from "@/lib/page-heroes";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Our Blog",
  description: `Insights, updates, and guides from the ${siteConfig.name} team.`,
};

export default function BlogPage() {
  const hero = pageHeroes.blog;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
        image={hero.image}
        imageAlt={hero.imageAlt}
        breadcrumbs={[{ label: "Home", href: "/" }]}
      />
      <section className="section-padding pb-10">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              {blogPosts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
              <BlogPagination />
            </div>
            <div className="lg:col-span-4">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </section>
      <BlogLatestGrid posts={latestArticles} />
    </>
  );
}
