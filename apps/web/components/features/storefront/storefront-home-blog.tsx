"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar } from "lucide-react";
import { publicApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { resolveBlogCoverSrc } from "@/lib/blog-cover";
import { resolveMediaUrl } from "@/lib/media-url";
import { useStorefront } from "./storefront-context";
import { SfReveal, SfStagger, SfStaggerItem } from "./storefront-motion";
import type { PublicBlogPostSummary } from "@/types/api";

export function StorefrontHomeBlog() {
  const { sf, accent, basePath } = useStorefront();
  const slug = sf?.business_slug ?? "";

  const { data } = useQuery({
    queryKey: ["public", "blog", slug, "home"],
    queryFn: () => publicApi.blogList(slug, { limit: 4 }),
    enabled: Boolean(slug),
    staleTime: 60_000,
  });

  if (!sf) return null;

  const posts = data?.posts ?? [];
  if (posts.length === 0) return null;

  const featured = posts[0];
  const rest = posts.slice(1, 4);
  const featuredCover = resolveMediaUrl(
    resolveBlogCoverSrc(featured.featured_image_url, featured.slug || featured.id),
  );

  return (
    <div className="sf-pve-band sf-pve-band--white">
      <div className="sf-pve-band-inner">
        <section className="sf-blog-home" style={{ ["--sf-blog-accent" as string]: accent }}>
          <SfReveal variant="fade">
            <header className="sf-blog-home-head">
              <span className="sf-label">From our blog</span>
              <h2>Stories &amp; updates</h2>
              <p>Fresh reads from {sf.business_name}</p>
            </header>
          </SfReveal>

          <div className="sf-blog-home-grid">
            <SfReveal variant="scale" className="sf-blog-home-featured-wrap">
              <HomeFeatured post={featured} basePath={basePath} accent={accent} cover={featuredCover} />
            </SfReveal>

            <SfStagger className="sf-blog-home-side">
              {rest.map((post) => (
                <SfStaggerItem key={post.id}>
                  <HomeSide post={post} basePath={basePath} accent={accent} />
                </SfStaggerItem>
              ))}
              <SfStaggerItem>
                <Link href={`${basePath}/blog`} className="sf-blog-home-viewall">
                  View all articles
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </SfStaggerItem>
            </SfStagger>
          </div>
        </section>
      </div>
    </div>
  );
}

function HomeFeatured({
  post,
  basePath,
  accent,
  cover,
}: {
  post: PublicBlogPostSummary;
  basePath: string;
  accent: string;
  cover: string;
}) {
  const href = `${basePath}/blog/${post.slug}`;

  return (
    <article className="sf-blog-featured">
      <Link href={href} className="sf-blog-featured-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt="" className="sf-blog-featured-img" loading="lazy" />
        <span className="sf-blog-featured-overlay" aria-hidden />
      </Link>
      <div className="sf-blog-featured-body">
        <span className="sf-blog-pill">{post.category || "Latest"}</span>
        {post.published_at ? (
          <span className="sf-blog-meta sf-blog-meta--light">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.published_at)}
          </span>
        ) : null}
        <h3>
          <Link href={href}>{post.title}</Link>
        </h3>
        {post.excerpt ? <p>{post.excerpt}</p> : null}
        <Link href={href} className="sf-btn sf-btn-solid sf-blog-read-btn" style={{ background: accent }}>
          Read article
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function HomeSide({
  post,
  basePath,
  accent,
}: {
  post: PublicBlogPostSummary;
  basePath: string;
  accent: string;
}) {
  const href = `${basePath}/blog/${post.slug}`;
  const cover = resolveMediaUrl(
    resolveBlogCoverSrc(post.featured_image_url, post.slug || post.id),
  );

  return (
    <article className="sf-blog-side-card">
      <Link href={href} className="sf-blog-side-thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt="" className="sf-blog-side-img" loading="lazy" />
      </Link>
      <div className="sf-blog-side-copy">
        {post.published_at ? (
          <span className="sf-blog-meta sf-blog-meta--sm">
            <Calendar className="h-3 w-3" />
            {formatDate(post.published_at)}
          </span>
        ) : null}
        <h4>
          <Link href={href}>{post.title}</Link>
        </h4>
        <Link href={href} className="sf-blog-side-link" style={{ color: accent }}>
          Read more
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
