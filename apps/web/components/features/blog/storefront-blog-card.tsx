"use client";

import Link from "next/link";
import { ArrowRight, Calendar, FolderOpen, User } from "lucide-react";
import { formatDate } from "@/lib/format";
import { resolveBlogCoverSrc } from "@/lib/blog-cover";
import { resolveMediaUrl } from "@/lib/media-url";
import type { PublicBlogPostSummary } from "@/types/api";

type StorefrontBlogCardProps = {
  post: PublicBlogPostSummary;
  href: string;
  accent: string;
  authorName?: string;
};

export function StorefrontBlogCard({
  post,
  href,
  accent,
  authorName,
}: StorefrontBlogCardProps) {
  const cover = resolveMediaUrl(resolveBlogCoverSrc(post.featured_image_url, post.slug || post.id));
  const author = post.author_name || authorName || "Team";
  const categoryLabel = post.category || "Article";

  return (
    <article className="sf-blog-post-card">
      <Link href={href} className="sf-blog-post-card-media" tabIndex={-1}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt="" className="sf-blog-post-card-img" loading="lazy" />
        <span className="sf-blog-post-card-pill" style={{ background: accent }}>
          {categoryLabel}
        </span>
      </Link>
      <div className="sf-blog-post-card-body">
        <div className="sf-blog-post-card-meta-row">
          {post.published_at ? (
            <span className="sf-blog-post-card-meta">
              <Calendar className="h-3.5 w-3.5" style={{ color: accent }} />
              {formatDate(post.published_at)}
            </span>
          ) : null}
          <span className="sf-blog-post-card-meta">
            <User className="h-3.5 w-3.5" style={{ color: accent }} />
            {author}
          </span>
          {post.category ? (
            <span className="sf-blog-post-card-meta sf-blog-post-card-meta--category">
              <FolderOpen className="h-3.5 w-3.5" style={{ color: accent }} />
              {post.category}
            </span>
          ) : null}
        </div>
        <h2 className="sf-blog-post-card-title">
          <Link href={href}>{post.title}</Link>
        </h2>
        {post.excerpt ? <p className="sf-blog-post-card-excerpt">{post.excerpt}</p> : null}
        <Link href={href} className="sf-blog-post-card-link" style={{ color: accent }}>
          Read full article
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
