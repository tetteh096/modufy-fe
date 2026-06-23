"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, ChevronRight, FolderOpen, Tag, User } from "lucide-react";
import { publicApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { resolveBlogCoverSrc } from "@/lib/blog-cover";
import { resolveMediaUrl } from "@/lib/media-url";
import { StorefrontBlogSidebar } from "@/components/features/blog/storefront-blog-sidebar";
import { useStorefront } from "@/components/features/storefront/storefront-context";
import { SfReveal } from "@/components/features/storefront/storefront-motion";
import type { BlogPost } from "@/types/api";

type PublicBlogPostViewProps = {
  post: BlogPost | null;
};

export function PublicBlogPostView({ post }: PublicBlogPostViewProps) {
  const { sf, accent, basePath } = useStorefront();
  const slug = sf?.business_slug ?? "";

  const { data: listData } = useQuery({
    queryKey: ["public", "blog", slug],
    queryFn: () => publicApi.blogList(slug, { limit: 50 }),
    enabled: Boolean(slug) && Boolean(post),
  });

  if (!sf) return null;

  if (!post) {
    return (
      <main className="storefront-main">
        <div className="sf-blog-empty sf-blog-empty--page">
          <h1>Post not found</h1>
          <p>This article may have been removed or is not published.</p>
          <Link href={`${basePath}/blog`} className="sf-btn sf-btn-ghost">
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>
        </div>
      </main>
    );
  }

  const cover = resolveMediaUrl(resolveBlogCoverSrc(post.featured_image_url, post.slug || post.id));
  const sidebarPosts = listData?.posts ?? [];

  return (
    <main className="storefront-main storefront-main--flush sf-blog-article-page">
      <div className="sf-blog-article-topbar">
        <div className="sf-blog-article-topbar-inner">
          <nav className="sf-blog-article-crumbs" aria-label="Breadcrumb">
            <Link href={basePath}>Home</Link>
            <ChevronRight className="sf-blog-article-crumb-sep" aria-hidden />
            <Link href={`${basePath}/blog`}>Blog</Link>
            <ChevronRight className="sf-blog-article-crumb-sep" aria-hidden />
            <span>{post.title}</span>
          </nav>
          <Link href={`${basePath}/blog`} className="sf-blog-article-back">
            <ArrowLeft className="sf-blog-article-icon" aria-hidden />
            Back to all articles
          </Link>
        </div>
      </div>

      <section className="sf-blog-page-section sf-blog-article-section">
        <div className="sf-blog-page-layout">
          <article className="sf-blog-page-main">
            <div className="sf-blog-article-card">
              <header className="sf-blog-article-header">
                {post.category ? (
                  <span className="sf-blog-article-pill" style={{ background: accent }}>
                    {post.category}
                  </span>
                ) : null}
                <h1 className="sf-blog-article-title">{post.title}</h1>
                <div className="sf-blog-article-meta">
                  {post.published_at ? (
                    <span>
                      <Calendar className="sf-blog-article-icon" aria-hidden />
                      {formatDate(post.published_at)}
                    </span>
                  ) : null}
                  <span>
                    <User className="sf-blog-article-icon" aria-hidden />
                    {sf.business_name}
                  </span>
                  {post.category ? (
                    <span className="sf-blog-article-meta-category">
                      <FolderOpen className="sf-blog-article-icon" aria-hidden />
                      {post.category}
                    </span>
                  ) : null}
                </div>
                {post.excerpt ? (
                  <p className="sf-blog-article-lead">{post.excerpt}</p>
                ) : null}
              </header>

              <div className="sf-blog-article-content">
                <div className="sf-blog-article-cover-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt="" className="sf-blog-article-cover" loading="eager" />
                </div>

                <SfReveal variant="fade">
                  <div
                    className="sf-blog-article-body"
                    dangerouslySetInnerHTML={{ __html: post.body_html }}
                  />
                </SfReveal>

                {post.tags && post.tags.length > 0 ? (
                  <div className="sf-blog-article-tags">
                    <span className="sf-blog-article-tags-label">
                      <Tag className="sf-blog-article-icon" aria-hidden />
                      Tags
                    </span>
                    <ul>
                      {post.tags.map((tag) => (
                        <li key={tag}>
                          <Link href={`${basePath}/blog?q=${encodeURIComponent(tag)}`}>{tag}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <footer className="sf-blog-article-footer">
                  <Link
                    href={`${basePath}/blog`}
                    className="sf-blog-article-back-inline"
                    style={{ color: accent }}
                  >
                    <ArrowLeft className="sf-blog-article-icon" aria-hidden />
                    More articles from {sf.business_name}
                  </Link>
                </footer>
              </div>
            </div>
          </article>

          {listData ? (
            <StorefrontBlogSidebar
              posts={sidebarPosts.length > 0 ? sidebarPosts : listData.posts}
              basePath={basePath}
              accent={accent}
              businessName={sf.business_name}
              sf={sf}
              categories={listData.categories ?? []}
              tags={listData.tags ?? []}
              currentSlug={post.slug}
              blogListPath={`${basePath}/blog`}
            />
          ) : null}
        </div>
      </section>
    </main>
  );
}
