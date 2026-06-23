"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { PenLine } from "lucide-react";
import { publicApi } from "@/lib/api";
import { StorefrontBlogPageBanner } from "@/components/features/blog/storefront-blog-page-banner";
import { StorefrontBlogCard } from "@/components/features/blog/storefront-blog-card";
import { StorefrontBlogSidebar } from "@/components/features/blog/storefront-blog-sidebar";
import { useStorefront } from "@/components/features/storefront/storefront-context";
import { SfReveal, SfStagger, SfStaggerItem } from "@/components/features/storefront/storefront-motion";
import { Spinner } from "@/components/shared/spinner";

export function PublicBlogList() {
  const { sf, accent, basePath } = useStorefront();
  const searchParams = useSearchParams();
  const slug = sf?.business_slug ?? "";
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["public", "blog", slug, query, category],
    queryFn: () =>
      publicApi.blogList(slug, {
        limit: 50,
        q: query || undefined,
        category: category || undefined,
      }),
    enabled: Boolean(slug),
  });

  if (!sf) return null;

  const posts = data?.posts ?? [];
  const total = data?.total ?? posts.length;
  const categories = data?.categories ?? [];
  const tags = data?.tags ?? [];
  const lead = posts[0];
  const rangeStart = posts.length > 0 ? 1 : 0;
  const rangeEnd = posts.length;

  return (
    <main className="storefront-main storefront-main--flush">
      <StorefrontBlogPageBanner
        title={`${sf.business_name} Blog`}
        eyebrow="Updates & stories"
        description={`Practical articles, tips, and updates from the ${sf.business_name} team.`}
        coverSeed={lead?.slug}
        featuredImageUrl={lead?.featured_image_url}
      />

      <section className="sf-blog-page-section">
        <div className="sf-blog-page-layout">
          <div className="sf-blog-page-main">
            {isLoading ? (
              <div className="sf-blog-loading">
                <Spinner className="h-8 w-8" />
              </div>
            ) : error || posts.length === 0 ? (
              <SfReveal variant="fade">
                <div className="sf-blog-empty">
                  <span className="sf-blog-empty-icon">
                    <PenLine className="h-8 w-8" />
                  </span>
                  <h2>{query || category ? "No matching articles" : "No articles yet"}</h2>
                  <p>
                    {query || category
                      ? "Try a different search or browse all articles from the sidebar."
                      : "Check back soon — new posts will appear here."}
                  </p>
                </div>
              </SfReveal>
            ) : (
              <>
                <p className="sf-blog-page-count">
                  Showing {rangeStart}–{rangeEnd} of {total} article{total === 1 ? "" : "s"}.
                </p>
                <SfStagger className="sf-blog-post-stack">
                  {posts.map((post) => (
                    <SfStaggerItem key={post.id}>
                      <StorefrontBlogCard
                        post={post}
                        href={`${basePath}/blog/${post.slug}`}
                        accent={accent}
                        authorName={sf.business_name}
                      />
                    </SfStaggerItem>
                  ))}
                </SfStagger>
              </>
            )}
          </div>

          {!isLoading ? (
            <StorefrontBlogSidebar
              posts={data?.posts ?? []}
              basePath={basePath}
              accent={accent}
              businessName={sf.business_name}
              sf={sf}
              categories={categories}
              tags={tags}
              currentCategory={category || undefined}
              currentQuery={query || undefined}
            />
          ) : null}
        </div>
      </section>
    </main>
  );
}
